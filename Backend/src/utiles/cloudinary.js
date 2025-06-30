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

const storageEngine = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'upload',
        allowed_formate: ['.jpeg', '.png',  '.jpg']
    }
})

export default {storageEngine, validateCloudinaryConfig};