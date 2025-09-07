// you will found all engagement related routes - like / dislike / comments

import user from "../models/user.model.js";
import videos from "../models/videos.model.js";
import apiError from "../utiles/apiError.js";
import apiResponse from "../utiles/apiResponse.js";
import asyncHandler from "../utiles/asyncHandler.js";

// **POST /api/videos/:videoId/like** - Takes: videoId → Returns: updated like count | *Likes a video*
const increaseLikes = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;
    const userId = req.user.id;

    // Check if the user has already liked the video
    const userDetails = await user.findById(userId);
    if(userDetails.likedVideos.includes(videoId)){
        return res.status(400).json(new apiResponse(400, "You have already liked this video."));
    }

    const video = await videos.findById(videoId);
    if(!video){
        throw new apiError(404, "Video not found!")
    }
    
    const updatedVideo = await videos.findByIdAndUpdate(
        videoId,
        {
            $inc: { likes : 1}
        },
        { new: true }
    );

    // Add videoId to user's likes array (this was missing in your original code)
    await user.findByIdAndUpdate(
        userId,
        {
            $addToSet: { likes: videoId }
        }
    );

    console.log(updatedVideo)
    
    res.status(200).json(new apiResponse(200, "Like count increased successfully.", updatedVideo))
})

// **DELETE /api/videos/:videoId/like** - Takes: videoId → Returns: updated like count | *Removes like from video*
const decreaseLikes = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;

        const userId = req.user.id;

    // Check if the user has already liked the video
    // const existingLike = await user.likes.find(like => like.userId === userId);
    const userDetails = await user.findById(userId);
    if(userDetails.dislikedVideos.includes(videoId)){
        return res.status(400).json(new apiResponse(400, "You have already disliked this video."));
    }

    const currentVideo = await videos.findByIdAndUpdate(videoId,
        {
            $inc: { likes : -1}
        },
        { new : true }
    )

    if(!currentVideo){
        throw new apiError('400', 'Video not found!')
    }
    
  // Ensure likes doesn't go below 0 (optional, depends on schema)
  if (currentVideo.likes < 0) {
    await videos.findByIdAndUpdate(videoId, { $set: { likes: 0 } });
    currentVideo.likes = 0;
  }

    res.status(200).json(new apiResponse(200, "Like count decreased successfully.", currentVideo))
})


// **POST /api/videos/:videoId/dislike** - Takes: videoId → Returns: updated dislike count | *Dislikes a video*

const increaseDislikes = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;
    const userId = req.user.id;

    // Check if the user has already disliked the video
    const userDetails = await user.findById(userId);
    if(userDetails.dislikes && userDetails.dislikes.includes(videoId)){
        return res.status(400).json(new apiResponse(400, "You have already disliked this video."));
    }

    const video = await videos.findById(videoId);
    if(!video){
        throw new apiError(404, "Video not found!")
    }
    
    const updatedVideo = await videos.findByIdAndUpdate(
        videoId,
        {
            $inc: { dislikes : 1}
        },
        { new: true }
    );

    // Add videoId to user's dislikes array
    await user.findByIdAndUpdate(
        userId,
        {
            $addToSet: { dislikes: videoId }
        }
    );

    console.log(updatedVideo)
    
    res.status(200).json(new apiResponse(200, "Dislike count increased successfully.", updatedVideo))
})

// **DELETE /api/videos/:videoId/dislike** - Takes: videoId → Returns: updated dislike count | *Removes dislike from video*
const decreaseDislikes = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;

    const currentVideo = await videos.findByIdAndUpdate(videoId,
        {
            $inc: { dislikes : -1}
        },
        { new : true }
    )

    if(!currentVideo){
        throw new apiError('400', 'Video not found!')
    }
    
    res.status(200).json(new apiResponse(200, "Dislike count decreased successfully.", currentVideo))
})

export { increaseLikes, decreaseLikes, increaseDislikes, decreaseDislikes} ;