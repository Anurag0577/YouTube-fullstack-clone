import VideoPlayer from "./VideoPlayer.jsx";
import Headers from "./Header.jsx"
function VideoPlayerPage() {
  return (
    <>
      <Headers/>
    </>
  );
}

export default VideoPlayerPage;





    // <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6 px-4">
    //   <h1 className="text-2xl font-bold text-gray-800 mb-8">
    //     🎬 Cloudinary Video Showcase
    //   </h1>

    //   {/* Basic Example */}
    //   <div className="w-full max-w-xl bg-white shadow-md rounded-xl p-4 mb-6">
    //     <h2 className="text-lg font-semibold text-gray-700 mb-3">
    //       Basic Example
    //     </h2>
    //     <VideoPlayer
    //       id="player1"
    //       publicId="glide-over-coastal-beach"
    //       className="h-[220px]" // much smaller
    //     />
    //   </div>

    //   {/* Advanced Example */}
    //   <div className="w-full max-w-xl bg-white shadow-md rounded-xl p-4">
    //     <h2 className="text-lg font-semibold text-gray-700 mb-3">
    //       Advanced Example
    //     </h2>
    //     <VideoPlayer
    //       id="player2"
    //       publicId="https://res.cloudinary.com/dywh2ogcw/video/upload/v1756203380/videos/je23ipwprpzwjvidnvg4.mp4"
    //       className="h-[220px]"
    //       playerConfig={{
    //         muted: true,
    //         autoplayMode: "on-scroll",
    //         posterOptions: { transformation: { effect: "blur:200" } },
    //       }}
    //       sourceConfig={{
    //         info: {
    //           title: "Glide Over Coastal Beach",
    //           description: "Scenic aerial view of a coastal beach 🌊",
    //         },
    //       }}
    //     />
    //   </div>
    // </div>