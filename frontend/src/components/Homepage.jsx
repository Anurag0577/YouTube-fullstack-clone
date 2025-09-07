import { useEffect, useState } from "react";
import Header from "./Header";
import { useSelector } from "react-redux";
import HomepageGrid from "./HomepageGrid.jsx";
import { AiOutlineHome } from 'react-icons/ai';
import { MdOutlineSubscriptions } from 'react-icons/md';
import { BsCameraVideoOffFill } from 'react-icons/bs';
import { FiTrendingUp } from 'react-icons/fi';
function Homepage() {
    // Sample video data (you can replace this with your actual data)
    const [randomVideos, setRandomVideos] = useState([]);
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const isSidebarOpen = useSelector((state) => state.sidebarHandler.value);


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


    return (
        <>
            <Header />
            

            <div className="flex w-full h-full mt-16">
                {isSidebarOpen ? (
                          <div className="sideBar-container fixed min-w-[200px] h-[100vh] text-black bg-white flex flex-col">
                          {/* Sidebar Items */}
                          <div className="sidebar-item-container flex-1">
                            <ul className="space-y-2 p-4">
                              <li className="px-4 py-2 rounded flex hover:bg-black hover:text-white cursor-pointer transition">
                                <AiOutlineHome className="text-2xl mr-2"/>
                                Home
                              </li>
                              <li className="px-4 py-2 rounded flex hover:bg-black hover:text-white cursor-pointer transition">
                                <FiTrendingUp className="text-2xl mr-2"/>
                                Trending Videos
                              </li>
                              <li className="px-4 py-2 rounded flex hover:bg-black hover:text-white cursor-pointer transition">
                                <MdOutlineSubscriptions className="text-2xl mr-2"/>
                                Subscription
                              </li>
                            </ul>
                          </div>
                
                          {/* Footer (optional) */}
                          <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
                            © 2025 My App
                          </div>
                        </div>) 
                        :
                        (<div className="sideBar-container fixed min-w-[50px] h-[100vh] text-black bg-white flex flex-col  ">
                          {/* Sidebar Items */}
                          <div className="sidebar-item-container flex-1">
                            <ul className="space-y-2 p-4">
                              <li className="px-4 py-2 rounded flex hover:bg-black hover:text-white cursor-pointer transition">
                                <AiOutlineHome className="text-2xl "/>
                              </li>
                              <li className="px-4 py-2 rounded flex hover:bg-black hover:text-white cursor-pointer transition">
                                <FiTrendingUp className="text-2xl"/>
                              </li>
                              <li className="px-4 py-2 rounded flex hover:bg-black hover:text-white cursor-pointer transition">
                                <MdOutlineSubscriptions className="text-2xl "/>
                              </li>
                            </ul>
                          </div>
                
                        </div>)
                
                        }

                        {/* homepage grid*/}
                        
                        <div className={`flex-1 ${isSidebarOpen ? 'ml-[200px]' : 'ml-[50px]'} min-h-screen transition-all duration-300`}>
                        { (randomVideos.length > 0) ? <HomepageGrid videos={randomVideos} currentUserAvatar={user?.avatar} /> : <div className=" w-full h-screen flex justify-center mt-7 bolder text-2xl" >Sorry, No video available!</div> }
                        </div>
            </div>
            
            
            
        </>
    );
}

export default Homepage;
