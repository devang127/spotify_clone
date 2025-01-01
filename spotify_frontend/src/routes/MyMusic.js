
import spotify_logo from "../assets/images/spotify_logo_white.svg"
import IconText from "../components/shared/IconText"
import { Icon } from '@iconify/react';
import TextWithHover from "../components/shared/TextWithHover";
import SingleSongCard from "../components/shared/SingleSongCard";
import { useState, useEffect } from "react";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import { Howl, Howler} from "howler"
import LoggedInContainer from "../containers/LoggedInContainer";

const MyMusic = ()=>{
        const [songData, setSongData] = useState([]);
        useEffect(() => {
                    const getData = async () => {
                        const response = await makeAuthenticatedGETRequest("/song/get/mysongs");
                        setSongData(response.data);
                    };
                    getData();
        }, []);
    return(
        <LoggedInContainer curActiveScreen="myMusic">
            <div className="content sm:pt-10 lg:p-7 overflow-auto ">
                <div className="text-white text-2xl font-semibold pb-4 pl-2">My Songs</div>
                    <div className="space-y-3 overflow-auto">
                        {songData.map((item) => { 
                            return <SingleSongCard  
                                info={item} 
                                playSound={()=>{}}
                            />
                        })}
                    </div>
            </div>
        </LoggedInContainer>
    )
}
export default MyMusic;