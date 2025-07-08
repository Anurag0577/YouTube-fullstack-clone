import {registerUser, loginUser} from "../controllers/auth.controller.js"
import express from "express";
import {uploadErrorhandler, singleImageUpload} from '../middlewares/upload.middleware.js'

const router = express.Router();

// Use singleImageUpload for avatar upload
router.post('/signup', uploadErrorhandler(singleImageUpload.single('avatar')), registerUser);
router.post('/login', loginUser);

export default router;