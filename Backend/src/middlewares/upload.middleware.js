// upload.middleware.js
import apiError from '../utiles/apiError.js'
import { imageStorageEngine, videoStorageEngine, isCloudinaryConfigured } from '../utiles/cloudinary.js' // ✅ Fixed: Named imports
import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Local storage configuration as fallback
const localImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(uploadsDir, 'images'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const localVideoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(uploadsDir, 'videos'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Create subdirectories for local storage
const imagesDir = path.join(uploadsDir, 'images');
const videosDir = path.join(uploadsDir, 'videos');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}
if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
}

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
    const allowVideoFormats = ['video/mp4'];
    if (!allowVideoFormats.includes(file.mimetype)) {
        cb(new apiError(400, "File type not supported. Please upload MP4 files."), false);
        return;
    }
    cb(null, true);
};

// Different configurations for different use cases
const singleImageUpload = multer({
    storage: isCloudinaryConfigured ? imageStorageEngine : localImageStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB
    }
});

// ✅ Added: Multiple image upload configuration
const multipleImageUpload = multer({
    storage: isCloudinaryConfigured ? imageStorageEngine : localImageStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

const avatarUpload = multer({
    storage: isCloudinaryConfigured ? imageStorageEngine : localImageStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB for avatars
    }
});

const videoUpload = multer({
    storage: isCloudinaryConfigured ? videoStorageEngine : localVideoStorage,
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