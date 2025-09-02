import { useEffect, useRef } from "react";
import cloudinary from "cloudinary-video-player";
import "cloudinary-video-player/cld-video-player.min.css";

const VideoPlayer = ({ id, publicId, playerConfig, sourceConfig, className = "", ...props }) => {
  const cloudinaryRef = useRef();
  const playerRef = useRef();

  useEffect(() => {
    if (cloudinaryRef.current) return;

    cloudinaryRef.current = cloudinary;

    const player = cloudinaryRef.current.videoPlayer(playerRef.current, {
      cloud_name: "demo",
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

    player.source(
  {
    publicId: publicId, // works for publicId
    sourceTypes: ["mp4"], // allow direct mp4 links
    transformations: { quality: "auto", fetch_format: "auto" },
    url: publicId.startsWith("http") ? publicId : undefined, // if it's a URL, use it
  },
  sourceConfig
);
  }, [publicId, playerConfig, sourceConfig]);

  return (
    <video
      ref={playerRef}
      id={id}
      className={`cld-video-player cld-fluid aspect-video w-full rounded-lg shadow-md ${className}`}
      {...props}
    />
  );
};

export default VideoPlayer;
