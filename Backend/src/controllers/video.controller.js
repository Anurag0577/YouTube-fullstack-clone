import asyncHandler from '../../src/utiles/asyncHandler.js'
import videos from '../models/videos.model.js';
import apiResponse from '../utiles/apiResponse.js';


// GET /api/videos/:videoId - Takes: videoId → Returns: video details + channel info | 
// Gets video details for video player page
const videoInformation = asyncHandler(async(req, res, next) => {
    const videoId = req.params.videoId;
    
    const videoInfo = videos.findById(videoId);
    if(!videoInfo){
        throw new apiError(500, "Invalid videoId!")
    }

    res.status(200).json(new apiResponse(200, "Video information successfully fetched!", videoInfo))
})



export default {videoInformation}