import { useDispatch, useSelector } from "react-redux";
import Uploader from "./uploader";
import { useEffect, useState } from "react";
import Headers from '../components/Header.jsx'
import { HiOutlineVideoCamera } from 'react-icons/hi2';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { IoAnalyticsSharp } from 'react-icons/io5';
import {jwtDecode} from 'jwt-decode';
import { AiOutlineEdit } from 'react-icons/ai';
import { AiOutlineDelete } from 'react-icons/ai';
import EditPopup from "./EditPopup.jsx";
import axios from "axios";
import { FaWandMagicSparkles } from 'react-icons/fa6';
import { Customisation } from "./Customisation.jsx";
import { Navigate } from 'react-router-dom';
import { CreateChannel } from "./CreateChannel.jsx";

function Dashboard() {
  const [videos, setVideos] = useState([])
  const [videoId, setVideoId] = useState('')
  const [isEditPopOpen, setIsEditPopOpen] = useState(false)
  const [channelDetail, setChannelDetail] = useState(false)
  const isSidebarOpen = useSelector((state) => state.sidebarHandler.value)
  const [componentShow, setComponentShow] = useState('Content')
  const [isCreatePopOpen, setIsCreatePopOpen] = useState(false)
  const [doesUserHaveChannel, setDoesUserHaveChannel] = useState(null)
  const createVideoPopup = useSelector(
    (state) => state.createVideoPopup.value
  );

  useEffect(() => {
    const channelDetail = async() => {
      let channelID = '';
      const accessToken = localStorage.getItem('accessToken');
      if(accessToken){
        const decodedToken = jwtDecode(accessToken);
      const userID = decodedToken._id;
        await axios.get(`http://localhost:3000/api/users/${userID}`,{
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then(res => {
          channelID = res.data.data.channel;
          console.log('This is the channelId fetched by the first useEffect', channelID)
          if(channelID === null){
            setDoesUserHaveChannel(false)
          }else{
            setDoesUserHaveChannel(true)
          }
        })
        .catch(err => console.log(err))
      }
      if(!accessToken){
          throw new Error('Authentication required. Please login again.');
          <Navigate to="/login" replace />;
      }
      

        await axios.get(`http://localhost:3000/api/channel/${channelID}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          setVideos(res.data.data.videos)
          setChannelDetail(res.data.data)
        })
        .catch(err => console.log(err))
      
    }
    channelDetail();
   }, [])


   const videoEditHandler = (clickedVideoDetail) => {
    setVideoId(clickedVideoDetail);
    if(isEditPopOpen){
      setIsEditPopOpen(false)
    } else{
      setIsEditPopOpen(true)
    }
   }

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
    {!doesUserHaveChannel? (
      <div className="flex flex-col w-full h-screen">
        <Headers/>
        <div className="flex flex-col text-center justify-center w-full h-full mt-16 ">
          <h1 className="text-2xl" >You don't have channel? First you have to create it.</h1>
          <p className="text-[12px] mb-5">If you want to explore the chanel Dashboard or create content than you have to create a channel first.</p>
          <button className="btn-primary min-h-9 max-w-fit mx-auto cursor-pointer pt-1.5 pr-3 pb-1.5 pl-3 rounded-2xl bg-gray-200 flex" onClick={() => setIsCreatePopOpen(true)}>Create Channel</button>
        </div>

      </div>
    ) 
    :
    (
      <div className="flex flex-col w-full h-screen">
        <Headers/>
          <div className="flex w-full h-full mt-16">
        {isSidebarOpen ? (
                                  <div className="sideBar-container fixed min-w-[200px] h-[100vh] text-black bg-white flex flex-col">
                                  {/* Sidebar Items */}
                                  <div className="sidebar-item-container flex-1">

                                    <ul className="space-y-2 p-4">
                                      <li className="px-4 py-2 rounded flex hover:bg-black hover:text-white cursor-pointer transition" onClick={() => setComponentShow('Content')}>
                                        <HiOutlineVideoCamera className="text-2xl mr-2"/>
                                        Content
                                      </li>
                                      <li className="px-4 py-2 rounded flex hover:bg-black hover:text-white cursor-pointer transition" onClick={() => setComponentShow('Analytics')}>
                                        <IoAnalyticsSharp className="text-2xl mr-2"/>
                                        Analytics
                                      </li>
                                      <li className="px-4 py-2 rounded flex hover:bg-black hover:text-white cursor-pointer transition" onClick={() => setComponentShow('Customisation')}>
                                        <FaWandMagicSparkles className="text-2xl mr-2"/>
                                        Customisation 
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
        
        {componentShow === 'Content' && (
            <div className={`flex-1 ${isSidebarOpen ? 'ml-[200px]' : 'ml-[100px]'} min-h-screen transition-all duration-300 mr-10 mb-10`}>
          <h1 className="text-2xl mb-5 font-bold ">Channel Content</h1>
          <div className="w-full flex flex-col gap-2">
                {videos.map(video => (
                  <div className="w-full flex justify-start items-center rounded-[5px] gap-5 border-gray-200 border hover:border-black">
                    <div className="h-[60px] aspect-video "><img className="h-full w-full rounded-[5px] " src={video.thumbnailUrl}></img></div>
                    <h1 className="flex-1">{video.title}</h1>
                    <div className={"flex"} >
                      <div className="text-2xl py-2 px-5 mr-5 hover:bg-black hover:text-white hover:rounded-[5px]" onClick={() => (videoEditHandler(video))}><AiOutlineEdit/></div>
                      <div className="text-2xl py-2 px-5 mr-5 hover:bg-black hover:text-white hover:rounded-[5px]" onClick={() => (videoDeleteHandler(video._id))}><AiOutlineDelete/></div>
                    </div>
                  </div>
                ))}
          </div>   
        </div>
          ) 
        }
        {componentShow==='Analytics' && <Analytics/> }
        {componentShow === 'Customisation' && <Customisation isSidebarOpen={isSidebarOpen} channelDetail = {channelDetail} /> }
        
        </div>
        {/* SideBar */}
        
      </div>
    )
      }

      {isCreatePopOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-2">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg md:max-w-2xl lg:max-w-3xl h-[90%] flex flex-col">
            
            {/* Close Button */}
            <div 
              className="absolute top-4 right-4 text-3xl cursor-pointer text-white hover:scale-105"
              onClick={() => setIsCreatePopOpen(false)}
            >
              <AiOutlineCloseCircle />
            </div>

            {/* Content (scrollable inside popup) */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <CreateChannel />
            </div>
          </div>
        </div>
      )}

      {createVideoPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-2">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg md:max-w-2xl lg:max-w-3xl p-4 md:p-6 transition-all h-[90%]">
            <Uploader />
          </div>
        </div>
      )}
      {isEditPopOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-2">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg md:max-w-2xl lg:max-w-3xl p-2 md:p-6 transition-all h-[90%]">
            <div className="w-full flex justify-between mb-5">
              <h1 className="text-2xl font-bold">Update Video Details</h1>
              <AiOutlineCloseCircle className="text-3xl text-right right-0 cursor-pointer hover:scale-105" onClick={() => setIsEditPopOpen(false)}/>
            </div>
            <EditPopup videoId = {videoId}/>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
