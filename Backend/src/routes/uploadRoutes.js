// routes/upload.routes.js
import express from 'express';
import { 
    uploadErrorhandler, 
    singleImageUpload, 
    multipleImageUpload, 
    avatarUpload, 
    videoUpload 
} from '../middlewares/upload.middleware.js';
import { 
    uploadVideoFile, 
    uploadSingleImage, 
    uploadMultipleImages 
} from '../controllers/uploadFile.controller.js';

const router = express.Router();

// ✅ Single image upload route
router.post('/image/single', 
    uploadErrorhandler(singleImageUpload.single('image')), 
    uploadSingleImage
);

// ✅ Multiple images upload route (max 5 files)
router.post('/image/multiple', 
    uploadErrorhandler(multipleImageUpload.array('images', 5)), 
    uploadMultipleImages
);

// ✅ Avatar upload route
router.post('/avatar', 
    uploadErrorhandler(avatarUpload.single('avatar')), 
    uploadSingleImage
);

// ✅ Video upload route
router.post('/video', 
    uploadErrorhandler(videoUpload.single('video')), 
    uploadVideoFile
);

export default router;