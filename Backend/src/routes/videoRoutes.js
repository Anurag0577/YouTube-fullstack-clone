import express from 'express';
import {videoInformation, newVideo, updateVideoInfo, deleteVideo, incrementViewCount} from '../controllers/video.controller.js';
import authenticateUser from '../middlewares/authenticateUser.middleware.js';
import {uploadErrorhandler, videoUpload} from '../middlewares/upload.middleware.js';
import { getVideoComment } from '../controllers/comment.controller.js';
const router = express.Router();

router.get('/:videoId', authenticateUser, videoInformation); // Get the video information
router.post('/', authenticateUser, uploadErrorhandler(videoUpload.single('video')), newVideo); // create / upload new video
router.put('/:videoId', authenticateUser, updateVideoInfo); // change video title, description and thumbnailUrl only
router.delete('/:videoId', authenticateUser, deleteVideo); // delete video
router.post('/:videoId/view', authenticateUser,  incrementViewCount); // increase video count
router.get('/:videoId/comments', authenticateUser, getVideoComment );
export default router;