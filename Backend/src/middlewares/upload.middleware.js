// upload.middleware.js
import apiError from '../utiles/apiError.js'
import { imageStorageEngine, videoStorageEngine } from '../utiles/cloudinary.js' // ✅ Fixed: Named imports
import multer from 'multer'

const imageFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(!allowedTypes.includes(file.mimetype)){
        cb(new apiError(400, "File type not supported. Please upload JPEG, JPG, or PNG files."), false);
    } else{
        cb(null, true);
    }
}

// const videoFileFilter = (req, file, cb) => {
//     const allowedTypes = ['video/mp4', 'video/webm', 'video/avi'];
//     if(!allowedTypes.includes(file.mimetype)){
//         cb(new apiError(400, "File type not supported. Please upload MP4, AVI, or WebM files."), false);
//     } else{
//         cb(null, true);
//     }
// }

const videoFileFilter = (req, file, cb) => {
    // Allow all file types
    cb(null, true);
};

// Different configurations for different use cases
const singleImageUpload = multer({
    storage: imageStorageEngine,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// ✅ Added: Multiple image upload configuration
const multipleImageUpload = multer({
    storage: imageStorageEngine,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

const avatarUpload = multer({
    storage: imageStorageEngine,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB for avatars
    }
});

const videoUpload = multer({
    storage: videoStorageEngine,
    fileFilter: videoFileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB
    }
});

const uploadErrorhandler = (uploadMiddleware) => {
    return (req, res, next) => {
        uploadMiddleware(req, res, (error) => {
            console.log("inside the uploadErrorHandler");
            if (error) {
                // Only log as JSON for readability
                console.error("Upload error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
                // Remove any direct console.log(error) or similar lines
            }
            if(error instanceof multer.MulterError){
                switch (error.code) {
                    case 'LIMIT_FILE_SIZE':
                        return next(new apiError(400, 'File too large. Please select a smaller file.'));
                    case 'LIMIT_FILE_COUNT':
                        return next(new apiError(400, 'Too many files. Maximum allowed is 5.'));
                    case 'LIMIT_UNEXPECTED_FILE':
                        return next(new apiError(400, 'Unexpected file field.'));
                    default:
                        return next(new apiError(400, 'File upload failed.'));  
                }
            }
            if(error){
                return next(error);
            }
            next();
        })
    }
}

// ✅ Fixed: Export all configurations including the new multipleImageUpload
export {
    uploadErrorhandler, 
    singleImageUpload, 
    multipleImageUpload, 
    avatarUpload, 
    videoUpload
};