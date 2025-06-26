import express from 'express';
import uploadFile from '../controllers/uploadFile.controller';
import uploadMiddleware from '../middlewares/upload.middleware';

const router = express.Router();

router.post('/upload', uploadMiddleware.uploadErrorhandler(uploadMiddleware.upload.single('image')), uploadFile);

export default router;