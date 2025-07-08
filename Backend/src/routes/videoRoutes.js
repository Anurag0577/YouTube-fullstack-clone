import express from 'express';
import {videoInformation, newVideo, updateVideoInfo, deleteVideo, incrementViewCount} from '../controllers/video.controller.js';
const router = express.Router();

router.get('/:videoId', videoInformation);
router.post('/', newVideo);
router.put('/:videoId', updateVideoInfo);
router.delete('/:videoId', deleteVideo);
router.post('/:videoId/view',  incrementViewCount);

export default router;