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
import { makeAuthenticatedPOSTRequest } from "../utils/serverHelpers";

const LoggedInContainer = ({ children, curActiveScreen }) => {
    const [createPlaylistModalOpen, setcreatePlaylistModalOpen] = useState(false);
    const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);
    const navigate = useNavigate();

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
        setCurrentSongIndex
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

        console.log('Queue length:', queue.length);
        console.log('Shuffled queue length:', shuffledQueue.length);
        console.log('Current index:', currentSongIndex);
        console.log('Next index:', nextIndex);
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
        setIsRepeating(!isRepeating);
    };

    const playSound = () => {
        if (!soundPlayed) {
            return;
        }
        soundPlayed.play();
    };

    const changeSong = (songSrc) => {
        if (soundPlayed) {
            soundPlayed.stop();
        }
        let sound = new Howl({
            src: [songSrc],
            html5: true,
            onend: function () {
                if (isRepeating) {
                    sound.play();
                } else {
                    playNext();
                }
            }
        });
        setSoundPlayed(sound);
        sound.play();
        setIsPaused(false);
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
            <div className="h-full w-1/6 bg-black flex flex-col justify-between">
                <div>
                    <div className="logo p-5">
                        <img 
                            src={spotify_logo}
                            alt="spotify logo"
                            width={125}
                            />
                    </div>
                    <div className="py-4">
                        <IconText 
                            iconName={"material-symbols:home"} 
                            displayText={"Home"}
                            
                            targetLink="/home"
                            active={curActiveScreen === "home"}
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
                        <IconText 
                            iconName={"material-symbols:library-music-sharp"} 
                            displayText={"My Music"}
                            targetLink="/myMusic"
                            active={curActiveScreen === "myMusic"}
                            />
                    </div>
                    <div className="py-2">
                        <IconText 
                            iconName={"material-symbols:add-box"} 
                            displayText={"Create Playlist"}
                            onClick={()=>setcreatePlaylistModalOpen(true)}
                            />
                        <IconText 
                            iconName={"mdi:cards-heart"} 
                            displayText={"Liked Songs"}
                            />
                    </div>
                </div>
                <div className="px-5 flex pb-10">
                    <div className="border border-gray-500 hover:border-white cursor-pointer text-white rounded-full w-2/5 flex items-center justify-center py-1">
                        <Icon icon="meteor-icons:globe"/>
                        <div className="ml-2 text-sm">
                            English 
                        </div>
                    </div>
                </div>
            </div>
            {/* {main screen} */}
            <div className="h-full w-full bg-app-black overflow-auto">
                <div className="navbar w-full bg-black h-1/10 bg-opacity-40 flex items-center justify-end">
                <div className="w-1/2 h-full flex items-center ">
                    <div className="w-2/3 flex justify-around">
                        <TextWithHover displayText={"Support"}/>
                        <TextWithHover displayText={"Download"}/>
                        <TextWithHover displayText={"Premium"}/>
                        <div className="border border-white opacity-50"></div>
                    </div>
                    <div className="w-1/3 flex justify-around h-full items-center">
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
                </div>
                <div className="content p-9 overflow-auto pt-0">
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
                    {/* <div>progress bar here</div> */}
                </div>
                <div className="w-1/4 flex justify-end pr-4 space-x-4 items-center">
                    <Icon
                        icon="ic:round-playlist-add"
                        fontSize={30} 
                        className=" cursor-pointer text-gray-500 hover:text-white"
                        onClick={()=>setAddToPlaylistModalOpen(true)}
                    />
                    <Icon
                        icon="ph:heart-bold"
                        fontSize={25} 
                        className=" cursor-pointer text-gray-500 hover:text-white"
                    />
                </div>
            </div>
        }
    </div>
    )
}


export default LoggedInContainer;