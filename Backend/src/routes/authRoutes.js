import {registerUser, loginUser, logoutUser, regenerateAccessToken, testEnvironment} from "../controllers/auth.controller.js"
import express from "express";
import {uploadErrorhandler, singleImageUpload} from '../middlewares/upload.middleware.js'

const router = express.Router();

// Use singleImageUpload for avatar upload
router.post('/signup', uploadErrorhandler(singleImageUpload.single('avatar')), registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/newAccessToken', regenerateAccessToken);
router.get('/test-env', testEnvironment);

export default router;