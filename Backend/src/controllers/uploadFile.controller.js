import apiError from "../utiles/apiError.js"

const uplaodFile = async(req, res) => {
    // check for file
    if(!req.file){
        return next(new apiError(500, "File upload failed!"))
    }

    res.status(200).json(new apiResponse(200, "File uplaoded successfully!", {
        url: req.file.path,
        publicId: req.file.filename
    }))
}

export default uplaodFile;