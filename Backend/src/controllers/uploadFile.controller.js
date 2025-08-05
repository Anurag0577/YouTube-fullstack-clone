// upload.controller.js
import apiError from "../utiles/apiError.js"
import apiResponse from "../utiles/apiResponse.js"
import asyncHandler from "../utiles/asyncHandler.js"
import { isCloudinaryConfigured } from "../utiles/cloudinary.js"

// ✅ Fixed: Controller for single image upload
const uploadSingleImage = asyncHandler(async(req, res, next) => {
    try {
        if (!req.file) {
            return next(new apiError(400, 'No image file uploaded'));
        }

        let uploadedImage;
        
        if (isCloudinaryConfigured) {
            // Cloudinary file structure
            uploadedImage = {
                url: req.file.path,
                public_id: req.file.filename,
                format: req.file.format,
                size: req.file.bytes,
                width: req.file.width,
                height: req.file.height
            };
        } else {
            // Local storage file structure
            uploadedImage = {
                url: `/uploads/images/${req.file.filename}`,
                public_id: req.file.filename,
                format: req.file.mimetype.split('/')[1],
                size: req.file.size,
                filename: req.file.filename,
                originalname: req.file.originalname
            };
        }

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

        const uploadedImages = req.files.map(file => {
            if (isCloudinaryConfigured) {
                // Cloudinary file structure
                return {
                    url: file.path,
                    public_id: file.filename,
                    format: file.format,
                    size: file.bytes,
                    width: file.width,
                    height: file.height
                };
            } else {
                // Local storage file structure
                return {
                    url: `/uploads/images/${file.filename}`,
                    public_id: file.filename,
                    format: file.mimetype.split('/')[1],
                    size: file.size,
                    filename: file.filename,
                    originalname: file.originalname
                };
            }
        });

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
        
        let uploadedVideo;
        
        if (isCloudinaryConfigured) {
            // Cloudinary file structure
            uploadedVideo = {
                url: req.file.path,
                public_id: req.file.filename,
                format: req.file.format,
                size: req.file.bytes,
                duration: req.file.duration // Available for videos
            };
        } else {
            // Local storage file structure
            uploadedVideo = {
                url: `/uploads/videos/${req.file.filename}`,
                public_id: req.file.filename,
                format: req.file.mimetype.split('/')[1],
                size: req.file.size,
                filename: req.file.filename,
                originalname: req.file.originalname
            };
        }

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