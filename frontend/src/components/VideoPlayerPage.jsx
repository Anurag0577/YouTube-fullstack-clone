import VideoPlayer from "./VideoPlayer.jsx";
import Headers from "./Header.jsx"
import { useEffect, useState } from "react";
import axios from 'axios'
import { useParams } from "react-router-dom";
import { AiOutlineDislike } from 'react-icons/ai';
import { AiOutlineLike } from 'react-icons/ai';
import { BsShare } from 'react-icons/bs';

function VideoPlayerPage() {
  const [videoDetail, setVideoDetail] = useState({});
  const [channelDetail, setChannelDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { vidId } = useParams();

  useEffect(() => {
    const fetchVideoDetails = () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No access token found");
        }

        axios.get(`http://localhost:3000/api/videos/${vidId}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        })
        .then(response => {
            console.log('Video details response:', response.data.data);
          setVideoDetail(response.data.data || {});
        })
      } catch (err) {
        console.error('Error fetching video details:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    const channelDetails = () => {
      try {
        const res = axios.get(`http://localhost:3000/api/channel/${videoDetail.channel}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          console.log(res.data.data);
          setChannelDetail(res.data.data);

          try{
            const accessToken = localStorage.getItem('accessToken');
            axios.get(`http://localhost:3000/api/subscription/status/${videoDetail.channel}`,{
              headers: {
                "Content-Type" : 'application/json',
                "Authorization" : `Bearer ${accessToken}`
              }
            })
            .then(res => {
              if(res.data.success) {
                isSubscribed(res.data.data.isSubscribed)
              }
            })
          } catch(err){
            console.log(err)
          }
        })
      } catch(err) {
        console.log(err)
      }
    }

    

    if (vidId) {
      fetchVideoDetails();
      channelDetails();
    }
  }, [vidId, videoDetail.channel]); // Combined dependencies from both useEffect hooks

  // Checking the subscription status

  // const handleSubscribe = async() => {
  //   const accessToken = localStorage.getItem('accessToken');
  //   await axios.put("http://localhost:3000/api/subscription/subscribe", {
  //     channelId: videoDetail.channelId
  //   },
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": `Bearer ${accessToken}`
  //     }
  //   })
  //   .then((response) => {
  //     if(response.data.success){
  //       setIsSubscribed(true);
  //       console.log('Subscription response:', response.data.data);
  //     }
  //   })
  //   .catch((error) => {
  //     console.error('Error subscribing to channel:', error);
  //   });
  // }

  const handleSubscription = () => {
    
  }

  return (
    <>
      <Headers/>
      <div className="videoPlayerPageContainer min-h-screen bg-white pt-16">
        <div className="flex flex-col lg:flex-row gap-6 p-5">
          <div className="leftSide w-full lg:w-[70%]">
            {/* Video Container with explicit sizing */}
            <div className="videoContainer mb-6 bg-black rounded-lg overflow-hidden">
              {videoDetail?.videoUrl ? (
                <div className="w-full aspect-video">
                  <VideoPlayer
                    id={`player-${vidId}`}
                    publicId={videoDetail.videoUrl}
                    className="w-full h-full"
                    playerConfig={{
                      muted: false,
                      autoplayMode: "never",
                      posterOptions: { 
                        transformation: { effect: "blur:200" } 
                      },
                    }}
                    sourceConfig={{
                      info: {
                        title: videoDetail.title || "Video",
                        description: videoDetail.description || "Video description",
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="bg-gray-200 aspect-video w-full flex items-center justify-center">
                  <p className="text-gray-500 text-lg">No video URL available</p>
                </div>
              )}
            </div>
            
            {/* Video Info */}
            <div className="videoInfo space-y-4">
              <h1 className="text-2xl font-semibold ">
                {videoDetail.title || 'Untitled Video'}
              </h1>
              <div className="engagements flex justify-between items-center mr-10 ">
                <div className="left-side flex gap-x-6 items-center">
                  <div className="chennel-name-picture flex gap-4 items-center ">
                    <div className="w-12 h-12 md:w-10 md:h-10 cursor-pointer rounded-full overflow-hidden border-2 border-transparent hover:border-gray-300 transition-colors">
                      <img className="channel-profile-picture" src={channelDetail.avatar}></img>
                    </div>
                    <div>
                      <h1 className="channel-title text-xl font-normal">{channelDetail.channelName}</h1>
                      <p className="text-xs ">{channelDetail.subscriberCount} Subscribers</p>
                    </div>
                    
                  </div>
                  <div className="channel-subscription rounded-full hover:scale-105 cursor-pointer" onClick={handleSubscription}><span className={`py-3 px-5 rounded-full ${isSubscribed ? 'bg-red-500 text-white' : 'bg-black text-white'} font-medium`}>{isSubscribed ? 'Unsubscribe' : 'Subscribe'}</span></div>
                </div>
                <div className="right-side flex">
                  <div className="channel-subscription"><span className="py-3 px-5 rounded-l-full bg-gray-200 flex items-center gap-x-3"><AiOutlineLike className="text-2xl"/> 900k</span></div>
                  <div className="channel-subscription text-xl "><span className="py-3  px-5 rounded-r-full flex items-center gap-x-3 border-l-2  bg-gray-200  "><AiOutlineDislike className="text-2xl" /></span></div>
                  <div className="py-3 ml-5 px-5 rounded-full flex items-center gap-x-2  bg-gray-200 "><BsShare className="text-2xl"/>Share</div>
                </div>
              </div>
              <div className="bg-gray-200 rounded-2xl p-5">
                  <p className="text-gray-600 text-lg leading-relaxed">
                      {videoDetail.description || 'No description available'}
                  </p>
              </div>
              
            </div>
          </div>
          
          {/* Right Side */}
          <div className="rightSide w-full lg:w-[30%]">
            <div className="bg-gray-50 p-6 rounded-lg h-fit">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Related Content</h3>
              <p className="text-gray-600">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoPlayerPage;