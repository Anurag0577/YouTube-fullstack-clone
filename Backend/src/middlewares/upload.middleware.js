import apiError from '../utiles/apiError.js'
import imageStorageEngine from   '../utiles/cloudinary.js'
import videoStorageEngine from '../utiles/cloudinary.js'
import multer from 'multer'



const imageFileFilter = (req, file, cb) => {
    const allowedType = ['.jpeg', '.jpg', '.png']
    if(!allowedType.includes(file.mimetype)){
        cb((new apiError(500, "File type not supported. Please upload in '.jpeg', '.jpg', or '.png' files.")), false)
    } else{
        cb(null, true)
    }
}

const videoFileFilter = (req, file, cb) => {
    const allowed_type = ['mp4', 'webm', 'avi'];
    if(!allowed_type.includes(file.mimetype)){
        cb((new apiError(500, "File type not supported please upload in 'mp4', 'avi', or in 'webm'.")). false)
    } else{
        cb(null, true)
    }
}

const imageUpload = multer({
    storage: imageStorageEngine,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

const videoUpload = multer({
    storage: videoStorageEngine,
    fileFilter: videoFileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024
    }
})

// Since this multer is a middleware not a api so we have to wright another error handler for it, I am going to wrap it in a function that catches the error if occured.

const uploadErrorhandler = (uploadMiddleware) => {
    return (req, res, next) => {
        uploadMiddleware(req, res, (error) => {
            console.log("inside the uploadErrorHandler")
            if(error instanceof multer.MulterError){
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
                if(error){
                    next(error)
                }
                next();
        })
    }
}

export default {uploadErrorhandler, imageUpload, videoUpload, fileFilter};