import asyncHandler from '../utiles/asyncHandler.js'
import user from '../models/user.model.js'
import apiError from '../utiles/apiError.js';
import apiResponse from '../utiles/apiResponse.js'
import { isCloudinaryConfigured } from '../utiles/cloudinary.js'

// Generate Access and Refresh Tokens
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const userFound = await user.findById(userId);
        
        if (!userFound) {
            throw new apiError(404, "User not found");
        }
        const refreshToken = userFound.genRefreshToken();
        const accessToken = userFound.genAccessToken();
        

        // // Save refresh token to database
        // userFound.refreshToken = refreshToken;
        // await userFound.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new apiError(500, "Something went wrong while generating tokens");
    }
};

const registerUser = asyncHandler(async(req, res, next) => {
    // get the details from the frontend
    const {username, password, email, firstName, lastName} = req.body;

    // Check all the required / necessary fields
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
            avatarUrl = req.file.path;
        } else {
            avatarUrl = `/uploads/images/${req.file.filename}`;
        }
        console.log("Avatar URL set to:", avatarUrl);
    }

    // Create new user
    const newUser = new user({
        username, 
        password, 
        email, 
        firstName, 
        lastName: lastName || null, 
        avatar: avatarUrl
    });
    
    await newUser.save();
    console.log("User saved successfully:", newUser._id);

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(newUser._id);
    console.log("accessToken and refreshToken generated successfully!");

    // store the refresh token in the db
    const updatedUser = await user.findByIdAndUpdate(newUser._id, {refreshToken})
    console.log('Refresh token saved in db successfully!')

    // store the refresh token in http-only cookie
    res.cookies('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    })
    // send the accessToken as a res.

    const userResponse = {
        userId: newUser._id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        avatar: newUser.avatar,
        accessToken
    };

    // Send response
    console.log("Sending success response");
    return res.status(201).json(new apiResponse(201, "User registered successfully", {
        user: userResponse,
        accessToken,
        refreshToken
    }));
})

const loginUser = asyncHandler(async(req, res, next) => {
    const {email, password} = req.body;

    // Validate input
    if(!email || !password){
        throw new apiError(400, "Email and password both required for login!")
    }

    // Find user with password
    const loginUser = await user.findOne({email}).select("+password");
    if(!loginUser){
        throw new apiError(401, "Invalid login credentials!")
    }

    // Check password
    const isCorrect = await loginUser.isPasswordCorrect(password);
    if(!isCorrect){
        throw new apiError(401, "Invalid login credentials!")
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(loginUser._id);
    console.log("accessToken and refreshToken generated successfully!");

    // store the refresh token in the db
    const updatedUser = await user.findByIdAndUpdate(newUser._id, {refreshToken})
    console.log('Refresh token saved in db successfully!')

    // store the refresh token in http-only cookie
    res.cookies('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    })

    // Prepare response data
    const responseData = {
        userId: loginUser._id,
        username: loginUser.username,
        email: loginUser.email,
        firstName: loginUser.firstName,
        lastName: loginUser.lastName,
        avatar: loginUser.avatar,
        accessToken
    };

    // Send response
    res.status(200).json(new apiResponse(200, "User login successful!", responseData));
});

const logoutUser = asyncHandler(async(req, res, next) => {
    // Get user from the request (assuming you have auth middleware)
    const userId = req.user._id;
    
    // Remove refresh token from database
    await user.findByIdAndUpdate(userId, {
        $set: {
            refreshToken: null
        }
    });

    // Send response
    res.status(200).json(new apiResponse(200, "User logged out successfully", {}));
});

export { registerUser, loginUser, logoutUser };