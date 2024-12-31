import { useState } from "react";
import spotify_logo from "../assets/images/spotify_logo_white.svg"
import IconText from "../components/shared/IconText"
import { Icon } from '@iconify/react';
import TextWithHover from "../components/shared/TextWithHover";
import { Howl, Howler} from "howler"
import LoggedInContainer from "../containers/LoggedInContainer";

const focusCardsData = [
    {
        title: "Peaceful Piano",
        description: "Relax and indulge with beautiful piano pieces",
        imgUrl: "https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e566180"
    },
    {
        title: "Deep focus",
        description: "Keep calm and focus with this music",
        imgUrl: "https://i.scdn.co/image/ab67706f00000002ec9d60001adaa4dfca21fbcd"
    },
    {
        title: "Instrumental Study",
        description: "Focus with soft study music in the background.",
        imgUrl: "https://i.scdn.co/image/ab67706f000000029b5356dd0f7a5d31a1de5a35"
    },
    {
        title: "Focus Flow",
        description: "Uptempo instrumental hip hop beats",
        imgUrl: "https://i.scdn.co/image/ab67706f00000002ec9d60001adaa4dfca21fbcd"
    },
    {
        title: "Beats to thing to",
        description: "Focus with deep techno and tech house.",
        imgUrl: "https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e566180"
    }
]

const Home = ()=>{
    return(
        <LoggedInContainer curActiveScreen="home">
            <PlayListview titleText="Focus" cardsData={focusCardsData}/>
            <PlayListview titleText="Spotify Playlist" cardsData={focusCardsData}/>
            <PlayListview titleText="Sound of India" cardsData={focusCardsData}/>
        </LoggedInContainer>
    )
}

const PlayListview = ({titleText, cardsData}) =>{
    return(
        <div className="text-white mt-8">
            <div className=" text-2xl font-semibold mb-5">
                {titleText}
            </div>
            <div className="w-full flex justify-around space-x-4">
                {
                    cardsData.map((item)=>{
                        return <Card title={item.title} description={item.description} imgUrl={item.imgUrl} />
                    })
                }
                {/* <Card title="Peaceful Piano" description="Relax and indulge with beatuful piano pieces"/>
                <Card title="Peaceful Piano" description="Relax and indulge with beatuful piano pieces"/>
                <Card title="Peaceful Piano" description="Relax and indulge with beatuful piano pieces"/>
                <Card title="Peaceful Piano" description="Relax and indulge with beatuful piano pieces"/>
                <Card title="Peaceful Piano" description="Relax and indulge with beatuful piano pieces"/> */}
            </div>
        </div>
    )
}

const Card = ({title, description})=>{
    return(
        <div className="bg-black bg-opacity-30 w-1/5 p-4 rounded-lg">
            <div className="py-2">
                <img className="w-full rounded-lg h-50" alt="label" src="https://media.gettyimages.com/id/133505066/photo/grand-piano.jpg?s=612x612&w=gi&k=20&c=vYjWYBH00dGAWsvpdfURFlLwLn4at04xBzOacOc_UR8="/>
    
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
export default Home;