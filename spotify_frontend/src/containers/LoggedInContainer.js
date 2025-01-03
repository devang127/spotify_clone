import { Children, useContext, useEffect, useState, useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import spotify_logo from "../assets/images/spotify_logo_white.svg";
import IconText from "../components/shared/IconText";
import { Icon } from '@iconify/react';
import TextWithHover from "../components/shared/TextWithHover";
import { Howl, Howler } from "howler";
import songContext from "../context/songContext";
import CreatePlaylistModal from "../modals/CreatePlaylistModal";
import AddToPlaylistModal from "../modals/AddToPlaylistModal";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../utils/serverHelpers";
import React, { memo } from 'react';

const LoggedInContainer = memo(({ children, curActiveScreen }) => {
    const [createPlaylistModalOpen, setcreatePlaylistModalOpen] = useState(false);
    const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);
    const [likedSongs, setLikedSongs] = useState([]);
    const isLiked = (songId) => likedSongs.includes(songId);
    const [duration, setDuration] = useState(0);

    const {
        currentSong,
        setCurrentSong,
        soundPlayed,
        setSoundPlayed,
        isPaused,
        setIsPaused,
        queue,
        setQueue,
        isShuffled,
        setIsShuffled,
        isRepeating,
        setIsRepeating,
        currentSongIndex,
        setCurrentSongIndex,
        currentTime,
        setCurrentTime,
    } = useContext(songContext);

    const firstUpdate = useRef(true);
    const [shuffledQueue, setShuffledQueue] = useState([]);

    // Keep shuffledQueue in sync with queue and isShuffled
    useEffect(() => {
        if (isShuffled) {
            setShuffledQueue([...queue].sort(() => Math.random() - 0.5));
        } else {
            setShuffledQueue([...queue]);
        }
    }, [queue, isShuffled]);

    useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        if (!currentSong) {
            return;
        }
        changeSong(currentSong.track);
    }, [currentSong && currentSong.track]);

    const addSongToPlaylist = async (playlistId) => {
        const songId = currentSong._id;
        const payload = { playlistId, songId };
        const response = await makeAuthenticatedPOSTRequest("/playlist/add/song", payload);
        if (response._id) {
            setAddToPlaylistModalOpen(false);
        }
    };

    const addSongToQueue = (song) => {
        setQueue([...queue, song]);
        if (isShuffled) {
            setShuffledQueue([...shuffledQueue, song]);
        }
    };

    const setQueueAndPlay = (songs, indexToPlay) => {
        setQueue(songs);
        setIsShuffled(false);
        setShuffledQueue([...songs]);
        setCurrentSongIndex(indexToPlay);
        if (songs.length > 0) {
          setCurrentSong(songs[indexToPlay]);
          if (!isPaused) {
            changeSong(songs[indexToPlay].track);
          }
        }
      };

    const playNext = () => {
        if (queue.length === 0) return;
    
        let nextIndex;
        if (isRepeating) {
            nextIndex = currentSongIndex;
        } else {
            nextIndex = (currentSongIndex + 1) % queue.length;
        }
        setCurrentSongIndex(nextIndex);
        const nextSong = isShuffled ? shuffledQueue[nextIndex] : queue[nextIndex];
        setCurrentSong(nextSong);
    };

    const playPrevious = () => {
        if (queue.length === 0) return;

        const prevIndex = currentSongIndex <= 0 ? queue.length - 1 : currentSongIndex - 1;
        setCurrentSongIndex(prevIndex);
        const prevSong = isShuffled ? shuffledQueue[prevIndex] : queue[prevIndex];
        setCurrentSong(prevSong);

        console.log('Queue length:', queue.length);
        console.log('Shuffled queue length:', shuffledQueue.length);
        console.log('Current index:', currentSongIndex);
        console.log('Previous index:', prevIndex);
    };


    const toggleShuffle = () => {
        if (!isShuffled) {
            const newShuffledQueue = [...queue].sort(() => Math.random() - 0.5);
            setShuffledQueue(newShuffledQueue);
            if (currentSong) {
                const currentIndex = newShuffledQueue.findIndex(song => song._id === currentSong._id);
                if (currentIndex === -1) {
                    console.error('Current song not found in shuffled queue.');
                    setCurrentSongIndex(0); // or handle accordingly
                } else {
                    setCurrentSongIndex(currentIndex);
                }
            }
        } else {
            // Reset to original queue
            setShuffledQueue([...queue]);
        }
        setIsShuffled(!isShuffled);

        console.log('Shuffled queue length:', shuffledQueue.length);
    };


    const toggleRepeat = () => {
        console.log('Toggling repeat:', isRepeating);
        setIsRepeating(!isRepeating);
    };

    const playSound = () => {
        if (!soundPlayed) {
            return;
        }
        soundPlayed.play();
    };

    useEffect(() => {
        console.log('isRepeating changed:', isRepeating);
        
    }, [isRepeating]);

    const isRepeatingRef = useRef(isRepeating);
    useEffect(() => {
        isRepeatingRef.current = isRepeating;
    }, [isRepeating]);

    // const changeSong = (songSrc) => {
    //     if (soundPlayed) {
    //         soundPlayed.stop();
    //     }
    //     let sound = new Howl({
    //         src: [songSrc],
    //         html5: true,
    //         onend: function () {
    //             console.log('Song ended. isRepeating:', isRepeatingRef.current);
    //             if (isRepeatingRef.current) {
    //                 sound.play();
    //             } else {
    //                 playNext();
    //             }
    //         }
    //     });
    //     setSoundPlayed(sound);
    //     sound.play();
    //     setIsPaused(false);
    // };

    const changeSong = (songSrc) => {
        if (soundPlayed) {
            soundPlayed.stop();
        }
        let sound = new Howl({
            src: [songSrc],
            html5: true,
            onload: function () {
                setDuration(sound.duration());
            },
            onend: function () {
                if (isRepeatingRef.current) {
                    sound.play();
                } else {
                    playNext();
                }
            },
        });
        setSoundPlayed(sound);
        setCurrentTime(0); // Reset current time when a new song starts
        sound.play();
        setIsPaused(false);
    };

    useEffect(() => {
        if (soundPlayed) {
          let animationFrameId;
      
          const updateCurrentTime = () => {
            setCurrentTime(soundPlayed.seek()); // Use context setter
            animationFrameId = requestAnimationFrame(updateCurrentTime);
          };
      
          soundPlayed.on('play', () => {
            animationFrameId = requestAnimationFrame(updateCurrentTime);
          });
      
          soundPlayed.on('pause', () => {
            cancelAnimationFrame(animationFrameId);
          });
      
          soundPlayed.on('end', () => {
            cancelAnimationFrame(animationFrameId);
          });
      
          return () => {
            cancelAnimationFrame(animationFrameId);
          };
        }
      }, [soundPlayed]);

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const handleSeek = (e) => {
        const seekTime = parseFloat(e.target.value);
        setCurrentTime(seekTime); // Update the slider position immediately
        if (soundPlayed) {
            soundPlayed.seek(seekTime); // Seek to the selected time
        }
    };
    
    const handleSeekStart = () => {
        // Optional: Pause the song while seeking
        if (!isPaused) {
            pauseSound();
        }
    };
    
    const handleSeekEnd = () => {
        // Optional: Resume the song after seeking
        if (!isPaused) {
            playSound();
        }
    };

    const pauseSound = () => {
        soundPlayed.pause();
    };

    const togglePlayPause = () => {
        if (isPaused) {
            playSound(currentSong.track);
            setIsPaused(false);
        } else {
            pauseSound();
            setIsPaused(true);
        }
    };

    const [volume, setVolume] = useState(1); // Default volume is 100% (1)
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume); // Update the volume state
        if (soundPlayed) {
            soundPlayed.volume(newVolume); // Update the volume of the currently playing song
        }
    };
    
    const getVolumeIcon = () => {
        if (volume === 0) {
            return "ph:speaker-simple-x"; // Mute icon
        } else if (volume < 0.5) {
            return "ph:speaker-simple-low"; // Low volume icon
        } else {
            return "ph:speaker-simple-high"; // High volume icon
        }
    };

//    Like methods
    const likeSong = async (songId) => {
        try {
            const response = await makeAuthenticatedPOSTRequest("/api/like", { songId });
            if (response.message) {
                console.log(response.message);
                setLikedSongs([...likedSongs, songId]); // Update state
            } else {
                console.error(response.error);
            }
        } catch (err) {
            console.error("Error liking song:", err);
        }
    };

    const unlikeSong = async (songId) => {
        try {
            const response = await makeAuthenticatedPOSTRequest("/api/unlike", { songId });
            if (response.message) {
                console.log(response.message);
                setLikedSongs(likedSongs.filter((id) => id !== songId)); // Update state
            } else {
                console.error(response.error);
            }
        } catch (err) {
            console.error("Error unliking song:", err);
        }
    };
    
    return (
    <div className="h-full w-full bg-app-black">
        {createPlaylistModalOpen && <CreatePlaylistModal closeModal={()=>{setcreatePlaylistModalOpen(false)}}/>}
        {
            addToPlaylistModalOpen &&
            <AddToPlaylistModal 
                closeModal={()=>{setAddToPlaylistModalOpen(false)}}
                addSongToPlaylist={addSongToPlaylist}
            />
        }
        <div className={`${currentSong?"h-9/10":"h-full"} w-full flex`}>
            {/* {sidebar} */}
            <div className="h-full sm:w-1/4 lg:w-1/6 bg-black flex flex-col justify-between">
                <div className="pr-2">
                    <div className="logo p-5">
                        <img 
                            src={spotify_logo}
                            alt="spotify logo"
                            width={125}
                            />
                    </div>
                    <div className="py-4">
                        {/* <IconText 
                            iconName={"material-symbols:home"} 
                            displayText={"Home"}
                            
                            targetLink="/home"
                            active={curActiveScreen === "home"}
                            /> */}
                        <IconText 
                        iconName={"mdi:cards-heart"} 
                        displayText={"Liked Songs"}
                        targetLink="/LikeSong"
                        active={curActiveScreen === "likeSong"}
                        
                        />
                        <IconText 
                            iconName={"material-symbols:search-rounded"} 
                            displayText={"Search"}
                            targetLink="/search"
                            active={curActiveScreen === "search"}
                            />
                        <IconText 
                            iconName={"icomoon-free:books"} 
                            displayText={"Library"}
                            active={curActiveScreen === "library"}
                            targetLink={"/library"}
                            />
                        
                    </div>
                    <div className="py-2">
                        <IconText 
                            iconName={"material-symbols:library-music-sharp"} 
                            displayText={"My Music"}
                            targetLink="/myMusic"
                            active={curActiveScreen === "myMusic"}
                            />
                        <IconText 
                            iconName={"material-symbols:add-box"} 
                            displayText={"Create Playlist"}
                            onClick={()=>setcreatePlaylistModalOpen(true)}
                            />
                    </div>  
                </div>
                <div className="px-5 flex pb-10">
                    
                </div>
            </div>
            {/* {main screen} */}
            <div className="h-full w-full bg-app-black overflow-auto scrollbar-hide">
                <div className="navbar w-full bg-black h-1/10 bg-opacity-40 flex items-center justify-end">
                <div className="w-1/2 h-full flex justify-end pr-2 items-center space-x-2">    
                    <TextWithHover 
                        displayText={"Upload Song"}
                        targetLink="/uploadSong"
                        active={curActiveScreen === "Upload Songs"}
                    />
                        <div className="bg-white w-10 h-10 cursor-pointer  flex items-center justify-center rounded-full semi-bold">
                            DS
                        </div>
                    
                </div>
                </div>
                <div className="content p-8 overflow-auto pt-0">
                    {children}
                </div>
            </div>
        </div>
        {/* {this div is current playing song} */}
        {currentSong && 
            <div className="w-full h-1/10 bg-black bg-opacity-30 text-white flex items-center px-4">
                <div className="w-1/4 flex items-center">    
                    <img 
                        src={currentSong.thumbnail} 
                        alt="currentSongThumbnail"
                        className="h-14 w-14 rounded"
                        />
                    <div className="pl-4">
                        <div className="text-sm hover:underline cursor-pointer">
                            {currentSong.name}
                        </div>
                        <div className="text-xs text-gray-500 hover:underline cursor-pointer">
                            {currentSong.artist.firstName + " " + currentSong.artist.lastName}
                        </div>
                    </div>
                </div>
                <div className="w-1/2 flex flex-col justify-center items-center h-full">      
                        {/* {controll for playing song} */}
                    <div className="flex  w-1/3 items-center justify-between ">
                        <Icon 
                            icon="ph:shuffle-fill" 
                            fontSize={30} 
                            className={`cursor-pointer ${
                                isShuffled ? "text-green-500" : "text-gray-500"
                            }`}
                            onClick={toggleShuffle}
                            />
                        <Icon 
                            icon="mdi:skip-previous" 
                            fontSize={30} 
                            className=" cursor-pointer text-gray-500 hover:text-white"
                            onClick={playPrevious}
                            />
                        <Icon 
                            icon={isPaused? "mdi:play" : "mdi:pause"}
                            fontSize={50} 
                            className=" cursor-pointer text-gray-500 hover:text-white"
                            onClick={togglePlayPause}
                            />
                        <Icon 
                            icon="mdi:skip-next" 
                            fontSize={30} 
                            className=" cursor-pointer text-gray-500 hover:text-white"
                            onClick={playNext}
                            />
                        <Icon 
                            icon="mdi:repeat" 
                            fontSize={30} 
                            className={`cursor-pointer ${
                                    isRepeating ? "text-green-500" : "text-gray-500"
                                }`}
                                onClick={toggleRepeat}
                            />
                        <Icon
                            icon="mynaui:add-queue"
                            fontSize={30} 
                            className=" cursor-pointer text-gray-500 hover:text-white"
                            onClick={() => {
                                if (currentSong) {
                                    addSongToQueue(currentSong);
                                    console.log('Song added to queue');
                                } else {
                                    console.log('No current song to add');
                                }
                            }}
                        />
                    </div>
                    <div className="progressbar w-full ">
                            <input
                                type="range"
                                min={0}
                                max={duration || 0}
                                value={currentTime}
                                className="w-full progressbar h-1 rounded-lg appearance-none cursor-pointer "
                                style={{backgroundColor:"#1db954"}}
                                onChange={handleSeek}
                                onMouseDown={handleSeekStart}
                                onMouseUp={handleSeekEnd}
                            />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                </div>
                <div className="w-1/4 flex justify-end pr-4 space-x-4 items-center">
                            <Icon
                                icon={getVolumeIcon()}
                                fontSize={25}
                                className="cursor-pointer text-gray-500 hover:text-white"
                            />
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.01}
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-24 volume h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                    <Icon
                        icon="ic:round-playlist-add"
                        fontSize={30} 
                        className=" cursor-pointer text-gray-500 hover:text-white"
                        onClick={()=>setAddToPlaylistModalOpen(true)}
                    />
                    <Icon
                        icon={isLiked(currentSong._id) ? "ph:heart-fill" : "ph:heart-bold"}
                        fontSize={25}
                        className={`cursor-pointer ${isLiked(currentSong._id) ? "text-green-500" : "text-gray-500"}`}
                        onClick={() => {
                            if (currentSong) {
                                if (isLiked(currentSong._id)) {
                                    unlikeSong(currentSong._id);
                                    setLikedSongs(likedSongs.filter((id) => id !== currentSong._id)); // Update state
                                } else {
                                    likeSong(currentSong._id);
                                    setLikedSongs([...likedSongs, currentSong._id]); // Update state
                                }
                            } else {
                                console.log("No current song to like/unlike");
                            }
                        }}
                    />
                </div>
            </div>
        }
    </div>
    )
})


export default LoggedInContainer;