import express from 'express';
import {videoInformation, newVideo, updateVideoInfo, deleteVideo, incrementViewCount, allVideos} from '../controllers/video.controller.js';
import authenticateUser from '../middlewares/authenticateUser.middleware.js';
import {uploadErrorhandler, videoUpload, mixedUpload} from '../middlewares/upload.middleware.js';
import { getVideoComment } from '../controllers/comment.controller.js';
const router = express.Router();

router.get('/allVideos', allVideos)
router.get('/:videoId', authenticateUser, videoInformation); // Get the video information
// we already uploaded the thumbnail and the video using uplaod routes till this point when this api called, so we dont need to upload thumbnail or video files
router.post('/', authenticateUser, newVideo); // create / upload new video
router.put('/:videoId', authenticateUser, updateVideoInfo); // change video title, description and thumbnailUrl only
router.delete('/:videoId', authenticateUser, deleteVideo); // delete video
router.post('/:videoId/view',  incrementViewCount); // increase video count
router.get('/:videoId/comments', authenticateUser, getVideoComment );

export default router;