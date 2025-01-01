import LoggedInContainer from "../containers/LoggedInContainer";
import { useState, useEffect } from "react";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import { useNavigate } from "react-router-dom";


const Library = ()=>{
    const [myPlaylist, setMyPlaylist] = useState([]);
    useEffect(()=>{
        const getData = async () => {
            const response = await makeAuthenticatedGETRequest("/playlist/get/me");
            setMyPlaylist(response.data);
        };
        getData();
    }, [])
     
    return(
        <LoggedInContainer curActiveScreen={"library"}>
            <div className="text-white text-2xl font-semibold pt-9">My Playlist</div>
            <div className=" py-5 flex grid gap-5 grid-cols-5 sm:grid-cols-2 lg:grid-cols-4 cursor-pointer">
                {myPlaylist.map((item)=>{
                    return <Card 
                        key={JSON.stringify(item)}
                        title={item.name} 
                        description=""
                        imgUrl={item.thumbnail}
                        playlistid={item._id}
                    />
                })}
            </div>
        </LoggedInContainer>
    )
}

const Card = ({title, description,imgUrl, playlistid})=>{
    const navigate = useNavigate();
    return(
        <div 
            className="bg-black bg-opacity-30 w-full sm:p-4 lg:p-4 rounded-lg cursor-pointer"
            onClick={()=>{
                navigate("/playlist/" + playlistid);
            }}    
        >
            <div className="">
                <img className="w-full rounded-lg h-50" alt="label" src={imgUrl}/>
    
            </div>
            <div className="text-white font-semibold py-3 ">
                {title}
            </div>
            <div className="text-gray-500 text-sm">
                {description}
            </div>
        </div>
    )
}

export default Library;