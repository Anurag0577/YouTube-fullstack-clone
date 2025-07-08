import express from 'express'; 
import {uploadVideoFile, uploadImageFile} from '../controllers/uploadFile.controller.js';
import {uploadErrorhandler, singleImageUpload, videoUpload} from '../middlewares/upload.middleware.js'

const router = express.Router();

// Use different paths to avoid route conflicts
router.post('/upload/image', uploadErrorhandler(singleImageUpload.single('image')), uploadImageFile);
router.post('/upload/video', uploadErrorhandler(videoUpload.single('video')), uploadVideoFile);

export default router;