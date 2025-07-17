import {
    increaseLikes,
    increaseDislikes,
    decreaseLikes,
    decreaseDislikes
} from '../controllers/engagement.controller.js';
import express from 'express';
const router = express.Router();

router.post('/:videoId/increaseLike', increaseLikes);
router.post('/:videoId/increaseDislike', increaseDislikes );
router.post('/:videoId/decreaseLike', decreaseLikes );
router.post('/:videoId/decreaseDislike', decreaseDislikes );

export default router;