import asyncHandler from "../utiles/asyncHandler.js";
import videos from "../models/videos.model.js";
import apiError from "../utiles/apiError.js";
import user from "../models/user.model.js";
import channel from "../models/channels.model.js";
import apiResponse from "../utiles/apiResponse.js"

const createChannel = asyncHandler(async(req, res) => {
    const owner = req.user._id;
    const userInfo = await user.findById(owner);
    if(!userInfo){
        throw new apiError('404', "User not found!")
    }
    const {channelName, description} = req.body;
    const bannerImage = req.files && req.files.channelBanner ? req.files.channelBanner[0].path : undefined;
    const avatarImage = req.files && req.files.channelAvatar ? req.files.channelAvatar[0].path : userInfo.avatar;

    const channelInfo = await channel.create({
        channelName,
        description,
        owner,
        banner: bannerImage,
        avatar: avatarImage
    })

    res.status(200).json( new apiResponse(200, "Create channel successfully!", channelInfo))
})

const getChannelVideos = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const userVideos = await videos.find({ owner: userId });
    if (!userVideos || userVideos.length === 0) {
        throw new apiError(404, "No videos found for this user!");
    }
    res.status(200).json(new apiResponse(200, "channel videos fetched successfull!", userVideos))
})

const getChannelDetail = asyncHandler(async(req, res) => {
    const userId =  req.user._id;
    const userInfo = await user.findById(userId);
    if(!userInfo){
        throw new apiError(400, "User not found.")
    }

    const channelId = userInfo.channel;
    const channelInfo= await channel.findById(channelId)
    if(!channelInfo){
        throw new apiError(400, "Channel does not found!")
    }
    res.status(200).json(new apiResponse(200, "Channel detailed fetched successfully!", channelInfo))
})

const editChannelDetail = asyncHandler(async(req, res) => {
    const userId  = req.user._id; // get id from the middleware
    const userInfo = await user.findById(userId);
    if(!userInfo){
        throw new apiError(400, "User not find!")
    }
    const {channelName, description} = req.body;
    const avatar = req.files && req.files.channelAvatar[0] ? req.files.channelAvatar[0].path : undefined;
    const banner = req.files && req.files.channelBanner[0] ? req.files.channelBanner[0].path : undefined;

    const channelId = userInfo.channel;
    if(!channelId){
        throw new apiError(400, "Channel Id not found!")
    }

    const updatePlayload = {channelName, description};
    avatar ? updatePlayload.avatar = avatar : undefined;
    banner ? updatePlayload.banner = banner : undefined;


    const updatedChannelInfo = await channel.findByIdAndUpdate(channelId, updatePlayload , { new : true })

    res.status(200).json(new apiResponse(200, "Channel detail updated successfully!", updatedChannelInfo))
})

export {getChannelVideos, getChannelDetail, editChannelDetail}