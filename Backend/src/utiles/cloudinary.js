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

const validateCloudinaryConfig = () => {
    const {cloud_name, api_key, api_secret} = cloudinary.config();
    if(!cloud_name || !api_key || !api_secret){
        console.warn('Cloudinary configuration is incomplete. Please check environment variables. File uploads may not work properly.');
        return false;
    }
    return true;
}

// Only validate if environment variables are present
const isCloudinaryConfigured = validateCloudinaryConfig();

// Only create storage engines if Cloudinary is properly configured
let imageStorageEngine = null;
let videoStorageEngine = null;

if (isCloudinaryConfigured) {
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
            resource_type: 'video'
        }
    });
}

export { 
    cloudinary, 
    imageStorageEngine, 
    videoStorageEngine, 
    validateCloudinaryConfig,
    isCloudinaryConfigured
};