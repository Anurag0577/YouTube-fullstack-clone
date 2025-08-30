import express from "express";
import asyncHandler from "../utiles/asyncHandler.js";
import channel from "../models/channels.model.js";
import videos from "../models/videos.model.js"; // Added missing import
import apiError from "../utiles/apiError.js";
import apiResponse from "../utiles/apiResponse.js";
import user from "../models/user.model.js"

const createChannelAuto = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    
    // Validate user ID exists
    if (!userId) {
        throw new apiError(401, "User not authenticated");
    }

    const userDetail = await user.findById(userId);
    if (!userDetail) {
        throw new apiError(404, "User not found");
    }

    // Check if user already has a channel
    if (userDetail.channel) {
        throw new apiError(400, "User already has a channel");
    }

    const channelName = userDetail.username;
    
    // Check if channel name already exists
    const existingChannel = await channel.findOne({ channelName });
    if (existingChannel) {
        throw new apiError(409, "Channel name already exists");
    }

    const newChannel = new channel({
        channelName,
        owner: userDetail._id,
        avatar: userDetail.avatar,
    });

    const savedChannel = await newChannel.save();

    // Update user with channel reference
    userDetail.channel = savedChannel._id;
    await userDetail.save();

    res.status(201).json(
        new apiResponse(201, "Channel created successfully!", savedChannel)
    );
});

const createChannelManualy = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const { channelName, description, avatar, cover } = req.body;

    // Validate user ID exists
    if (!userId) {
        throw new apiError(401, "User not authenticated");
    }

    // Validate required fields
    if (!channelName || channelName.trim().length === 0) {
        throw new apiError(400, "Channel name is required");
    }

    // Check if channel name already exists
    const existingChannel = await channel.findOne({ channelName: channelName.trim() });
    if (existingChannel) {
        throw new apiError(409, "Channel name already exists");
    }

    // Check if user already has a channel
    const userDetail = await user.findById(userId);
    if (!userDetail) {
        throw new apiError(404, "User not found");
    }

    if (userDetail.channel) {
        throw new apiError(400, "User already has a channel");
    }

    // Create a new channel
    const newChannel = new channel({
        channelName: channelName.trim(),
        owner: userId,
        description: description?.trim() || "",
        avatar: avatar || userDetail.avatar,
        cover: cover || ""
    });

    const savedChannel = await newChannel.save();

    // Update user with channel reference
    userDetail.channel = savedChannel._id;
    await userDetail.save();

    res.status(201).json(
        new apiResponse(201, "Channel created successfully!", savedChannel)
    );
});

const getChannelDetails = asyncHandler(async (req, res) => {
    console.log("I am in getChannelDetails")
    const { channelId } = req.params;

    // Validate channelId
    if (!channelId || !channelId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new apiError(400, "Invalid channel ID format");
    }

    // Fetch channel details
    const channelDetails = await channel.findById(channelId)
    
    if (!channelDetails) {
        throw new apiError(404, 'Channel not found');
    }

    // Fetch all videos by this channel
    const channelVideos = await videos.find({ 
        channel: channelId,
        isPublished: true 
    })
    .select('title description thumbnailUrl duration views likes dislikes publishedAt')
    .sort({ publishedAt: -1 })
    .lean();

    // Calculate additional statistics
    const totalVideos = channelVideos.length;
    const totalViews = channelVideos.reduce((sum, video) => sum + (video.views || 0), 0);
    const totalLikes = channelVideos.reduce((sum, video) => sum + (video.likes || 0), 0);
    const totalDislikes = channelVideos.reduce((sum, video) => sum + (video.dislikes || 0), 0);

    const responseData = {
            _id: channelDetails._id,
            channelName: channelDetails.channelName,
            description: channelDetails.description || "",
            avatar: channelDetails.avatar || "",
            cover: channelDetails.cover || "",
            subscriberCount: channelDetails.subscriberCount || 0,
            totalViews: channelDetails.totalViews || totalViews,
            createdAt: channelDetails.createdAt,
            owner: channelDetails.owner,
            videos: channelVideos,
            totalVideos,
            totalLikes,
            totalDislikes,
            subscriberCount: channelDetails.subscriberCount || 0,
            totalViews: channelDetails.totalViews || totalViews
    };

    res.status(200).json(new apiResponse(
        200, 
        'Channel details fetched successfully', 
        responseData
    ));
});

export default { createChannelAuto, createChannelManualy, getChannelDetails };