import { useState } from "react";
import api from "../api/axios";

function VideoDetail({
    uploadVideoDetail,
    file,
    videoTitle,
    videoDescription,
    uploadedThumbnailDetail,
    setThumbnailImg,
    setVideoTitle,
    setVideoDescription,
    setUploadedThumbnailDetail
}) {

    const videoUrl = uploadVideoDetail?.data?.url;

    function handleThumbnail(e) {
        const thumbnail = e.target.files[0];
        if (!thumbnail) return;

        setThumbnailImg(thumbnail);

        const formData = new FormData();
        formData.append('image', thumbnail);

        api.post('/upload/image/single', formData)
            .then(res => {
                setUploadedThumbnailDetail(res.data);
            })
            .catch(error => console.error("Thumbnail upload failed:", error));
    }

    return (
        <div className="flex flex-col md:flex-row items-start gap-6 p-4">
            {/* Left Column: Form Details */}
            <div className="flex-grow">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Details</h2>
                
                {/* Title Input */}
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium mb-1">Video Title</label>
                    <input
                        type="text"
                        id="title"
                        placeholder="Add a title that describes your video"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                {/* Description Input */}
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium mb-1">Video Description</label>
                    <textarea
                        id="description"
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        placeholder="Tell viewers about your video"
                        className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                    />
                </div>

                {/* Thumbnail Section */}
                <div className="mb-6">
                    <div className="block text-sm font-medium mb-1">Thumbnail</div>
                    <p className="text-[12px] text-gray-500 mb-2">Set a thumbnail that stands out and draws viewers' attention.</p>
                    
                    {uploadedThumbnailDetail?.data?.url ? (
                        <div className="relative group w-40">
                            <img
                                src={uploadedThumbnailDetail.data.url}
                                alt="Thumbnail Preview"
                                className="w-40 h-24 object-cover rounded-lg border border-gray-300"
                            />
                            <button 
                                onClick={() => setUploadedThumbnailDetail(null)}
                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 text-xs hover:bg-black"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <label className="w-40 h-24 flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                            <span className="text-sm text-gray-600">Upload</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleThumbnail} />
                        </label>
                    )}
                </div>

                {/* Audience Section */}
                <div className="space-y-2">
                    <div className="text-sm font-medium">Audience</div>
                    <div className="text-sm font-bold text-gray-700">Is this video 'Made for Kids'?</div>
                    <div className="text-[11px] p-3 bg-gray-100 rounded-lg text-gray-600 leading-relaxed">
                        Regardless of your location, you're legally required to comply with COPPA. 
                        You're required to tell us whether your videos are 'Made for Kids'.
                    </div>
                </div>
            </div>

            {/* Right Column: Video Preview Sidebar */}
            <div className="max-w-xs w-full bg-gray-50 rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                {videoUrl ? (
                    <div className="p-0">
                        <video
                            key={videoUrl} // Forces video to reload when URL updates
                            controls
                            className="w-full aspect-video bg-black"
                        >
                            <source src={videoUrl} type="video/mp4" />
                        </video>
                        
                        <div className="p-4 space-y-4">
                            <div>
                                <p className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Video Link</p>
                                <a
                                    href={videoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-blue-600 truncate block hover:underline"
                                >
                                    {videoUrl}
                                </a>
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">File Name</p>
                                <p className="text-sm text-gray-800 truncate">{file?.name || "Uploading..."}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="aspect-video bg-gray-200 flex items-center justify-center text-gray-400">
                        Processing Video...
                    </div>
                )}
            </div>
        </div>
    );
}

export default VideoDetail;