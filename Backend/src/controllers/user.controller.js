import user from "../models/user.model.js";
import apiError from "../utiles/apiError.js";
import apiResponse from "../utiles/apiResponse.js";
import asyncHandler from "../utiles/asyncHandler.js";
import mongoose from "mongoose";

const userInformation = asyncHandler(async(req, res, next) => {
    const userId = req.params.userId;
    if(!userId){
        throw new apiError(400, "userId unavailable!")
    }

    const userInfo = await user.findById(userId);
    if(!userInfo){
        throw new apiError(500, "User not found!")
    }

    res.status(200).json(new apiResponse(200, "Successfully get the user info.", userInfo))
})


export default userInformation;