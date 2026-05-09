import React from 'react'
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { BsThreeDotsVertical } from "react-icons/bs";

function TimeAgo({ timestamp }) {
  return (
    <span>{formatDistanceToNow(new Date(timestamp), { addSuffix: true })}</span>
  );
}

function formatDuration(totalSeconds) {
  if (!totalSeconds || Number.isNaN(Number(totalSeconds))) return null;
  const seconds = Math.floor(Number(totalSeconds));
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const two = (n) => String(n).padStart(2, '0');
  return hrs > 0 ? `${hrs}:${two(mins)}:${two(secs)}` : `${mins}:${two(secs)}`;
}

function HomepageGrid({ videos = [], currentUserAvatar = null }) {
  const navigate = useNavigate(); 

  function videoClickHandler(videoDetail){
    const vidId = videoDetail?._id;
    navigate(`/videos/player/${vidId}`)
  }

  return (
    <div className=" pt-1 md:pt-1 lg:p-8 lg:pt-2">
      <div className="grid gap-4 md:gap-6 
                      grid-cols-1 
                      sm:grid-cols-2 
                      lg:grid-cols-3 
                      xl:grid-cols-3 
                      2xl:grid-cols-3
                      auto-rows-max">
        {videos.map((video) => {
          const durationLabel = formatDuration(video?.duration);
          return (
            <div 
              key={video._id}
              className="video-card group cursor-pointer hover:bg-gray-200 rounded-xl p-3 transition"
              // add onClick on div not on the image
              onClick={() => videoClickHandler(video)}
            >
              <div className="relative overflow-hidden rounded-xl">
                <img
                  className="w-full object-cover transition-transform duration-200 aspect-video"
                  src={video?.thumbnailUrl}
                  alt={video?.title || 'Video thumbnail'}
                />
                {durationLabel && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
                    {durationLabel}
                  </div>
                )}
              </div>

              <div className="mt-3 flex gap-2">
                
                <div 
                  className="flex-shrink-0"
                  onClick={(event) => {
                    event.stopPropagation(); // ✅ Prevent video click
                    navigate(`/channel/${video.channel}`);
                  }}
                >
                  <div className="w-9 h-9 md:w-10 md:h-10 cursor-pointer rounded-full overflow-hidden border-2 border-transparent hover:border-gray-300 transition-colors">
                    {video?.channelAvatar ? (
                      <img
                        className="w-full h-full object-cover"
                        src={video.channelAvatar}
                        alt="Channel avatar"
                      />
                    ) : (
                      currentUserAvatar ? (
                        <img
                          className="w-full h-full object-cover"
                          src={currentUserAvatar}
                          alt="User avatar"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0 leading-tight">
                  <h3 className=" font-medium md:text-base text-[1.6rem] text-gray-900">
                    {video?.title || 'Untitled'}
                  </h3>
                  
                  <p 
                    className="text-gray-600 text-xs md:text-sm hover:text-gray-900 transition-colors cursor-pointer"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/api/channel/${video.channel}`);
                    }}
                  >
                    {video?.channelName || ''}
                  </p>
                  
                  <p className="text-gray-600 text-xs md:text-sm flex gap-2">
                    {typeof video?.views === 'number' ? `${video.views} views` : ''} 
                    <span className='text-gray-600'>•</span>
                    <TimeAgo timestamp={video.publishedAt} />
                  </p>
                </div>

                <div className=''>
                    <BsThreeDotsVertical fontSize={20} className='mt-[2px]'/>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default HomepageGrid
