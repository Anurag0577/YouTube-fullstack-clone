import asyncHandler from '../utiles/asyncHandler.js'
import channels from '../models/channels.model.js'
import subscriptions from '../models/subscriptions.model.js';
import apiResponse from '../utiles/apiResponse.js'
import apiError from '../utiles/apiResponse.js'

const subscribeChannel = asyncHandler(async(req, res) => {
    // three things - subscriber(user) , channel 
    const subscriber = req.user._id;

    const channelId = req.params.channelId;
    const channelInfo = await channels.findById(channelId);

    if(!channelInfo){
        throw new apiError(400, "channel not found!")
    }

    const channel = await subscriptions.create(
        {
            subscriber,
            channel : channelId
        }
    )

    res.status(200).json( new apiResponse(200, "Channel subscribed successfully!", channelInfo))
});


const unsubscribeChannel = asyncHandler( async(req, res) => {
    const subscriber = req.user._id;
    const channelId  = req.params.channelId;

    const subscription = await subscriptions.findOneAndDelete({subscriber, channel: channelId});
    res.status(200).json(new apiResponse(200, "Channel "))
})