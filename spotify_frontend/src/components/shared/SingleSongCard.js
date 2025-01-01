import { useContext, useEffect, useState } from "react"
import songContext from "../../context/songContext"
import { Howl, Howler } from "howler";


const SingleSongCard = ({info, playSound}) => {
    const {currentSong, setCurrentSong} = useContext(songContext);
    const [duration, setDuration] = useState(0); // Add duration state

    useEffect(() => {
        if (info && info.track) {
            const sound = new Howl({
                src: [info.track],
                html5: true,
                onload: function () {
                    setDuration(sound.duration()); // Set duration when the song is loaded
                }
            });
        }
    }, [info]);

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };
   
    
   
    return (
        <div className="flex hover:bg-gray-400 hover:bg-opacity-20 p-2 rounded-sm "
            onClick={()=>{
                setCurrentSong(info)
            }}
        >
                <div 
                    className="w-10 h-10 bg-cover bg-center" 
                    style={{
                        backgroundImage: `url("${info.thumbnail}")`,
                    }}
                ></div>
                <div className="flex w-full ">
                    <div className="text-white flex flex-col justify-center pl-4 w-5/6">
                        <div className="hover:underline cursor-pointer">
                            {info.name}
                        </div>
                        <div className="text-xs text-gray-400 cursor-pointer hover:underline">
                            {info.artist.firstName + " " + info.artist.lastName}
                        </div>
                    </div> 
                    <div className="w-1/6 flex items-center justify-center text-gray-400 text-sm">
                        <div>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default SingleSongCard;