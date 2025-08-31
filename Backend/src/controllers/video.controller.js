import asyncHandler from '../../src/utiles/asyncHandler.js'
import user from '../models/user.model.js';
import channel from '../models/channels.model.js'
import videos from '../models/videos.model.js';
import apiError from '../utiles/apiError.js';
import apiResponse from '../utiles/apiResponse.js';
import { cloudinary } from '../utiles/cloudinary.js';

// GET /api/allVideos - Returns: Random list of video
// get list of videos for the homepage feed.
const allVideos = asyncHandler(async (req, res) => {
    const { page = 1 , limit = 30} = req.query;
    const pageNum = parseInt(page)
    const videoLimit = parseInt(limit)
    const skip = (pageNum - 1)* videoLimit;
    const randomVideos = await videos.aggregate([
        { $match: { isPublished: true } },
        { $sample: { size: videoLimit + skip } },
        { $skip: skip },
        { $limit: videoLimit },
        // Join channel details
        {
            $lookup: {
                from: 'channels',
                localField: 'channel',
                foreignField: '_id',
                as: 'channelDoc'
            }
        },
        { $unwind: { path: '$channelDoc', preserveNullAndEmptyArrays: true } },
        // Join owner details
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'ownerDoc'
            }
        },
        { $unwind: { path: '$ownerDoc', preserveNullAndEmptyArrays: true } },
        {
            $project: {
                title: 1,
                description: 1,
                videoUrl: 1,
                thumbnailUrl: 1,
                duration: 1,
                views: 1,
                likes: 1,
                dislikes: 1,
                publishedAt: 1,
                channel: 1,
                // Prefer channel name/avatar; fall back to owner's
                channelName: {
                    $ifNull: ['$channelDoc.channelName', '$ownerDoc.username']
                },
                channelAvatar: {
                    $ifNull: ['$channelDoc.avatar', '$ownerDoc.avatar']
                },
            }
        }
    ])

    if(randomVideos.length <= 0){
        throw new apiError(404, "No videos found.")
    }

    res.status(200).json(new apiResponse(200, "random video generation successfull!", randomVideos))
})

// GET /api/videos/:videoId - Takes: videoId → Returns: video details + channel info | 
// Gets video details for video player page
const videoInformation = asyncHandler(async(req, res, next) => {
    const videoId = req.params.videoId;
    
    const videoInfo = await videos.findById(videoId);
    if(!videoInfo){
        throw new apiError(500, "video not found!")
    }

    res.status(200).json(new apiResponse(200, "Video information successfully fetched!", videoInfo))
})

// Helper function to extract public ID from various sources
const getPublicIdFromVideo = (videoFile) => {
    // Try different possible sources for public ID
    if (videoFile.public_id) {
        return videoFile.public_id;
    }
    
    if (videoFile.filename) {
        return videoFile.filename;
    }
    
    return null;
};

// Helper function to get duration from Cloudinary with retry logic
const getDurationFromCloudinary = async (publicId, maxRetries = 5, initialDelay = 1000) => {
    if (!publicId) {
        console.log('No public ID provided for duration fetch');
        return 0;
    }

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Attempt ${attempt}: Fetching duration for public ID: ${publicId}`);
            
            const resource = await cloudinary.api.resource(publicId, { 
                resource_type: 'video',
                // Request specific fields to optimize the call
                media_metadata: true
            });
            
            console.log('Cloudinary resource response:', {
                public_id: resource.public_id,
                duration: resource.duration,
                resource_type: resource.resource_type,
                format: resource.format
            });
            
            if (resource && typeof resource.duration === 'number' && resource.duration > 0) {
                console.log(`Duration found: ${resource.duration} seconds`);
                return resource.duration;
            }
            
            console.log(`Attempt ${attempt}: Duration not available yet or invalid`);
            
        } catch (error) {
            console.error(`Attempt ${attempt}: Error fetching duration:`, error.message);
            
            // If it's a not found error, don't retry
            if (error.http_code === 404) {
                console.error('Resource not found in Cloudinary');
                break;
            }
        }
        
        // Wait before retry with exponential backoff
        if (attempt < maxRetries) {
            const delay = initialDelay * Math.pow(1.5, attempt - 1);
            console.log(`Waiting ${delay}ms before retry...`);
            await wait(delay);
        }
    }
    
    console.log('Could not retrieve duration from Cloudinary');
    return 0;
};

// POST /api/videos - Takes: video file + thumbnail image + metadata (title, description) → Returns: created video object
// Uploads new video and its thumbnail to the platform
// New : dont need to take any input like file and thumbnail form the middleware all the data you will recieve via body
const newVideo = asyncHandler(async(req, res) => {
    const { title, description, videoUrl, duration, thumbnailUrl} = req.body;
    const userId = req.user.id;
    
    
    const userDetail = await user.findById(userId);


    const channelDetail = await channel.findById(userDetail.channel);


    // // Expecting multipart form-data with fields: video (file), thumbnail (file)
    // const videoFile = req.files && Array.isArray(req.files.video) && req.files.video[0] ? req.files.video[0] : null;
    // const thumbnailFile = req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail[0] ? req.files.thumbnail[0] : null;

    
    // console.log('Video file object:', JSON.stringify(videoFile, null, 2));
    
    // let duration = 0;
    
    // // First, check if duration is already available in the uploaded file
    // if (videoFile.duration && typeof videoFile.duration === 'number' && videoFile.duration > 0) {
    //     duration = videoFile.duration;
    //     console.log(`Duration from upload: ${duration} seconds`);
    // } else {
    //     // Try to get duration from Cloudinary
    //     const publicId = getPublicIdFromVideo(videoFile);
        
    //     if (publicId) {
    //         console.log(`Attempting to fetch duration for public ID: ${publicId}`);
    //         duration = await getDurationFromCloudinary(publicId);
    //     } else {
    //         console.log('Could not determine public ID for duration fetch');
    //     }
    // }

    // const videoUrl = videoFile.path || videoFile.secure_url || '';
    // const thumbnailUrl = thumbnailFile.path || thumbnailFile.secure_url || '';

    const newVideoInfo = new videos({
        title,
        description,
        videoUrl,
        duration,
        thumbnailUrl,
        channel: userDetail.channel,
        owner: req.user._id,
        isPublished: true,
    });
    
    console.log('New video info before save:', {
        title: newVideoInfo.title,
        duration: newVideoInfo.duration,
        videoUrl: newVideoInfo.videoUrl,
        thumbnailUrl: newVideoInfo.thumbnailUrl
    });

    await newVideoInfo.save();

    // If duration is still 0, you might want to update it later with a background job
    if (duration === 0) {
        console.warn('Video saved with duration 0. Consider implementing a background job to update duration later.');
    }

    res.status(201).json(new apiResponse(201, "New video successfully created!", newVideoInfo))
})

// PUT /api/videos/:videoId - Takes: videoId + updated metadata → Returns: updated video object | 
// Updates video title, description, thumbnail
const updateVideoInfo = asyncHandler(async(req, res) => {
    const videoId = req.params.videoId;
    const {title, description, thumbnailUrl} = req.body;
    
    if(!title || !description){
        throw new apiError(400, "Title and description are required!")
    }
    
    const updatedVideo = await videos.findByIdAndUpdate(
        videoId, 
        {title, description, thumbnailUrl}, 
        { new: true } // Return updated document
    );

    if(!updatedVideo){
        throw new apiError(500, "Video not found or could not be updated!")
    }

    res.status(200).json(new apiResponse(200, "Video detail updated successfully!", updatedVideo))
})

const deleteVideo = asyncHandler(async(req, res) => {
    const videoId = req.params.videoId;

    // First check if video exists
    const video = await videos.findById(videoId);
    if(!video){
        throw new apiError(404, "Video not found!")
    }

    // Extract public ID from video URL for deletion
    const getPublicIdFromUrl = (url) => {
        if (!url) return null;
        const match = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)\.[^\/\.]+$/);
        return match && match[1] ? match[1] : null;
    };

    // Delete video from cloudinary cloud storage
    const deleteVideoFromCloudinary = async(publicId) => {
        if (!publicId) {
            console.log('No public ID found for deletion');
            return;
        }
        
        try{
            const result = await cloudinary.uploader.destroy(publicId, {resource_type: 'video'});
            console.log('Deletion result: ', result);
            return result;
        } catch(error){
            console.error(`Error deleting video from Cloudinary: ${error}`);
            throw new apiError(500, "Failed to delete video from cloud storage");
        }
    }

    try {
        // Extract public ID and delete from Cloudinary first
        const publicId = getPublicIdFromUrl(video.videoUrl);
        if (publicId) {
            await deleteVideoFromCloudinary(publicId);
        }

        // Then delete from database
        await videos.findByIdAndDelete(videoId);

        res.status(200).json(new apiResponse(200, "Video deleted successfully!", { videoId }));
    } catch (error) {
        // If Cloudinary deletion fails, don't delete from database
        console.error('Error in video deletion process:', error);
        throw error;
    }
})

// POST /api/videos/:videoId/view - Takes: videoId → Returns: updated view count | 
// Increments video view count
const incrementViewCount = asyncHandler(async(req, res) => {
    const videoId = req.params.videoId;
    
    const updatedVideo = await videos.findByIdAndUpdate(
        videoId,
        { $inc: { views : 1 } },
        { new: true }
    );

    if(!updatedVideo){
        throw new apiError(404, "Video not found!")
    }

    res.status(200).json(new apiResponse(200, "Video view count incremented successfully!", { views: updatedVideo.views }));
})

export {videoInformation, newVideo, updateVideoInfo, deleteVideo, incrementViewCount, allVideos}