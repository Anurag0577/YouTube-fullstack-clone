import {
    increaseLikes,
    increaseDislikes,
    decreaseLikes,
    decreaseDislikes
} from '../controllers/engagement.controller.js';
import express from 'express';
import authenticateUser from '../middlewares/authenticateUser.middleware.js';
const router = express.Router();

router.post('/:videoId/increaseLike', authenticateUser , increaseLikes);
router.post('/:videoId/increaseDislike', authenticateUser , increaseDislikes );
router.post('/:videoId/decreaseLike', authenticateUser , decreaseLikes );
router.post('/:videoId/decreaseDislike', authenticateUser , decreaseDislikes );

export default router;