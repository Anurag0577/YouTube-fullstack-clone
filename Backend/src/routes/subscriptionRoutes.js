import express from 'express';
import { 
    subscribeChannel, 
    unsubscribeChannel, 
    getSubscriptionStatus,
    getUserSubscriptions 
} from '../controllers/subscription.controller.js';
import authenticateUser from '../middlewares/authenticateUser.middleware.js';

const router = express.Router();

// All subscription routes require authentication
router.use(authenticateUser);

// Subscribe to a channel
router.post('/subscribe', subscribeChannel);

// Unsubscribe from a channel
router.post('/unsubscribe', unsubscribeChannel);

// Get subscription status for a specific channel
router.get('/status/:channelId', getSubscriptionStatus);

// Get user's all subscriptions
router.get('/user-subscriptions', getUserSubscriptions);

export default router;