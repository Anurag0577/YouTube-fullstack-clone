import { useDispatch, useSelector } from "react-redux";
import Uploader from "./uploader";
import { useEffect, useState } from "react";
import Headers from '../components/Header.jsx'
import { HiOutlineVideoCamera } from 'react-icons/hi2';
import { IoAnalyticsSharp } from 'react-icons/io5';
import {jwtDecode} from 'jwt-decode';
import { AiOutlineEdit } from 'react-icons/ai';
import { AiOutlineDelete } from 'react-icons/ai';
import axios from "axios";

function Dashboard() {
  const [videos, setVideos] = useState([]);
  const isSidebarOpen = useSelector((state) => state.sidebarHandler.value)
  const createVideoPopup = useSelector(
    (state) => state.createVideoPopup.value
  );

  useEffect(() => {
    const channelDetail = async() => {
      const accessToken = localStorage.getItem('accessToken');
      let channelID = '';
      if(!accessToken){
        console.log("accesstoken unavilable!")
      }
      const decodedToken = jwtDecode(accessToken);
      const userID = decodedToken._id;
        await axios.get(`http://localhost:3000/api/users/${userID}`,{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        })
        .then(res => {
          channelID = res.data.data.channel;
        })
        .catch(err => console.log(err))

        await axios.get(`http://localhost:3000/api/channel/${channelID}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          console.log(res.data)
          setVideos(res.data.data.videos)
          console.log(res.data.data.videos)
        })
        .catch(err => console.log(err))
      
    }
    channelDetail();
   }, [])


   const videoDeleteHandler = async(currentVideoId) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if(!accessToken){
        throw new Error('Authentication required. Please login again.');
    }

    try {
        const { data } = await axios.delete(
            `http://localhost:3000/api/videos/${currentVideoId}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Video deleted successfully:', data.data);
        setVideos(prevVideos => prevVideos.filter(video => video._id !== currentVideoId));
        return { success: true, ...data };

    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to delete video';
        console.error('Delete video error:', errorMessage);
        throw new Error(errorMessage);
    }
};


  return (
    <>
      <div className="flex flex-col w-full h-screen">
        <Headers/>
          <div className="flex w-full h-full mt-16">
        {isSidebarOpen ? (
                                  <div className="sideBar-container fixed min-w-[200px] h-[100vh] text-black bg-white flex flex-col">
                                  {/* Sidebar Items */}
                                  <div className="sidebar-item-container flex-1">

                                    <ul className="space-y-2 p-4">
                                      <li className="px-4 py-2 rounded flex hover:bg-black hover:text-white cursor-pointer transition">
                                        <HiOutlineVideoCamera className="text-2xl mr-2"/>
                                        Content
                                      </li>
                                      <li className="px-4 py-2 rounded flex hover:bg-black hover:text-white cursor-pointer transition">
                                        <IoAnalyticsSharp className="text-2xl mr-2"/>
                                        Analytics
                                      </li>
                                    </ul>
                                  </div>
                        
                                  {/* Footer (optional) */}
                                  <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
                                    © 2025 My App
                                  </div>
                                </div>) 
                                :
                                (<div className="sideBar-container fixed min-w-[50px] h-[100vh] text-black bg-white flex flex-col ">
                                  {/* Sidebar Items */}
                                  <div className="sidebar-item-container flex-1">
                                    <ul className="space-y-2 p-4">
                                      <li className="px-4 py-2 rounded flex hover:bg-black hover:text-white cursor-pointer transition">
                                        <HiOutlineVideoCamera className="text-2xl "/>
                                      </li>
                                      <li className="px-4 py-2 rounded flex hover:bg-black hover:text-white cursor-pointer transition">
                                        <IoAnalyticsSharp className="text-2xl "/>
                                      </li>
                                    </ul>
                                  </div>
                        
                                </div>)
                        
                                }
        

        <div className={`flex-1 ${isSidebarOpen ? 'ml-[200px]' : 'ml-[100px]'} min-h-screen transition-all duration-300 mr-10 mb-10`}>
          <h1 className="text-2xl mb-5 font-bold ">Channel Content</h1>
          <div className="w-full flex flex-col gap-2">
                {videos.map(video => (
                  <div className="w-full flex justify-start items-center rounded-[5px] gap-5 border-gray-200 border hover:border-black">
                    <div className="h-[60px] aspect-video "><img className="h-full w-full rounded-[5px] " src={video.thumbnailUrl}></img></div>
                    <h1 className="flex-1">{video.title}</h1>
                    <div className={"flex"} >
                      <div className="text-2xl py-2 px-5 mr-5 hover:bg-black hover:text-white hover:rounded-[5px]"><AiOutlineEdit/></div>
                      <div className="text-2xl py-2 px-5 mr-5 hover:bg-black hover:text-white hover:rounded-[5px]" onClick={() => (videoDeleteHandler(video._id))}><AiOutlineDelete/></div>
                    </div>
                  </div>
                ))}
          </div>   
        </div>
        </div>
        
        
        

        {/* SideBar */}
        
      </div>

      {createVideoPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-2">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg md:max-w-2xl lg:max-w-3xl p-4 md:p-6 transition-all h-[90%]">
            <Uploader />
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
