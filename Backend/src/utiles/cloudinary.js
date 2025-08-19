// REQUIRED ENVIRONMENT VARIABLES for Cloudinary:
// CLOUDINARY_CLOUD_NAME=your_real_cloud_name
// CLOUDINARY_API_KEY=your_real_api_key
// CLOUDINARY_API_SECRET=your_real_api_secret
// cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv'
import apiError from './apiError.js';
dotenv.config();

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log("Cloudinary config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "SET" : "NOT SET",
    api_key: process.env.CLOUDINARY_API_KEY ? "SET" : "NOT SET",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT SET"
});

const validateCloudinaryConfig = () => {
    const {cloud_name, api_key, api_secret} = cloudinary.config();
    console.log("Validating Cloudinary config:", { cloud_name, api_key: api_key ? "SET" : "NOT SET", api_secret: api_secret ? "SET" : "NOT SET" });
    if(!cloud_name || !api_key || !api_secret){
        console.warn('Cloudinary configuration is incomplete. Please check environment variables. File uploads may not work properly.');
        return false;
    }
    return true;
}

// Only validate if environment variables are present
const isCloudinaryConfigured = validateCloudinaryConfig();
console.log('Cloudinary configured:', isCloudinaryConfigured);

// Only create storage engines if Cloudinary is properly configured
let imageStorageEngine = null;
let videoStorageEngine = null;
let mixedStorageEngine = null;

if (isCloudinaryConfigured) {
    console.log('Creating Cloudinary storage engines...');
    imageStorageEngine = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'images',
            allowed_formats: ['jpeg', 'png', 'jpg'], 
            resource_type: 'image'
        }
    });

    videoStorageEngine = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'videos',
            allowed_formats: ['mp4', 'avi', 'webm'], 
            resource_type: "video",
            media_metadata: true
        }
    });
    
    // Mixed storage engine to handle both images and videos in the same request
    mixedStorageEngine = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: (req, file) => {
            const isVideo = file.mimetype && file.mimetype.startsWith('video/');
            const isImage = file.mimetype && file.mimetype.startsWith('image/');
            if (isVideo) {
                return {
                    folder: 'videos',
                    allowed_formats: ['mp4', 'avi', 'webm'],
                    resource_type: 'video'
                };
            }
            if (isImage) {
                return {
                    folder: 'images',
                    allowed_formats: ['jpeg', 'png', 'jpg'],
                    resource_type: 'image'
                };
            }
            throw new apiError(400, 'Unsupported file type. Only images and videos are allowed.');
        }
    });
    console.log('Cloudinary storage engines created successfully');
} else {
    console.log('Using local storage engines (Cloudinary not configured)');
}

export { 
    cloudinary, 
    imageStorageEngine, 
    videoStorageEngine, 
    mixedStorageEngine,
    validateCloudinaryConfig,
    isCloudinaryConfigured
};