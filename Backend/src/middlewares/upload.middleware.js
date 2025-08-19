// upload.middleware.js
import apiError from '../utiles/apiError.js';
import {
  imageStorageEngine,
  videoStorageEngine,
  isCloudinaryConfigured,
  mixedStorageEngine
} from '../utiles/cloudinary.js';
import multer from 'multer';

// Validate Cloudinary configuration at startup
const cloudEnabled = typeof isCloudinaryConfigured === 'function'
  ? isCloudinaryConfigured()
  : !!isCloudinaryConfigured;

if (!cloudEnabled) {
  // If you prefer not to crash on startup, you can log a warning and later return 500 on use.
  throw new Error('Cloudinary is not configured. Please set Cloudinary credentials to enable uploads.');
}

// Filters
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new apiError(400, 'File type not supported. Please upload JPEG, JPG, PNG, or GIF files.'), false);
  } else {
    cb(null, true);
  }
};

const videoFileFilter = (req, file, cb) => {
  const allowVideoFormats = ['video/mp4'];
  if (!allowVideoFormats.includes(file.mimetype)) {
    cb(new apiError(400, 'File type not supported. Please upload MP4 files.'), false);
    return;
  }
  cb(null, true);
};

// Multer instances (Cloudinary only)
const singleImageUpload = multer({
  storage: imageStorageEngine,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});

const multipleImageUpload = multer({
  storage: imageStorageEngine,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB per file
  }
});

const avatarUpload = multer({
  storage: imageStorageEngine,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB for avatars
  }
});

const videoUpload = multer({
  storage: videoStorageEngine,
  fileFilter: videoFileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});

// Mixed upload for handling both video and thumbnail in one request
const mixedUpload = multer({
  storage: mixedStorageEngine,
  limits: {
    fileSize: 100 * 1024 * 1024
  }
});

// Common upload error handler
const uploadErrorhandler = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (error) => {
      console.log('inside the uploadErrorHandler');

      if (error) {
        console.error('Upload error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      }

      if (error instanceof multer.MulterError) {
        console.error('Multer error:', error.code, error.message);
        switch (error.code) {
          case 'LIMIT_FILE_SIZE':
            return next(new apiError(400, 'File too large. Please select a smaller file.'));
          case 'LIMIT_FILE_COUNT':
            return next(new apiError(400, 'Too many files. Maximum allowed is 5.'));
          case 'LIMIT_UNEXPECTED_FILE':
            return next(new apiError(400, 'Unexpected file field.'));
          default:
            return next(new apiError(400, 'File upload failed.'));
        }
      }

      if (error) {
        console.error('Non-multer error:', error.message);
        return next(error);
      }

      console.log('Upload middleware completed successfully');
      next();
    });
  };
};

export {
  uploadErrorhandler,
  singleImageUpload,
  multipleImageUpload,
  avatarUpload,
  videoUpload,
  mixedUpload
};
