import express from 'express';
import {
    getVideoComment,
    deleteNewComment,
    addNewComment
} from "../controllers/comment.controller.js"
import authenticateUser from '../middlewares/authenticateUser.middleware.js';
const router = express.Router();

router.post('/:videoId/comments', authenticateUser, addNewComment);
router.delete('/:commentId', authenticateUser, deleteNewComment)

export default router;