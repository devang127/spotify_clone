import SingleSongCard from "../components/shared/SingleSongCard";
import LoggedInContainer from "../containers/LoggedInContainer";
import { useState, useEffect } from "react";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";   

const LikeSong = () => {
    const [likedSongs, setLikedSongs] = useState([]);

    useEffect(() => {
        const fetchLikedSongs = async () => {
            try {
                const response = await makeAuthenticatedGETRequest("/api/likedSongs");
                if (response.likedSongs) {
                    setLikedSongs(response.likedSongs);
                } else {
                    console.error(response.error);
                }
            } catch (err) {
                console.error("Error fetching liked songs:", err);
            }
        };
    
        fetchLikedSongs();
    }, []);

    return (
        <LoggedInContainer curActiveScreen="likeSong">
            <div className="text-white text-xl font-semibold pb-4 pl-2 pt-8">
                Liked Songs
            </div>
            <div className="space-y-3 overflow-auto">
                {likedSongs.map((song) => (
                    <SingleSongCard key={song._id} info={song} playSound={() => {}} />
                ))}
            </div>
        </LoggedInContainer>
    );
};

export default LikeSong;