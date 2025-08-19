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

// POST /api/videos - Takes: video file + thumbnail image + metadata (title, description) → Returns: created video object
// Uploads new video and its thumbnail to the platform
const newVideo = asyncHandler(async(req, res) => {
    const { title, description } = req.body;
    const userId = req.user.id;
    const userDetail = await user.findById(userId);
    if (!userDetail) {
        throw new apiError(500, "Did not get user.")
    }

    const channelDetail = await channel.findById(userDetail.channel);

    // Expecting multipart form-data with fields: video (file), thumbnail (file)
    const videoFile = req.files && Array.isArray(req.files.video) && req.files.video[0] ? req.files.video[0] : null;
    const thumbnailFile = req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail[0] ? req.files.thumbnail[0] : null;

    if (!videoFile) {
        throw new apiError(400, "Video file is required.");
    }
    if (!thumbnailFile) {
        throw new apiError(400, "Thumbnail image is required.");
    }

    let duration = typeof videoFile.duration === 'number' ? videoFile.duration : 0;
    if (!duration) {
        const extractPublicIdFromUrl = (url) => {
            if (!url) return null;
            const match = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)\.[^\/\.]+$/);
            return match && match[1] ? match[1] : null;
        };

        const publicIdCandidate = videoFile.filename || videoFile.public_id || extractPublicIdFromUrl(videoFile.path);
        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const fetchDurationWithRetry = async (publicId, attempts = 3, delayMs = 700) => {
            for (let attempt = 1; attempt <= attempts; attempt++) {
                try {
                    const details = await cloudinary.api.resource(publicId, { resource_type: 'video' });
                    if (details && typeof details.duration === 'number' && details.duration > 0) {
                        return details.duration;
                    }
                } catch (err) {
                    // ignore and retry
                }
                if (attempt < attempts) {
                    await wait(delayMs);
                }
            }
            return 0;
        };

        if (publicIdCandidate) {
            duration = await fetchDurationWithRetry(publicIdCandidate, 3, 700);
        }
    }

    const videoUrl = videoFile.path || '';
    const thumbnailUrl = thumbnailFile.path || '';

    const newVideoInfo = new videos({
        title,
        description,
        videoUrl,
        duration,
        thumbnailUrl,
        channel: userDetail.channel,
        owner: req.user._id,
        isPublished: true,
    })
    console.log(newVideoInfo);

    await newVideoInfo.save();

    res.status(201).json(new apiResponse(201, "New video successfully created!", newVideoInfo))
})

// PUT /api/videos/:videoId - Takes: videoId + updated metadata → Returns: updated video object | 
// Updates video title, description, thumbnail
const updateVideoInfo = asyncHandler(async(req, res) => {
    const videoId = req.params.videoId;
    const {title, description, thumbnailUrl} = req.body;
    if(!title || !description){
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
    const updatedVideo = await videos.findByIdAndUpdate(
        videoId,
        {
            $inc: { views : 1}
        },
        { new: true }
    );

    res.status(200).json(new apiResponse(200, "Video view count incremented successfully!", updatedVideo.views));
})


export {videoInformation, newVideo, updateVideoInfo, deleteVideo, incrementViewCount, allVideos}