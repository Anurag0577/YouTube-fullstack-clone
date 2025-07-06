import apiError from "../utiles/apiError.js"
import apiResponse from "../utiles/apiResponse.js"
import asyncHandler from "../utiles/asyncHandler.js"

const uplaodImageFile = asyncHandler( async(req, res) => {
    // check for file
    if(!req.file){
        return next(new apiError(500, "iamge upload failed!"))
    }

    res.status(200).json(new apiResponse(200, "image File uplaoded successfully!", {
        url: req.file.path,
        publicId: req.file.filename,

    }))
})


const uploadVideoFile = asyncHandler(async(req, res) => {
    if(!req.file){
        return next(new apiError(500, "video upload failed!"))
    }
    res.status.json(new apiResponse(200, "Video uploaded successfully!", {
        url: req.file.path,
        public_id: req.file.filename
    }))
})

export default {uploadVideoFile, uplaodImageFile};