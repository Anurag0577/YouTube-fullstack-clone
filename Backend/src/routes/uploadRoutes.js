import express from 'express';
import {uploadVideoFile, uploadImageFile} from '../controllers/uploadFile.controller.js';
import {imageUpload, videoUpload, uploadErrorhandler} from '../middlewares/upload.middleware.js'

const router = express.Router();

router.post('/upload', uploadErrorhandler(imageUpload.single('image')), uploadImageFile);
router.post('/upload', uploadErrorhandler(videoUpload.single('image')), uploadVideoFile);

export default router;