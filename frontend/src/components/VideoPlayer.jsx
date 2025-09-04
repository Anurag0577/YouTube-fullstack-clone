import { useEffect, useRef, useState } from "react";
import cloudinary from "cloudinary-video-player";
import "cloudinary-video-player/cld-video-player.min.css";

const VideoPlayer = ({ id, publicId, playerConfig, sourceConfig, className = "", ...props }) => {
  const containerRef = useRef();
  const playerRef = useRef();
  const cloudinaryRef = useRef();
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don't proceed if no publicId
    if (!publicId) {
      console.log("No publicId provided");
      return;
    }

    let isMounted = true;
    
    const initializePlayer = async () => {
      if (!containerRef.current || !isMounted) {
        return;
      }

      try {
        // Clean up any existing player
        if (cloudinaryRef.current) {
          try {
            cloudinaryRef.current.dispose();
          } catch (e) {
            console.log("Error disposing existing player:", e);
          }
        }

        // Create a fresh video element
        const videoElement = document.createElement('video');
        videoElement.id = id || `cloudinary-player-${Date.now()}`;
        videoElement.className = 'cld-video-player cld-fluid w-full h-full';
        videoElement.style.minHeight = '300px';
        videoElement.style.backgroundColor = '#000';
        videoElement.controls = false;

        // Clear container and add new video element
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(videoElement);

        // Store reference to the video element
        playerRef.current = videoElement;

        console.log("Initializing Cloudinary player with publicId:", publicId);
        
        // Initialize Cloudinary player
        const player = cloudinary.videoPlayer(videoElement, {
          cloud_name: "dywh2ogcw",
          secure: true,
          controls: true,
          preload: "auto",
          playbackRates: [0.5, 1, 1.25, 1.5, 2],
          showJumpControls: true,
          pictureInPictureToggle: true,
          showRemainingTime: true,
          showDownload: true,
          seekThumbnails: true,
          loop: false,
          ...playerConfig,
        });

        // Store player reference
        cloudinaryRef.current = player;

        // Set video source
        if (publicId.startsWith("http")) {
          console.log("Using direct URL:", publicId);
          player.source(publicId, {
            sourceTypes: ["mp4"],
            ...sourceConfig,
          });
        } else {
          console.log("Using Cloudinary publicId:", publicId);
          player.source({
            publicId: publicId,
            sourceTypes: ["mp4"],
            transformations: { 
              quality: "auto", 
              fetch_format: "auto" 
            },
            ...sourceConfig,
          });
        }

        // Add event listeners
        player.on('error', (error) => {
          console.error('Video player error:', error);
          setError('Failed to load video');
        });

        player.on('loadstart', () => {
          console.log('Video loading started');
          setError(null);
        });

        player.on('canplay', () => {
          console.log('Video can start playing');
          if (isMounted) {
            setIsInitialized(true);
            setError(null);
          }
        });

        player.on('loadeddata', () => {
          console.log('Video data loaded');
        });

      } catch (error) {
        console.error('Error initializing Cloudinary player:', error);
        if (isMounted) {
          setError('Failed to initialize video player');
        }
      }
    };

    // Initialize with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(initializePlayer, 100);

    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      
      if (cloudinaryRef.current) {
        try {
          cloudinaryRef.current.dispose();
        } catch (error) {
          console.log("Error disposing player:", error);
        }
      }
      
      // Clear the container to prevent React conflicts
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      
      setIsInitialized(false);
      setError(null);
    };
  }, [publicId, playerConfig, sourceConfig, id]);

  if (error) {
    return (
      <div className={`video-player-wrapper w-full h-full bg-gray-800 flex items-center justify-center ${className}`}>
        <div className="text-center text-white">
          <div className="text-red-400 mb-2">⚠️</div>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`video-player-wrapper w-full h-full relative ${className}`}>
      {!isInitialized && !error && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-white z-10">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm">Loading video player...</p>
          </div>
        </div>
      )}
      
      {/* Container that will hold the dynamically created video element */}
      <div 
        ref={containerRef}
        className="w-full h-full"
        style={{ minHeight: '300px' }}
        {...props}
      />
    </div>
  );
};

export default VideoPlayer;