import {registerUser, loginUser} from "../controllers/auth.controller.js"
import express from "express";
import uploadMiddleware from '../middlewares/upload.middleware.js'
const router = express.Router();
const { upload, uploadErrorhandler } = uploadMiddleware;

router.post('/signup', uploadErrorhandler(upload.single('avatar')), registerUser);
router.post('/login', loginUser);

export default router;