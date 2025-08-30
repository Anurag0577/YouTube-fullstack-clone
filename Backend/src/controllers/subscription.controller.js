import asyncHandler from '../utiles/asyncHandler.js'
import channels from '../models/channels.model.js'
import subscriptions from '../models/subscriptions.model.js'
import apiResponse from '../utiles/apiResponse.js'
import apiError from '../utiles/apiError.js'

const subscribeChannel = asyncHandler(async(req, res) => {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
        throw new apiError(401, "User not authenticated. Please login first.")
    }

    const subscriber = req.user._id;
    const { channelId } = req.body;

    // Validate channelId
    if (!channelId) {
        throw new apiError(400, "Channel ID is required")
    }

    // Check if channel exists
    const channelInfo = await channels.findById(channelId);
    if (!channelInfo) {
        throw new apiError(404, "Channel not found!")
    }

    // Check if user is trying to subscribe to their own channel
    if (channelInfo.owner && channelInfo.owner.toString() === subscriber.toString()) {
        throw new apiError(400, "You cannot subscribe to your own channel")
    }

    // Check if already subscribed
    const existingSubscription = await subscriptions.findOne({
        subscriber,
        channel: channelId
    });

    if (existingSubscription) {
        throw new apiError(400, "Already subscribed to this channel")
    }

    // Create subscription
    const newSubscription = await subscriptions.create({
        subscriber,
        channel: channelId
    });

    // Update subscriber count in channel
    await channels.findByIdAndUpdate(
        channelId, 
        { $inc: { subscriberCount: 1 } }
    );

    res.status(201).json(
        new apiResponse(201, "Channel subscribed successfully!", {
            subscription: newSubscription,
            isSubscribed: true,
            subscriberCount: channelInfo.subscriberCount + 1
        })
    );
});

const unsubscribeChannel = asyncHandler(async(req, res) => {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
        throw new apiError(401, "User not authenticated. Please login first.")
    }

    const subscriber = req.user._id;
    const { channelId } = req.body;

    // Validate channelId
    if (!channelId) {
        throw new apiError(400, "Channel ID is required")
    }

    // Find and delete subscription
    const subscription = await subscriptions.findOneAndDelete({
        subscriber, 
        channel: channelId
    });

    if (!subscription) {
        throw new apiError(404, "Subscription not found. You are not subscribed to this channel.")
    }

    // Update subscriber count in channel
    await channels.findByIdAndUpdate(
        channelId, 
        { $inc: { subscriberCount: -1 } }
    );

    // Get updated channel info
    const updatedChannel = await channels.findById(channelId);

    res.status(200).json(
        new apiResponse(200, "Channel unsubscribed successfully!", {
            isSubscribed: false,
            subscriberCount: updatedChannel.subscriberCount
        })
    );
});

// Get subscription status for a specific channel
const getSubscriptionStatus = asyncHandler(async(req, res) => {
    if (!req.user || !req.user._id) {
        return res.status(200).json(
            new apiResponse(200, "Subscription status retrieved", {
                isSubscribed: false
            })
        );
    }

    const subscriber = req.user._id;
    const { channelId } = req.params;

    if (!channelId) {
        throw new apiError(400, "Channel ID is required")
    }

    const subscription = await subscriptions.findOne({
        subscriber,
        channel: channelId
    });

    const channel = await channels.findById(channelId);

    res.status(200).json(
        new apiResponse(200, "Subscription status retrieved", {
            isSubscribed: !!subscription,
            subscriberCount: channel ? channel.subscriberCount : 0
        })
    );
});

// Get user's subscriptions
const getUserSubscriptions = asyncHandler(async(req, res) => {
    if (!req.user || !req.user._id) {
        throw new apiError(401, "User not authenticated. Please login first.")
    }

    const subscriber = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const subscriptionsList = await subscriptions.find({ subscriber })
        .populate('channel', 'channelName avatar subscriberCount')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await subscriptions.countDocuments({ subscriber });

    res.status(200).json(
        new apiResponse(200, "User subscriptions retrieved", {
            subscriptions: subscriptionsList,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    );
});

export { 
    subscribeChannel, 
    unsubscribeChannel, 
    getSubscriptionStatus,
    getUserSubscriptions 
};