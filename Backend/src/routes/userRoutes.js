import express from 'express';
import  userInformation  from '../controllers/user.controller.js';
import authenticateUser from '../middlewares/authenticateUser.middleware.js';

const router = express.Router();


// Get specific user information by ID
router.get('/:userId', userInformation);

export default router;