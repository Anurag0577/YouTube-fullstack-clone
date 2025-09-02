import axios from "axios";
import { useState } from "react"
import { AiOutlineEdit } from 'react-icons/ai';

function EditPopup({videoId}){
    console.log(videoId)
    const [videoTitle, setVideoTitle] = useState(videoId.title);
    const [videoDescription, setVideoDescription] = useState(videoId.description)
    const [videoThumbnail, setVideoThumbnail] = useState(videoId.thumbnailUrl)

    const updateVideoDetailHandler = async() => {
        const accessToken = localStorage.getItem('accessToken');
        await axios.put(`http://localhost:3000/api/videos/${videoId._id}`, {
            title: videoTitle,
            description: videoDescription,
            thumbnailUrl: videoThumbnail
        },
        {
        headers: {
            "Content-Type" : "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
        })
        .then(res => {
            console.log(res?.data?.data)
            const updateVideoDetail = res?.data?.data;
        })
    }
    return(
        <>
           <div className=" max-w-full h-max flex">

                <div className="leftSide w-[60%] h-max">
                    <div>
                        <label htmlFor="title" className="block text-sm mb-1">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={videoTitle}
                            onChange={(e) => setVideoTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500 transition mb-5"
                        />
                        <label htmlFor="title" className="block text-sm mb-1">Description</label>
                        <textarea
                            type="text"
                            id="description"
                            value={videoDescription}
                            rows={15}
                            onChange={(e) => setVideoDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500 transition"
                        />
                    </div>
                </div>
                <div className="rightSide w-[40%] h-max">
                    <div className="m-3 justify-between p-2 bg-gray-100 rounded-2xl">
                        <div className="relative">
                            <div className="p-1 rounded-full absolute z-10 right-0 text-black bg-white hover:text-white hover:bg-black m-1 cursor-pointer"><AiOutlineEdit className="text-2xl  "/></div>
                            <img src= {videoThumbnail} className=" w-full aspect-video object-cover transition-transform duration-200 group-hover:scale-105 rounded-2xl mb-3"></img>
                        </div>
                        
                        <h1 className="font-medium text-3xl md:text-base leading-tight text-gray-900 line-clamp-2 ">{videoTitle}</h1>
                    </div>
                </div>
                
            </div> 
            <div className="w-full p-1.5 rounded-2xl mt-3 bg-black text-white text-center cursor-pointer hover:bg-white hover:border-2 hover:text-black" onClick={updateVideoDetailHandler}>Update</div>
        </>
    )
}

export default EditPopup;