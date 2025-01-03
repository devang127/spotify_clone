import LoggedInContainer from "../containers/LoggedInContainer"
import { Icon } from '@iconify/react'
import { useState } from 'react'
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers"
import SingleSongCard from "../components/shared/SingleSongCard"

const SearchPage = () => {
    const [isInputFocused, setIsInputFocused] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [songData, setSongData] = useState([])
    
    const searchSong = async () => {
        // Convert search text to lowercase before sending to the backend
        const response = await makeAuthenticatedGETRequest("/song/get/songname/" + searchText.toLowerCase());
        setSongData(response.data);
    }

    return(
        // <LoggedInContainer curActiveScreen="search">
            <div className="w-full py-4 ">
                <div className={` w-1/3 p-3 text-sm rounded-full bg-gray-900 px-6 flex text-white space-x-3 ${isInputFocused ? "border border-white":""}`}>
                    <Icon icon="akar-icons:search" className="text-2xl items-center flex"/>
                    <input 
                        className="w-full bg-gray-900 focus:outline-none " 
                        type="text" 
                        placeholder="What do you want to listen to?"
                        onFocus={()=>{
                            setIsInputFocused(true)
                        }}
                        onBlur={()=>{
                            setIsInputFocused(false)
                        }}
                        value={searchText}
                        onChange={(e)=>{
                            setSearchText(e.target.value)
                            searchSong(); // Optional: Trigger search as user types
                        }}
                        onKeyDown={(e)=>{
                            if(e.key === "Enter"){
                                searchSong()
                            }
                        }}
                    />
                </div>
                { songData.length > 0 ?
                    <div className="pt-10 space-y-3">
                        <div className="text-white">Showing search results for "<span className="font-bold">{searchText}</span>"</div>
                        {songData.map((item) => { 
                            return <SingleSongCard  
                            info={item} 
                            key={JSON.stringify(item)}
                            playSound={()=>{}}
                            />
                        })}
                    </div>
                    :<div className="text-gray-400 p-10">Nothing to show here</div>
                }
            </div>
        // </LoggedInContainer>
    )
}

export default SearchPage