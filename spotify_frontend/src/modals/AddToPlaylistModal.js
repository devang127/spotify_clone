import { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";


const AddToPlaylistModal = ({closeModal, addSongToPlaylist}) => {

        const [myPlaylist, setMyPlaylist] = useState([]);
        useEffect(()=>{
            const getData = async () => {
                const response = await makeAuthenticatedGETRequest("/playlist/get/me");
                setMyPlaylist(response.data);
            };
            getData();
        }, [])

    return(
        <div className="absolute bg-black bg-opacity-50 w-screen h-screen flex justify-center items-center" onClick={closeModal}>
            <div className="bg-app-black w-1/3 rounded-md p-8"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className="text-white mb-3 font-semibold text-lg">Select Playlist</div>
                <div className="space-y-4 flex flex-col justify-center items-center">
                    {myPlaylist.map(item=>{
                        return (
                            <PlaylistListComponent 
                            info={item}
                            addSongToPlaylist={addSongToPlaylist}

                        />)
                    })}
                </div>
            </div>
        </div>
    )
}

const PlaylistListComponent = ({info, addSongToPlaylist}) =>{
    return(
        <div className="bg-app-black flex w-full items-center space-x-4 hover:bg-gray-400 hover:bg-opacity-20 cursor-pointer rounded-md p-3"
                onClick={()=>addSongToPlaylist(info._id)}>
            <div>
                <img src={info.thumbnail} alt="playlistThumbnail" className="h-14 w-14 rounded"/> 
            </div>
            <div className="text-white font-semibold text-sm">
                {info.name}
            </div>
            
        </div>
    )
}

export default  AddToPlaylistModal