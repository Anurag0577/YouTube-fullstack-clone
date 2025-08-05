import asyncHandler from '../utiles/asyncHandler.js'
import user from '../models/user.model.js' // from next project, must create models in pascalCase.
import apiError from '../utiles/apiError.js';
import apiResponse from '../utiles/apiResponse.js'
import { isCloudinaryConfigured } from '../utiles/cloudinary.js'

// Generate Access and Refresh Tokens
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const userFound = await user.findById(userId);
        
        const accessToken = userFound.genAccessToken();
        const refreshToken = userFound.genRefreshToken();

        // Save refresh token to database
        userFound.refreshToken = refreshToken;
        await userFound.save({ validateBeforeSave: false }); // when you use validateBeforeSave: false then it does not matter whether the model have this field/property or not means if model dont have refreshToken then it going to create it and save the value.

        return { accessToken, refreshToken };
    } catch (error) {
        throw new apiError(500, "Something went wrong while generating tokens");
    }
};

const registerUser = asyncHandler(async(req, res, next) => {
    console.log("registerUser function called");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const {username, password, email, firstName, lastName} = req.body;

    if(!username || !password || !email || !firstName){
        throw new apiError(400, "Please fill all the required details!")
    }

    // Check user already exist or not.
    const existingUser = await user.findOne({ $or: [{username}, {email}]})
    if(existingUser){
        throw new apiError(409, "Username or email already exists.")
    }

    // Handle avatar upload
    let avatarUrl = null;
    if(req.file){
        console.log("Avatar file received:", req.file);
        if (isCloudinaryConfigured) {
            // Cloudinary returns a full URL
            avatarUrl = req.file.path;
        } else {
            // Local storage - create a URL that can be accessed by frontend
            avatarUrl = `/uploads/images/${req.file.filename}`;
        }
        console.log("Avatar URL set to:", avatarUrl);
    }

    //Create new user
        const newUser = new user({username, password, email, firstName, lastName: lastName || null, avatar: avatarUrl})
        await newUser.save();
        console.log("User saved successfully:", newUser._id);

    const userResponse = {
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        avatar: newUser.avatar
    };
    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(newUser._id);
    console.log("Tokens generated successfully");

    // send response
    console.log("Sending success response");
    return res.status(201).json(new apiResponse(201, "User registered successfully", {
        user: userResponse,
        accessToken,
        refreshToken
    }));
})


// Login 

const loginUser = asyncHandler(async(req, res, next) => {
    // Steps
    // get login credentials from the forntend
    // compare password
    // if password match let him login
    // otherwise givve  error

    const {email, password} = req.body;

    // check for password
    if(!email || !password){
        throw new apiError(400, "Email and password both required for login!")
    }

    // Validate the credentials
    const loginUser = await user.findOne({email}).select("+password")
    if(!loginUser){
        throw new apiError(401, "Invalid login credentials!")
    }

    const isCorrect = await loginUser.isPasswordCorrect(password);
    if(!isCorrect){
        throw new apiError(401, "Invalid login credentials!")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(loginUser._id);

    

    res.status(200).json(new apiResponse(200, "User login successfull!", {
        username: loginUser.username,
        email: loginUser.email,
        firstName: loginUser.firstName,
        lastName: loginUser.lastName,
        avatar: loginUser.avatar,
        userId: loginUser._id,
        refreshToken,
        accessToken
    }))
})

const logoutUser = async(req, res, next) => {

    // get user from the request
    const userId = req.user._id;    
}

export {registerUser , loginUser, logoutUser};