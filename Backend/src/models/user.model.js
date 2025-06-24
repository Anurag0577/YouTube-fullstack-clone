import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is mandatory!"],
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
        minlength: 2,
        maxLength: 10,
        default: "guest",
        match: /^[a-z0-9_.]+$/
    }, 
    email: {
        type: String,
        unique: true,
        required:[true, "Email is mandatory!"],
        match: /^[a-z0-9.]+$/,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is mandatory!"],
        minLength: 5,
        maxLength: 15,
        match: /^[a-zA-Z0-9_.&$@!]+$/
    },
    firstName: String,
    lastName: String,
    avatar: String, // Cloudinary link
    createdAt: Date,
    updatedAt: Date, 
    isVerified: Boolean,
    watchHistory: Object,
    likedVideo: Object,
    dislikedVideos: Object,
    savedVideos: Object,
    subscribedChannels: Object
})

const user = mongoose.model('user', userSchema);

export default user;''