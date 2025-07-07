const express = require('express');
const router = express.Router();
const {videoInformation, newVideo, updateVideoInfo, deleteVideo, incrementViewCount} = require('../controllers/video.controller.js');

router.get('/:videoId', videoInformation);
router.post('/', newVideo);
router.put('/:videoId', updateVideoInfo);
router.delete('/:videoId', deleteVideo);
router.post('/:videoId/view',  incrementViewCount);

export default router;