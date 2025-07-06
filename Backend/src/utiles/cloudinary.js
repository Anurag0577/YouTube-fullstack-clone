// how to use cloudinary
/*
1. configue cloudinary
2. create cloudinary cloud storage where the files are going to install
3. 
*/

import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv'
import apiError from './apiError.js';
dotenv.config();

// connect my application to Cloudinary’s servers for storing and managing uploaded files.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const validateCloudinaryConfig = () => {
    const {cloud_name, api_key, api_secret} = cloudinary.config();
    if(!cloud_name || !api_key || !api_secret){
        throw new apiError('Cloudinary configuration is incomplete. Please check environment variable.')
    }
}

// integrate Multer with Cloudinary for storing uploaded files directly in Cloudinary instead of local storage.
const imageStorageEngine = new CloudinaryStorage({
    cloudinary: cloudinary, // give an instance of cloudinary
    params: {
        folder: 'images',
        allowed_formate: ['jpeg', 'png',  'jpg'],
        resource_type: 'image'
    }
})

const videoStorageEngine = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'videos',
        allowed_type: ['mp4', 'avi', 'webm'],
        resource_type: 'video'
    }
})

export default {imageStorageEngine, videoStorageEngine, validateCloudinaryConfig};