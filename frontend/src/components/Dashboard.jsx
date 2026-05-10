import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { Navigate } from 'react-router-dom';

// Icons
import { HiOutlineVideoCamera } from 'react-icons/hi2';
import { AiOutlineCloseCircle, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { IoAnalyticsSharp } from 'react-icons/io5';
import { FaWandMagicSparkles } from 'react-icons/fa6';

// Components
import Uploader from "./uploader";
import Headers from '../components/Header.jsx';
import EditPopup from "./EditPopup.jsx";
import { Customisation } from "./Customisation.jsx";
import { CreateChannel } from "./CreateChannel.jsx";
import { fetchChannelInfo } from '../slice/channelSlice.js';

function Dashboard() {
  const dispatch = useDispatch();

  // local hooks
  const [loading, setLoading] = useState(true);
  
  // 1. Redux State Selection
  // Ensure 'fetchChannelInfo' matches the key in your store.js reducer object
  const channelState = useSelector((state) => state.fetchChannelInfo);
  const isSidebarOpen = useSelector((state) => state.sidebarHandler.value);
  const createVideoPopup = useSelector((state) => state.createVideoPopup.value);

  // Derived State
  const videos = channelState?.data?.videos || [];
  const channelDetail = channelState?.data || null;

  // 2. Local UI State
  const [videoId, setVideoId] = useState('');
  const [isEditPopOpen, setIsEditPopOpen] = useState(false);
  const [componentShow, setComponentShow] = useState('Content');
  const [isCreatePopOpen, setIsCreatePopOpen] = useState(false);
  const [doesUserHaveChannel, setDoesUserHaveChannel] = useState(null);
  const [channelId, setChannelId] = useState(null);

  // 3. Fetch User and Channel Logic
  const initializeDashboard = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      console.error('No access token found');
      setLoading(false);
      return; 
    }

    try {
      const decodedToken = jwtDecode(accessToken);
      const userID = decodedToken._id;

      // Fetch user to get their channel ID
      const res = await axios.get(`http://localhost:3000/api/users/${userID}`, {
        headers: { 'Content-Type': 'application/json' }
      });

      const activeChannelID = res.data.data.channel;

      if (!activeChannelID) {
        setDoesUserHaveChannel(false);
      } else {
        setDoesUserHaveChannel(true);
        setChannelId(activeChannelID);
        // DISPATCH: Now we definitely have the ID
        await dispatch(fetchChannelInfo(activeChannelID));
      }
    } catch (err) {
      console.error('Dashboard Init Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeDashboard();
  }, [dispatch]);

  // 4. Action Handlers
  const videoEditHandler = (clickedVideoDetail) => {
    setVideoId(clickedVideoDetail);
    setIsEditPopOpen(!isEditPopOpen);
  };

  const videoDeleteHandler = async (currentVideoId) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await axios.delete(`http://localhost:3000/api/videos/${currentVideoId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        // Refresh Redux store after deletion
        if (channelId) {
          dispatch(fetchChannelInfo(channelId));
        }
      } catch (error) {
        console.error('Delete error:', error.response?.data?.message || error.message);
      }
    }
  };

  const refreshChannelInfo = async () => {
    if (!channelId) return;
    setLoading(true);
    try {
      await dispatch(fetchChannelInfo(channelId));
    } finally {
      setLoading(false);
    }
  };

  // 5. Render Logic
  if (loading || channelState.loading) {
    return <div className="h-screen w-full flex items-center justify-center">Loading Dashboard...</div>;
  }

  return (
    <>
      {!doesUserHaveChannel ? (
        <div className="flex flex-col w-full h-screen">
          <Headers />
          <div className="flex flex-col text-center justify-center items-center w-full h-full mt-16 ">
            <h1 className="text-2xl">You don't have a channel yet.</h1>
            <p className="text-[12px] mb-5">Create a channel to start managing your content.</p>
            <button 
              className="px-6 py-2 rounded-2xl bg-gray-200 hover:bg-black hover:text-white transition" 
              onClick={() => setIsCreatePopOpen(true)}
            >
              Create Channel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full h-screen">
          <Headers />
          <div className="flex w-full h-full mt-16">
            
            {/* Sidebar */}
            <div className={`${isSidebarOpen ? 'min-w-[200px]' : 'min-w-[80px]'} fixed h-full bg-white border-r border-gray-200 transition-all duration-300`}>
              <ul className="space-y-2 p-4">
                <li 
                  className="p-3 rounded flex items-center hover:bg-black hover:text-white cursor-pointer transition" 
                  onClick={() => setComponentShow('Content')}
                >
                  <HiOutlineVideoCamera className="text-2xl mr-2" />
                  {isSidebarOpen && "Content"}
                </li>
                <li 
                  className="p-3 rounded flex items-center hover:bg-black hover:text-white cursor-pointer transition" 
                  onClick={() => setComponentShow('Analytics')}
                >
                  <IoAnalyticsSharp className="text-2xl mr-2" />
                  {isSidebarOpen && "Analytics"}
                </li>
                <li 
                  className="p-3 rounded flex items-center hover:bg-black hover:text-white cursor-pointer transition" 
                  onClick={() => setComponentShow('Customisation')}
                >
                  <FaWandMagicSparkles className="text-2xl mr-2" />
                  {isSidebarOpen && "Customisation"}
                </li>
              </ul>
            </div>

            {/* Main Content Area */}
            <div className={`flex-1 ${isSidebarOpen ? 'ml-[200px]' : 'ml-[80px]'} p-8 transition-all duration-300`}>
              {componentShow === 'Content' && (
                <div className="w-full h-full ">
                  <h1 className="text-2xl mb-5 font-bold">Channel Content</h1>
                  {
                    videos.length < 1 ? (
                      <div className="h-full w-full flex flex-col justify-center items-center">
                        <h2 className="text-center font-bold text-2xl ">
                          Your channel do not have any video yet!
                        </h2>
                        <p>Post a new video by clicking on the '+ create' button in the header.</p>
                      </div>
                    ) : <div className="w-full flex flex-col gap-3">
                          {videos.map(video => (
                            <div key={video._id} className="w-full flex justify-between items-center p-1 rounded-lg border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-400 transition">
                              <div className="flex items-center gap-5">
                                <img className="h-[60px] aspect-video rounded object-cover" src={video.thumbnailUrl} alt={video.title} />
                                <h1 className="font-medium">{video.title}</h1>
                              </div>
                              <div className="flex gap-2">
                                <button className="p-2 hover:bg-black hover:text-white rounded" onClick={() => videoEditHandler(video)}>
                                  <AiOutlineEdit className="text-xl" />
                                </button>
                                <button className="p-2 hover:bg-black hover:text-white rounded" onClick={() => videoDeleteHandler(video._id)}>
                                  <AiOutlineDelete className="text-xl" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                  }
                </div>
              )}

              {componentShow === 'Analytics' && <div>Analytics Component Here</div>}
              {componentShow === 'Customisation' && <Customisation channelDetail={channelDetail} />}
            </div>
          </div>
        </div>
      )}

      {/* Popups */}
      {isCreatePopOpen && (
        <PopupWrapper close={() => setIsCreatePopOpen(false)}>
          <CreateChannel setIsCreatePopOpen={setIsCreatePopOpen} onChannelCreated={initializeDashboard} />
        </PopupWrapper>
      )}

      {createVideoPopup && (
        <PopupWrapper close={() => { /* Handle via Redux */ }}>
          <Uploader />
        </PopupWrapper>
      )}

      {isEditPopOpen && (
        <PopupWrapper close={() => setIsEditPopOpen(false)} title="Update Video Details">
          <EditPopup
            videoId={videoId}
            onUpdate={refreshChannelInfo}
            closePopup={() => setIsEditPopOpen(false)}
          />
        </PopupWrapper>
      )}
    </>
  );
}

// Helper component to keep popup code dry
const PopupWrapper = ({ children, close, title }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-2">
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl h-[90%] flex flex-col p-6">
      <div className="flex justify-between items-center mb-4">
        {title && <h1 className="text-2xl font-bold">{title}</h1>}
        <AiOutlineCloseCircle className="text-3xl cursor-pointer hover:scale-110" onClick={close} />
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  </div>
);

export default Dashboard;