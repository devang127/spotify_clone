
import spotify_logo from "../assets/images/spotify_logo_white.svg"
import IconText from "../components/shared/IconText"
import { Icon } from '@iconify/react';
import TextWithHover from "../components/shared/TextWithHover";

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
    return (
        <div className="h-full w-full flex ">
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
                            active
                            />
                        <IconText 
                            iconName={"material-symbols:search-rounded"} 
                            displayText={"Search"}
                            />
                        <IconText 
                            iconName={"icomoon-free:books"} 
                            displayText={"Library"}
                            />
                    </div>
                    <div className="py-2">
                        <IconText 
                            iconName={"material-symbols:add-box"} 
                            displayText={"Create Playlist"}
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
                    <div className="w-3/5 flex justify-around">
                        <TextWithHover displayText={"Support"}/>
                        <TextWithHover displayText={"Download"}/>
                        <TextWithHover displayText={"Premium"}/>
                        <div className="border border-white opacity-50"></div>
                    </div>
                    <div className="w-2/5 flex justify-around h-full items-center">
                        <TextWithHover displayText={"Sign up"}/>
                        <div className="bg-white cursor-pointer h-2/3 px-8 flex items-center justify-center rounded-full semi-bold">
                            Log In
                        </div>
                    </div>
                </div>
                </div>
                <div className="content  p-9 overflow-auto pt-0">
                    <PlayListview titleText="Focus" cardsData={focusCardsData}/>
                    <PlayListview titleText="Spotify Playlist" cardsData={focusCardsData}/>
                    <PlayListview titleText="Sound of India" cardsData={focusCardsData}/>
                </div>
            </div>
        </div>
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

const Card = ({title, description,imgUrl})=>{
    return(
        <div className="bg-black bg-opacity-30 w-1/5 p-4 rounded-lg">
            <div className="py-2">
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
export default Home;