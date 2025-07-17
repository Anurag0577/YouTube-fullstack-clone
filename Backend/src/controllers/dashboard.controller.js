import asyncHandler from "../utiles/asyncHandler.js";
import videos from "../models/videos.model.js";
import apiError from "../utiles/apiError.js";
import user from "../models/user.model.js";
import channel from "../models/channels.model.js";
import apiResponse from "../utiles/apiResponse.js"


const getChannelVideos = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const userVideos = await videos.find({ owner: userId });
    if (!userVideos) {
        throw new apiError(404, "No videos found for this user!");
    }
    res.status(200).json({
        success: true,
        count: userVideos.length,
        videos: userVideos
    });
    res.status(200).json(new apiResponse(200, "channel videos fetched successfull!", userVideos))
})

const getChannelDetail = asyncHandler(async(req, res) => {
    const userId =  req.user._id;
    const userInfo = user.findById(userId);
    if(!userInfo){
        throw new apiError(400, "User not found.")
    }

    const channelId = userInfo.channel;
    const channelInfo= await channel.findById(channelId)
    if(!channelInfo){
        throw new apiError(400, "Channel does not found!")
    }
    res.send(200).json(new apiResponse(200, "Channel detailed fetched successfully!", channelInfo))
})

const editChannelDetail = asyncHandler(async(req, res) => {
    const userId  = req.user._id; // get id from the middleware
    const {channelName, description, avatar, banner} = req.body;
    const userInfo = await user.findById(userId);
    if(!userInfo){
        throw new apiError(400, "User not find!")
    }

    const channelId = userInfo.channel;
    const updatedChannelInfo = await channel.findByIdAndUpdate(channelId, {
        channelName,
        description,
        avatar,
        banner
    })

    res.send(200).json(new apiResponse(200, "Channel detail updated successfully!", updatedChannelInfo))
})

export {getChannelVideos, getChannelDetail, editChannelDetail}