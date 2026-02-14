import { useEffect, useState } from "react";
import Header from "./Header";
import { useSelector } from "react-redux";
import HomepageGrid from "./HomepageGrid.jsx";
import { AiOutlineHome } from 'react-icons/ai';
import { MdOutlineSubscriptions } from 'react-icons/md';
import { FiTrendingUp } from 'react-icons/fi';
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Homepage() {
    const [randomVideos, setRandomVideos] = useState([]);
    const [isloading, setIsLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const isSidebarOpen = useSelector((state) => state.sidebarHandler.value);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/videos/allVideos?page=1&limit=30')
            .then((response) => {
                setRandomVideos(response.data.data);
            })
            .catch((error) => {
                console.error("fetching all video failed!", error);
            })
            .finally(() => {
              setIsLoading(false);
            });
    }, []);

    return (
        <>
            <Header />

    <div className="flex w-full mt-16">
        {/* Sidebar - Fixed width and Z-index to prevent overlap */}
        <aside 
            className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-white transition-all duration-300 z-40 
            ${isSidebarOpen ? 'w-fit' : 'w-20'}`}
        >
            <div className="flex flex-col h-full">
                <ul className="flex-1 space-y-2 p-3">
                    <li className="flex items-center px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors group">
                        <AiOutlineHome className="text-2xl shrink-0" />
                        <span className={`ml-4 font-medium transition-opacity duration-300 ${!isSidebarOpen && 'hidden'}`}>
                            Home
                        </span>
                    </li>
                    <li className="flex items-center px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors group">
                        <FiTrendingUp className="text-2xl shrink-0" />
                        <span className={`ml-4 font-medium transition-opacity duration-300 ${!isSidebarOpen && 'hidden'}`}>
                            Trending
                        </span>
                    </li>
                    <li className="flex items-center px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors group" onClick ={() => navigate('/subscription')}>
                        <MdOutlineSubscriptions className="text-2xl shrink-0" />
                        <span className={`ml-4 font-medium transition-opacity duration-300 ${!isSidebarOpen && 'hidden'}`}  >
                            Subscriptions
                        </span>
                    </li>
                </ul>

                {isSidebarOpen && (
                    <div className="p-4 border-t border-gray-100 text-[10px] text-gray-500 uppercase tracking-widest">
                        © 2026 My App
                    </div>
                )}
            </div>
        </aside>

        {/* Main Content Area */}
        <main 
            className={`flex-1 min-h-screen transition-all duration-300
            ${isSidebarOpen ? 'ml-50' : 'ml-20'}`}
        >
            <div className="">
                {(isloading) ? (
                <div className="w-full h-[60vh] flex items-center justify-center text-gray-500">
                    <span className="text-2xl font-bold italic">Loading videos...</span>
                </div>
                ) :
                randomVideos.length > 0 ? (
                    <HomepageGrid videos={randomVideos} currentUserAvatar={user?.avatar} />
                ) : (
                    <div className="w-full h-[60vh] flex flex-col items-center justify-center text-gray-500">
                        <span className="text-2xl font-bold italic">No videos available right now</span>
                        <p className="text-sm">Try refreshing the page in a moment.</p>
                    </div>
                )}
            </div>
        </main>
    </div>
        </>
    );
}

export default Homepage;