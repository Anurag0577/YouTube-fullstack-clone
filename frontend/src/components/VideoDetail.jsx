import { useState } from "react";
import axios from "axios";
import api from "../api/axios";

function VideoDetail({uploadVideoDetail, file, videoTitle, videoDescription, uploadedThumbnailDetail, setThumbnailImg, setVideoTitle, setVideoDescription, setUploadedThumbnailDetail}){


    // Only log if uploadVideoDetail and uploadVideoDetail.data exist
    if (uploadVideoDetail && uploadVideoDetail.data) {
        console.log(uploadVideoDetail.data.url);
    }

    function handleThumbnail(e){
        const thumbnail = e.target.files[0];
        setThumbnailImg(thumbnail)


        const formData = new FormData();
        formData.append('image', thumbnail);

        api.post('/upload/image/single', formData )
        .then(res => {
            setUploadedThumbnailDetail(res.data)
        })
        .catch(error => console.error(error))
    }

    return (
        <>
        <div className="flex items-start">
            <div className="flex-grow px-4 py-2 ">
                {/* video details */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Details</h2>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm mb-1">Video Title</label>
                    <input
                        type="text"
                        id="title"
                        value={videoTitle}
                        onChange={(e)=> setVideoTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500 transition"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm mb-1">Video Description</label>
                    <div
                        id="description"
                        contentEditable
                        className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black-500 transition"
                        style={{ resize: "vertical", overflowY: "auto" }}
                        placeholder="Enter video description..."
                        suppressContentEditableWarning={true}
                        onInput={(e) => setVideoDescription(e.currentTarget.innerText)}
                    >
                        {videoDescription}
                    </div>
                    </div>
                    <div className="block text-sm mb-1">Thumbnail</div>
                    <div className="block text-[10px] text-gray-600 mb-1">Set a thumbnail that stands out and draws viewers' attention.</div>
                    {uploadedThumbnailDetail && uploadedThumbnailDetail.data.url ? (
                        <div className="mb-2">
                            <img
                                src={uploadedThumbnailDetail.data.url}
                                alt="Thumbnail Preview"
                                className="w-32 h-20 object-cover rounded-lg border border-gray-300"
                            />
                        </div>
                    ) : (
                        <label className="btn-primary min-h-9.5 min-w-40 text-center cursor-pointer mx-auto pr-3 py-4 pl-3 rounded-2x flex justify-center items-center border border-gray-400 border-dashed" style={{ borderRadius: '12px' }}>
                            Upload
                            <input type="file" accept="image/*" className="hidden" onChange={handleThumbnail} />
                        </label>
                    )}

                    <div className="block text-sm mb-1 mt-3">Audience</div>
                    <div className="block text-sm font-bold text-gray-600 mb-1">Is this video 'Made for Kids'?</div>
                    <div className="block text-[10px] px-1 py-1 bg-gray-100 mb-1">Regardless of your location, you're legally required to comply with the Children's Online Privacy Protection Act (COPPA) and/or other laws. You're required to tell us whether your videos are 'Made for Kids'. What is 'Made for Kids' content?
                    </div>
                    </div>
                    <div className="max-w-60 w-full bg-gray-100 h-max rounded-2xl px-4 py-4 mt-5 shadow-lg">
                    
                {uploadVideoDetail && uploadVideoDetail.data && (
                    <>
                        <video
                            controls
                            className="w-full max-w-xs rounded-lg border border-gray-300 bg-white shadow-md mb-3"
                        >
                            <source src={uploadVideoDetail.data.url} type="video/mp4" />
                        </video>
                        <div className="mb-2">
                            <p className="text-xs text-gray-700 break-all font-semibold">Video URL</p>
                            <a
                                target='_blank'
                                href={uploadVideoDetail.data.url}
                                className="whitespace-nowrap text-blue-700 overflow-hidden text-ellipsis inline-block max-w-full text-xs"
                            >
                                {uploadVideoDetail.data.url}
                            </a>
                        </div>
                        <div>
                            <p className="text-xs text-gray-700 break-all font-semibold">File name</p>
                            <span className="whitespace-nowrap text-gray-800 overflow-hidden text-ellipsis inline-block max-w-full text-xs">
                                {file.name}
                            </span>
                        </div>
                    </>
                )}
            </div>
            </div>
        </>
    )
}

export default VideoDetail;