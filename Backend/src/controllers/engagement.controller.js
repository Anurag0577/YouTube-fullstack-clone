// you will found all engagement related routes - like / dislike / comments

import videos from "../models/videos.model.js";
import apiError from "../utiles/apiError.js";
import apiResponse from "../utiles/apiResponse.js";
import asyncHandler from "../utiles/asyncHandler.js";

// **POST /api/videos/:videoId/like** - Takes: videoId → Returns: updated like count | *Likes a video*
const increaseLikes = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;

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

    console.log(updatedVideo)
    
    res.status(200).json(new apiResponse(200, "Like count increased successfully.", updatedVideo))
})

// **DELETE /api/videos/:videoId/like** - Takes: videoId → Returns: updated like count | *Removes like from video*
const decreaseLikes = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;

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

    const currentVideo = await videos.findByIdAndUpdate(videoId,
        {
            $inc: { dislikes : 1}
        },
        { new : true }
    )

    if(!currentVideo){
        throw new apiError('400', 'Video not found!')
    }
    
    res.status(200).json(new apiResponse(200, "Dislike count increased successfully.", currentVideo))
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