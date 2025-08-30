import channelController from '../controllers/channel.controller.js'
import authenticateUser from '../middlewares/authenticateUser.middleware.js'
import express from "express";
const router = express.Router();

router.post('/auto', authenticateUser, channelController.createChannelAuto)
router.post('/manual', authenticateUser, channelController.createChannelManualy)
router.get('/:channelId', channelController.getChannelDetails);

export default router;