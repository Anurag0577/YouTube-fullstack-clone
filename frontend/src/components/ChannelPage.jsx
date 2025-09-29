import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaPlay, 
  FaUsers, 
  FaEye, 
  FaBell,
  FaBellSlash
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import api from "../api/axios"; // make sure this is imported at the top
// TimeAgo Component
function TimeAgo({ timestamp }) {
  if (!timestamp) return null;
  return (
    <span>{formatDistanceToNow(new Date(timestamp), { addSuffix: true })}</span>
  );
}
const ChannelPage = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('videos');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [channelVideos, setChannelVideos] = useState([]);
  const [subscribing, setSubscribing] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ✅ Fetch channel data
        const channelResponse = await api.get(`/channel/${channelId}`);
        const channelResult = channelResponse.data;
        
        if (channelResult && channelResult.data) {
          setChannelData(channelResult.data);
          setChannelVideos(channelResult.data.videos || []);
          setSubscriberCount(channelResult.data.subscriberCount || 0);
        } else {
          throw new Error('Invalid response format');
        }

        // ✅ Fetch subscription status (auth handled by interceptor)
        try {
          const subscriptionResponse = await api.get(`/subscription/status/${channelId}`);
          
          if (subscriptionResponse.data.success) {
            setIsSubscribed(subscriptionResponse.data.data.isSubscribed);
            if (subscriptionResponse.data.data.subscriberCount !== undefined) {
              setSubscriberCount(subscriptionResponse.data.data.subscriberCount);
            }
          }
        } catch (subscriptionError) {
          console.log('Not logged in or subscription check failed:', subscriptionError.message);
          setIsSubscribed(false);
        }
      } catch (error) {
        console.error('Error fetching channel data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (channelId) {
      fetchChannelData();
    }
  }, [channelId]);

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (totalSeconds) => {
    if (!totalSeconds || Number.isNaN(Number(totalSeconds))) return '0:00';
    const seconds = Math.floor(Number(totalSeconds));
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const handleVideoClick = (video) => {
    navigate(`/video/${video._id}`);
  };

  // ✅ Subscribe handler
  const subscribeHandler = async () => {
    try {
      setSubscribing(true);
      const response = await api.post('/subscription/subscribe', { channelId });
      
      if (response.data.success) {
        setIsSubscribed(true);
        setSubscriberCount(response.data.data.subscriberCount);
        console.log('Successfully subscribed!');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      const errorMessage = error.response?.data?.message || 'Failed to subscribe. Please try again.';
      alert(errorMessage);
    } finally {
      setSubscribing(false);
    }
  };

  // ✅ Unsubscribe handler
  const unsubscribeHandler = async () => {
    try {
      setSubscribing(true);
      const response = await api.post('/subscription/unsubscribe', { channelId });
      
      if (response.data.success) {
        setIsSubscribed(false);
        setSubscriberCount(response.data.data.subscriberCount);
        console.log('Successfully unsubscribed!');
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
      const errorMessage = error.response?.data?.message || 'Failed to unsubscribe. Please try again.';
      alert(errorMessage);
    } finally {
      setSubscribing(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!channelData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-600">No channel data found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Channel Header */}
      {
          (channelData.cover)?
      <div className='w-full h-56 bg-gray-200'>
        
            <img 
          src={channelData.cover} 
          alt={channelData.channelName || 'Channel Banner'} 
          className="w-full h-full object-cover" 
        />
        
      </div>
      :
        ''
        }
      
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
              {channelData.avatar ? (
                <img 
                  src={channelData.avatar} 
                  alt={channelData.channelName || 'Channel'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <FaUsers size={24} />
                </div>
              )}
            </div>
            
            {/* Channel Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {channelData.channelName || 'Unknown Channel'}
              </h1>
              <div className="flex items-center text-sm text-gray-600 gap-4 mb-3">
                <span className="flex items-center gap-1">
                  <FaUsers size={14} />
                  {formatNumber(subscriberCount)} subscribers
                </span>
                <span className="flex items-center gap-1">
                  <FaPlay size={14} />
                  {channelVideos.length} videos
                </span>
                <span className="flex items-center gap-1">
                  <FaEye size={14} />
                  {formatNumber(channelData.totalViews || 0)} views
                </span>
              </div>
              {channelData.description && (
                <p className="text-gray-700 text-sm line-clamp-2">
                  {channelData.description}
                </p>
              )}
            </div>

            {/* Subscribe Button */}
            <button
              onClick={isSubscribed ? unsubscribeHandler : subscribeHandler}
              disabled={subscribing}
              className={`px-6 py-2 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] ${
                isSubscribed 
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {subscribing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  {isSubscribed ? 'Unsubscribing...' : 'Subscribing...'}
                </span>
              ) : isSubscribed ? (
                <span className="flex items-center justify-center gap-2">
                  <FaBell size={16} />
                  Subscribed
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FaBellSlash size={16} />
                  Subscribe
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-8">
            {['videos', 'about'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'videos' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Videos ({channelVideos.length})</h2>
            {channelVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {channelVideos.map((video) => (
                  <div 
                    key={video._id}
                    className="cursor-pointer group"
                    onClick={() => handleVideoClick(video)}
                  >
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        className="w-full aspect-video object-cover group-hover:scale-105 transition-transform"
                        src={video.thumbnailUrl}
                        alt={video.title}
                      />
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
                          {formatDuration(video.duration)}
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <h3 className="font-medium text-sm line-clamp-2 text-gray-900">
                        {video.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {formatNumber(video.views || 0)} views <span>•</span> <TimeAgo timestamp={video.publishedAt} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaPlay className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No videos yet</h3>
                <p className="text-gray-500">This channel hasn't uploaded any videos.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-700">
                  {channelData.description || 'No description available'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Subscribers:</span>
                  <span className="ml-2 font-medium">{formatNumber(subscriberCount)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total views:</span>
                  <span className="ml-2 font-medium">{formatNumber(channelData.totalViews || 0)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Videos:</span>
                  <span className="ml-2 font-medium">{channelVideos.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Joined:</span>
                  <span className="ml-2 font-medium">
                    {channelData.createdAt ? new Date(channelData.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelPage;