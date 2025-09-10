import VideoPlayer from "./VideoPlayer.jsx";
import Headers from "./Header.jsx"
import { useEffect, useState, useRef } from "react";
import axios from 'axios'
import { useParams } from "react-router-dom";
import { AiOutlineDislike } from 'react-icons/ai';
import { AiFillDislike } from 'react-icons/ai';
import { AiOutlineLike } from 'react-icons/ai';
import { AiFillLike } from 'react-icons/ai';
import { BsShare } from 'react-icons/bs';

function VideoPlayerPage() {
  const [videoDetail, setVideoDetail] = useState({});
  const [channelDetail, setChannelDetail] = useState({});
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [dislikes, setDislikes] = useState(0);
  const [isDisliked, setIsDisliked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { vidId } = useParams();
  const hasFetched = useRef(false);
  

  // fetching video detail function
  const fetchChannelDetails = async(channelId) => {
        try{
            await axios.get(`http://localhost:3000/api/channel/${channelId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        console.log(res.data.data);
        setChannelDetail(res.data.data);
        
            const accessToken = localStorage.getItem('accessToken');
            try{
            axios.get(`http://localhost:3000/api/subscription/status/${channelId}`,{
              headers: {
                "Content-Type" : 'application/json',
                "Authorization" : `Bearer ${accessToken}`
              }
            })
            .then(subscriptionRes => {
              console.log('this is demo for testiing')
              if(res.data.success) {
                setIsSubscribed(subscriptionRes.data.data.isSubscribed);
                console.log('Subscription status:', subscriptionRes.data.data);
              }
            })
          } catch(err){
            console.log(err)
          }
      })
        } catch(err){
      console.log('Error in fetching channel details', err)
    }
  }

  // first useEffect for fetching video detail at the page loading
  useEffect(() => {
    if (hasFetched.current) return; // Prevent duplicate calls
    hasFetched.current = true;

    // fetch the clicked video details
    const fetchVideoDetails =() => {
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
          setLikes(response.data.data.likes);
          setDislikes(response.data.data.dislikes);
          setIsLiked(response.data.data.isLiked || false);
          setIsDisliked(response.data.data.isDisliked || false);
          
          try {
            axios.post(`http://localhost:3000/api/videos/${vidId}/view`, {}, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(res => {
              console.log('view increased successfully!')
            })
          } catch (err) {
            console.log(err)
          }
        })
      } catch (err) {
        console.error('Error fetching video details:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load video');
      } finally {
        setLoading(false);
      }
    }
    fetchVideoDetails();
  }, [vidId]); 

  // fetching channelDetail during page loading.
  useEffect(()=> {
    if (videoDetail.channel) fetchChannelDetails(videoDetail.channel);
      }, [videoDetail.channel])

  const handleSubscribe = async() => {
    try{
      const accessToken = localStorage.getItem('accessToken') // get the accessTOKEN 
    await axios.post('http://localhost:3000/api/subscription/subscribe',{
      channelId : videoDetail.channel // passing the channel Id to backend
    },
    {
      headers: {
        "Content-Type" : 'application/json',
        "Authorization" : `Bearer ${accessToken}`
      }
    }
  )
  .then(res => {
    if(res.data.success){
      setIsSubscribed(true)
      console.log('Channel Subscribed')
    }
  })
    } catch(err){
      console.log('error', err)
    }

    if (videoDetail.channel) fetchChannelDetails(videoDetail.channel);
    
  }

  const handleUnsubscribe = async() => {
    const accessToken = localStorage.getItem('accessToken');
    const unsubscribing = await axios.post('http://localhost:3000/api/subscription/unsubscribe', {
      channelId: videoDetail.channel
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }
  )
  if(unsubscribing.data.success){
    setIsSubscribed(false);
    console.log('Channel unsubscribed!')
  }
  }

  const handleSubscription = () => {
    (isSubscribed ? handleUnsubscribe() : handleSubscribe());
  }

  // LIKE A VIDEO
  const likeHandler = async() => {
    try {
      if (isLiked) {
        // If already liked, unlike the video
        const response = await axios.post(`http://localhost:3000/api/engagement/${vidId}/decreaseLike`, {}, {
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        if(response.data.success){
          console.log('Video unliked successfully!');
          setLikes(likes - 1);
          setIsLiked(false);
        }
      } else {
        // If not liked, like the video
        const response = await axios.post(`http://localhost:3000/api/engagement/${vidId}/increaseLike`, {}, {
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        if(response.data.success){
          console.log('Video liked successfully!');
          setLikes(likes + 1);
          setIsLiked(true);
          
          // If the video was disliked, remove the dislike
          if (isDisliked) {
            setDislikes(dislikes - 1);
            setIsDisliked(false);
          }
        }
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message || "An error occurred.");
      } else {
        alert("An error occurred while processing your request.");
      }
    }
  }

  // DISLIKE THE CURRENT VIDEO
  const dislikeHandler = async() => {
    try {
      if (isDisliked) {
        // If already disliked, remove the dislike
        const response = await axios.post(`http://localhost:3000/api/engagement/${vidId}/decreaseDislike`, {}, {
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        if(response.data.success){
          console.log('Dislike removed successfully!');
          setDislikes(dislikes - 1);
          setIsDisliked(false);
        }
      } else {
        // If not disliked, dislike the video
        const response = await axios.post(`http://localhost:3000/api/engagement/${vidId}/increaseDislike`, {}, {
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        if(response.data.success){
          console.log('Video disliked successfully!');
          setDislikes(dislikes + 1);
          setIsDisliked(true);
          
          // If the video was liked, remove the like
          if (isLiked) {
            setLikes(likes - 1);
            setIsLiked(false);
          }
        }
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message || "An error occurred.");
      } else {
        alert("An error occurred while processing your request.");
      }
    }
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
              <h1 className="text-2xl font-bold tracking-tight leading-tight mb-1">
                {videoDetail.title || 'Untitled Video'}
              </h1>
              <div className="engagements flex justify-between items-center mr-10 ">
                <div className="left-side flex gap-x-6 items-center">
                  <div className="chennel-name-picture flex gap-2 items-center ">
                    <div className="w-10 h-10 md:w-10 md:h-10 cursor-pointer rounded-full overflow-hidden border-2 border-transparent hover:border-gray-300 transition-colors">
                      <img className="channel-profile-picture" src={channelDetail.avatar}></img>
                    </div>
                    <div>
                      <h1 className="channel-title text-xl font-semibold ">{channelDetail.channelName}</h1>
                      <p className="text-xs text-gray-700">{channelDetail.subscriberCount} Subscribers</p>
                    </div>
                    
                  </div>
                  <div className="channel-subscription rounded-full hover:scale-105 cursor-pointer" onClick={handleSubscription}><span className={`py-2 px-4 rounded-full ${isSubscribed ? 'bg-gray-100 text-black' : ' bg-black text-white'} font-medium`}>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span></div>
                </div>
                <div className="right-side flex justify-centern items-center">
                  {/* like button */}
                  <div className="channel-engagement">
                    <span className="py-2 px-4 rounded-l-full bg-gray-100 flex items-center gap-x-1 font-semibold hover:bg-gray-300 cursor-pointer" onClick={likeHandler}>
                      {isLiked ? <AiFillLike className="text-2xl text-blue-600" /> : <AiOutlineLike className="text-2xl" />}
                      {likes || 0}
                    </span>
                  </div>

                  {/* Dislike button */}
                  <div className="channel-engagement ">
                    <span 
                      className="py-2 px-4 rounded-r-full flex items-center gap-x-1 border-l-2 border-gray-400 bg-gray-100 cursor-pointer font-semibold hover:bg-gray-300 transition-colors" 
                      onClick={dislikeHandler}
                    >
                      {isDisliked ? <AiFillDislike className="text-2xl text-red-600" /> : <AiOutlineDislike className="text-2xl" />}
                      {dislikes || 0}
                    </span> 
                  </div>
                  <div className="py-2 ml-5 px-4 rounded-full flex items-center gap-x-2  bg-gray-100 font-semibold hover:bg-gray-300 cursor-pointer"><BsShare className="text-xl"/>Share</div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-2xl p-5">
                  <p className="text-gray-600 leading-relaxed">
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