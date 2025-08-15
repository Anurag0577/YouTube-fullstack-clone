import user from "../models/user.model";
import asyncHandler from "../utiles/asyncHandler";
import channels from "../models/channels.model.js"
import apiError from "../utiles/apiError";

const express = express;

const createChannelAuto = asyncHandler(async(req, res) => {
    const userId = req.user.id;
    const userDetail = await user.findById(userId);
    if(!userDetail){
        throw new apiError(500, "Does not get user detail from the server")
    }
    const channel = new channels({
        channelName : userDetail.username,
        owner: userDetail._id,
        avatar: userDetail.avatar,
    })

    const savedChannel = await channel.save();

    res.status(200).json(apiResponse(200, "Channel created successfully!", savedChannel))
})

const createChannelManualy = asyncHandler( async(req, res) => {
    const userId = req.user.id;
    const {channelName, description} = req.body;

    // create a new channel
    const channel =  new channel({
        channelName,
        owner: req.user.id,
        description,
        avatar,
        cover
    })

    const savedChannel = await channel.save();
    res.status(200).json(apiResponse(200, "Channel created successfully!", savedChannel))
})

export default {createChannelAuto, createChannelManualy}