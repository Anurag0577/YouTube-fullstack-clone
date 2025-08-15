import express from express;
import authenticateUser from '../middlewares/authenticateUser.middleware.js'
const router = express.router;


router.post('/channel', authenticateUser, createChannelAuto)
router.post('/channel', authenticateUser, createChannelManualy)

export default channelRoutes.js