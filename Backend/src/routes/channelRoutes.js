import channelController from '../controllers/channel.controller.js'
import authenticateUser from '../middlewares/authenticateUser.middleware.js'
import express from "express";
const router = express.Router();

router.post('/auto', authenticateUser, channelController.createChannelAuto)
router.post('/manual', authenticateUser, channelController.createChannelManualy)

export default router;