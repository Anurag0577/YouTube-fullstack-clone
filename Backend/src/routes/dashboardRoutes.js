import express from 'express';
import authenticateUser from '../middlewares/authenticateUser.middleware';
import { editChannelDetail, getChannelDetail, getChannelVideos } from '../controllers/dashboard.controller';

const router = express.Router();

// **GET /api/dashboard/analytics** - Takes: JWT token → Returns: channel analytics (views, subscribers, etc.)  
// *Gets channel analytics for dashboard*
router.get('/analytics', authenticateUser, getChannelDetail)


// **GET /api/dashboard/videos** - Takes: JWT token → Returns: channel owner's videos with edit options
// *Gets channel owner's videos for management*
router.get('/videos', authenticateUser, getChannelVideos);


// **PUT /api/dashboard/channel** - Takes: channel updates (banner, description, etc.) → Returns: updated channel
// *Updates channel branding and info*
router.put('/channel', authenticateUser, editChannelDetail);