import React from 'react'

function formatDuration(totalSeconds) {
  if (!totalSeconds || Number.isNaN(Number(totalSeconds))) return null;
  const seconds = Math.floor(Number(totalSeconds));
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const two = (n) => String(n).padStart(2, '0');
  return hrs > 0 ? `${hrs}:${two(mins)}:${two(secs)}` : `${mins}:${two(secs)}`;
}

function HomepageGrid({ videos = [], currentUserAvatar = null, onCardClick = () => {} }) {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="grid gap-4 md:gap-6 
                      grid-cols-1 
                      sm:grid-cols-2 
                      lg:grid-cols-3 
                      xl:grid-cols-4 
                      2xl:grid-cols-5
                      auto-rows-max">
        {videos.map((video) => {
          const durationLabel = formatDuration(video?.duration);
          return (
            <div 
              key={video._id}
              className="video-card group cursor-pointer"
              onClick={() => onCardClick(video)}
            >
              <div className="relative overflow-hidden rounded-xl">
                <img
                  className="w-full aspect-video object-cover transition-transform duration-200 group-hover:scale-105"
                  src={video?.thumbnailUrl}
                  alt={video?.title || 'Video thumbnail'}
                />
                {durationLabel && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
                    {durationLabel}
                  </div>
                )}
              </div>

              <div className="mt-3 flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-gray-300 transition-colors">
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

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm md:text-base leading-tight text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {video?.title || 'Untitled'}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm mt-1 hover:text-gray-900 transition-colors">
                    {video?.channelName || ''}
                  </p>
                  <p className="text-gray-600 text-xs md:text-sm">
                    {typeof video?.views === 'number' ? `${video.views} views` : ''}
                  </p>
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


