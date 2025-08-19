import { useEffect, useState } from "react";
import Header from "./header";
import HomepageGrid from "./HomepageGrid.jsx";

function Homepage() {
    // Sample video data (you can replace this with your actual data)
    const [randomVideos, setRandomVideos] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));


    useEffect(() => {
        
        
        fetch('http://localhost:3000/api/videos/allVideos?page=1&limit=30', {
            headers: {
                'Content-Type' : 'application/json',  // Fixed typo
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("fetching all video failed!");
            } else {
                return response.json();
            }
        })
        .then(data => {
            setRandomVideos(data.data);
            
        })
        
    }, [])

    // const videos = Array(9).fill({
    //     thumbnail: "https://res.cloudinary.com/dywh2ogcw/image/upload/v1754424554/images/lobft8my2615fbyiod7w.jpg",
    //     title: "Toji Top 10 Best Badass scenes | Jujutsu Kaisen | Anime Hindi",
    //     channel: "Viper Anime Explained",
    //     views: "1M views · 1 year ago",
    //     channelAvatar: "https://res.cloudinary.com/dywh2ogcw/image/upload/v1754424554/images/lobft8my2615fbyiod7w.jpg"
    // });

    

    return (
        <>
            <Header />
            <HomepageGrid 
                videos={randomVideos}
                currentUserAvatar={user?.avatar}
            />
        </>
    );
}

export default Homepage;
