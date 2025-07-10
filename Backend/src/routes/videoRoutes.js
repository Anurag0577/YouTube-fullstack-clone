import express from 'express';
import {videoInformation, newVideo, updateVideoInfo, deleteVideo, incrementViewCount} from '../controllers/video.controller.js';
import authenticateUser from '../middlewares/authenticateUser.middleware.js';
const router = express.Router();

router.get('/:videoId', authenticateUser, videoInformation);
router.post('/', authenticateUser, newVideo);
router.put('/:videoId', authenticateUser, updateVideoInfo);
router.delete('/:videoId', authenticateUser, deleteVideo);
router.post('/:videoId/view', authenticateUser,  incrementViewCount);

export default router;