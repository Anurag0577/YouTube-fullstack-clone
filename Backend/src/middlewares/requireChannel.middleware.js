import asyncHandler from "../utiles/asyncHandler.js";
import user from "../models/user.model.js"
import apiError from "../utiles/apiError.js";
import apiResponse from "../utiles/apiResponse";
const requireChannel = asyncHandler(async(req, res, next) => {
    const userId =  req.user._id;
    const userInfo = await user.findById(userId);
    if(!userInfo){
        throw new apiError(404, "user not found!")
    }
    if(!userInfo.channel){
        return new apiResponse(200, "You need to create channel to use this feature!", {
            needChannel: true
        })
    }

    next();
})