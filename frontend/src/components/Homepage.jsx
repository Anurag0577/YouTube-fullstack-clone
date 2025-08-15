import { useEffect, useState } from "react";
import Header from "./header";

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
            {/* Responsive Grid Container */}
            <div className="p-4 md:p-6 lg:p-8">
                <div className="grid gap-4 md:gap-6 
                               grid-cols-1 
                               sm:grid-cols-2 
                               lg:grid-cols-3 
                               xl:grid-cols-4 
                               2xl:grid-cols-5
                               auto-rows-max">
                    {randomVideos.map((video, index) => (
                        <div key={video._id} className="video-card group cursor-pointer">
                            {/* Thumbnail Container */}
                            <div className="relative overflow-hidden rounded-xl">
                                <img 
                                    className="w-full aspect-video object-cover transition-transform duration-200 group-hover:scale-105" 
                                    src={video.thumbnailUrl}
                                    alt="Video thumbnail"
                                />
                                {/* Optional: Video duration overlay */}
                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
                                    12:34
                                </div>
                            </div>
                            
                            {/* Video Info */}
                            <div className="mt-3 flex gap-3">
                                {/* Channel Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-gray-300 transition-colors">
                                        <img 
                                            className="w-full h-full object-cover" 
                                            src={user?.avatar}
                                            alt="Channel avatar"
                                        />
                                    </div>
                                </div>
                                
                                {/* Video Details */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm md:text-base leading-tight text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {video.title}
                                    </h3>
                                    <p className="text-gray-600 text-xs md:text-sm mt-1 hover:text-gray-900 transition-colors">
                                        {video.channel}
                                    </p>
                                    <p className="text-gray-600 text-xs md:text-sm">
                                        {video.views}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Homepage;
