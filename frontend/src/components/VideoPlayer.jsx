import { useEffect, useRef, useState } from "react";
import cloudinary from "cloudinary-video-player";
import "cloudinary-video-player/cld-video-player.min.css";

const VideoPlayer = ({ id, publicId, playerConfig, sourceConfig, className = "", ...props }) => {
  const cloudinaryRef = useRef();
  const playerRef = useRef();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Don't proceed if no publicId
    if (!publicId) {
      console.log("No publicId provided");
      return;
    }

    // Make sure the element is in the DOM before initializing
    const initializePlayer = () => {
      if (!playerRef.current) {
        console.log("Player ref not available yet");
        return;
      }

      // Check if element is in DOM
      if (!document.contains(playerRef.current)) {
        console.log("Element not in DOM yet, retrying...");
        setTimeout(initializePlayer, 100);
        return;
      }

      try {
        // Clean up existing player if it exists
        if (cloudinaryRef.current?.player) {
          cloudinaryRef.current.player.dispose();
        }

        console.log("Initializing Cloudinary player with publicId:", publicId);
        
        cloudinaryRef.current = cloudinary;

        const player = cloudinaryRef.current.videoPlayer(playerRef.current, {
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

        // Store player reference for cleanup
        cloudinaryRef.current.player = player;
        setIsInitialized(true);

        // Check if publicId is a full URL or just a public ID
        if (publicId.startsWith("http")) {
          console.log("Using direct URL:", publicId);
          // For full URLs, use them directly
          player.source(publicId, {
            sourceTypes: ["mp4"],
            ...sourceConfig,
          });
        } else {
          console.log("Using Cloudinary publicId:", publicId);
          // For Cloudinary public IDs
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

        // Add error handling
        player.on('error', (error) => {
          console.error('Video player error:', error);
        });

        player.on('loadstart', () => {
          console.log('Video loading started');
        });

        player.on('canplay', () => {
          console.log('Video can start playing');
        });

        player.on('loadeddata', () => {
          console.log('Video data loaded');
        });

      } catch (error) {
        console.error('Error initializing Cloudinary player:', error);
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(initializePlayer, 50);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      setIsInitialized(false);
      if (cloudinaryRef.current?.player) {
        try {
          cloudinaryRef.current.player.dispose();
          cloudinaryRef.current.player = null;
        } catch (error) {
          console.log("Error disposing player:", error);
        }
      }
    };
  }, [publicId, playerConfig, sourceConfig]);

  return (
    <div className="video-player-wrapper w-full h-full relative">
      {!isInitialized && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-white">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
            <p>Loading video player...</p>
          </div>
        </div>
      )}
      <video
        ref={playerRef}
        id={id}
        className={`cld-video-player cld-fluid w-full h-full object-cover ${className}`}
        style={{ 
          minHeight: '300px',
          backgroundColor: '#000',
          display: 'block'
        }}
        controls={false} // Let Cloudinary handle controls
        {...props}
      />
    </div>
  );
};

export default VideoPlayer;