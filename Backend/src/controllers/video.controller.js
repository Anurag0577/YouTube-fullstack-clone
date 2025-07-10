import asyncHandler from '../../src/utiles/asyncHandler.js'
import videos from '../models/videos.model.js';
import apiError from '../utiles/apiError.js';
import apiResponse from '../utiles/apiResponse.js';
import cloudinary from 'cloudinary';


// GET /api/videos/:videoId - Takes: videoId → Returns: video details + channel info | 
// Gets video details for video player page
const videoInformation = asyncHandler(async(req, res, next) => {
    const videoId = req.params.videoId;
    
    const videoInfo = videos.findById(videoId);
    if(!videoInfo){
        throw new apiError(500, "video not found!")
    }

    res.status(200).json(new apiResponse(200, "Video information successfully fetched!", videoInfo))
})

// POST /api/videos - Takes: video file + metadata (title, description, thumbnail) → Returns: created video object | 
// Uploads new video to platform
const newVideo = asyncHandler(async(req, res) => {
    const {title, description } = req.body;

    const duration = req.file && req.file.duration !== undefined ? req.file.duration : 0;
    const videoUrl = req.file && req.file.path ? req.file.path : '';
    const thumbnailUrl = req.file && req.file.path ? req.file.path : '';


    const newVideoInfo = new videos({
        title,
        description,
        videoUrl,
        thumbnailUrl,
        channel: req.user.channel, // Assuming req.user contains the authenticated user's info
        owner: req.user._id, // Assuming req.user contains the authenticated user's info
        isPublished: false, // Default to false until published
    })

    await newVideoInfo.save();

    res.status(201).json(new apiResponse(201, "New video successfully created!", newVideoInfo))
})

// PUT /api/videos/:videoId - Takes: videoId + updated metadata → Returns: updated video object | 
// Updates video title, description, thumbnail
const updateVideoInfo = asyncHandler(async(req, res) => {
    const videoId = req.params.videoId;
    const {title, description, thumbnailUrl} = req.body;
    if(!title || !description || !thumbnailUrl){
        throw new apiError(400, "Title/description/thumbnailUrl is missing!")
    }
    const updatedVideo = await videos.findByIdAndUpdate(videoId, {title, description, thumbnailUrl})

    if(!updatedVideo){
        throw new apiError(500, "Video information not update!")
    }

    res.status(200).json(new apiResponse(200, "Video detail updated successfully!"), updatedVideo)
})

const deleteVideo = asyncHandler(async(req, res) => {
    const videoId = req.params.videoId;

    const deletedVideo = await videos.findByIdAndDelete(videoId);
    if(!deletedVideo){
        throw new apiError(500, "Video not found!")
    }

    // this will delete video from the cloudinary cloud storage.
    const deleteVideoFromCloudinary = async(publicId) => {
        try{
            const result = await cloudinary.uploader.destroy(publicId, {resource_type: 'video'})
            console.log('Deletion result: ', result)
            return result;
        } catch(error){
            console.error(`Error deleting video: ${error}`)
            throw error;
        }
    }

    deleteVideoFromCloudinary();
})

// POST /api/videos/:videoId/view - Takes: videoId → Returns: updated view count | 
// Increments video view count
const incrementViewCount = asyncHandler(async(req, res) => {
    const videoId = req.params.videoId;
    const video = await videos.findById(videoId);
    if(!video){
        throw new apiError(404, "Video not found!")
    }
    video.views += 1; // Increment view count
    await video.save();

    res.status(200).json(new apiResponse(200, "Video view count incremented successfully!", video.views));
})


export {videoInformation, newVideo, updateVideoInfo, deleteVideo, incrementViewCount}