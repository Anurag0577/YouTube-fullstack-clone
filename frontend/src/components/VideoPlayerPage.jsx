import VideoPlayer from "./VideoPlayer.jsx";
import Headers from "./Header.jsx"
import { useEffect, useState } from "react";
import axios from 'axios'
import { useParams } from "react-router-dom";

function VideoPlayerPage() {
  const [videoDetail, setVideoDetail] = useState({});
  const { vidId } = useParams();

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {

        
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await axios.get(`http://localhost:3000/api/videos/${vidId}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        console.log('Video details response:', response.data.data);
        setVideoDetail(response.data.data || {});
        
      } catch (err) {
        console.error('Error fetching video details:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    if (vidId) {
      fetchVideoDetails();
    }
  }, [vidId]);

  

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
              <h1 className="text-3xl font-bold text-gray-800">
                {videoDetail.title || 'Untitled Video'}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {videoDetail.description || 'No description available'}
              </p>
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