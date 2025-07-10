// upload.controller.js
import apiError from "../utiles/apiError.js"
import apiResponse from "../utiles/apiResponse.js"
import asyncHandler from "../utiles/asyncHandler.js"

// ✅ Fixed: Controller for single image upload
const uploadSingleImage = asyncHandler(async(req, res, next) => {
    try {
        if (!req.file) {
            return next(new apiError(400, 'No image file uploaded'));
        }

        const uploadedImage = {
            url: req.file.path,
            public_id: req.file.filename,
            format: req.file.format,
            size: req.file.bytes,
            width: req.file.width,
            height: req.file.height
        };

        res.status(200).json(new apiResponse(200, "Image uploaded successfully!", uploadedImage));
    } catch (error) {
        next(error);
    }
});

// ✅ Fixed: Controller for multiple image upload
const uploadMultipleImages = asyncHandler(async(req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return next(new apiError(400, 'No image files uploaded'));
        }

        const uploadedImages = req.files.map(file => ({
            url: file.path,
            public_id: file.filename,
            format: file.format,
            size: file.bytes,
            width: file.width,
            height: file.height
        }));

        res.status(200).json(new apiResponse(200, 
            `${req.files.length} images uploaded successfully`, 
            {
                count: req.files.length,
                images: uploadedImages
            }
        ));
    } catch (error) {
        next(error);
    }
});

const uploadVideoFile = asyncHandler(async(req, res, next) => {
    try {
        if(!req.file){
            return next(new apiError(400, "No video file uploaded"));
        }
        
        const uploadedVideo = {
            url: req.file.path,
            public_id: req.file.filename,
            format: req.file.format,
            size: req.file.bytes,
            duration: req.file.duration // Available for videos
        };

        // ✅ Fixed: Added missing parentheses for status method
        res.status(200).json(new apiResponse(200, "Video uploaded successfully!", uploadedVideo));
    } catch (error) {
        next(error);
    }
});

export {
    uploadVideoFile, 
    uploadSingleImage, 
    uploadMultipleImages
};