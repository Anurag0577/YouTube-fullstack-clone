import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import apiError from '../utiles/apiError.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  avatar: {
    type: String,
    default: null
  },
  watchHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  likedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  dislikedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  savedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  channel: {
    type:mongoose.Types.ObjectId,
    ref: 'Channel'
  },
  subscribedChannels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel'
  }],
  refreshToken: {
    type: String,
    select: false
  }
}, {
  timestamps: true
});


// For security reasons we encrypt the password before saving it using bcrypt. 
// How to work with bcrypt...
// 1. import it, use mongoose pre hook to write a fucntion that run just before creating the new user.
// 2. if password is not modified then pass next()
// 3. If  modified then generate a salt using bcrypt.genSalt(10) and then create a hash using password and salt using bcrypt.hash(this.password, salt)
// 4. if some error return it to 

userSchema.pre('save', async function(next){
    // check whether the password modified or not if not then next()
    if(!this.isModified('password')){
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(6);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        console.log(error);
        return next(new apiError(500, 'Error occured during password hashing.'));
    }
})

// methods is an object on a schema that allows you to define custom instance methods. These methods are available on document instances (i.e., individual documents retrieved from the database).
userSchema.methods.isPasswordCorrect = function(password){ 
return bcrypt.compare(password, this.password); // return a boolean value
}

// Generate accessTokens and refreshToken
userSchema.methods.genAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.genRefreshToken = function(){
    return jwt.sign({
        _id: this._id
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}


const user = mongoose.model('user', userSchema);

export default user;

