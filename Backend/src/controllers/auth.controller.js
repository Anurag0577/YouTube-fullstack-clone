import asyncHandler from '../utiles/asyncHandler.js'
import user from '../models/user.model.js'
import apiError from '../utiles/apiError.js';
import apiResponse from '../utiles/apiResponse.js'
import { isCloudinaryConfigured } from '../utiles/cloudinary.js'
import jwt, { decode } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { response } from 'express';
dotenv.config();

// Generate Access and Refresh Tokens
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const userFound = await user.findById(userId);
        
        if (!userFound) {
            throw new apiError(404, "User not found");
        }
        
        console.log('REFRESH_TOKEN_SECRET exists:', !!process.env.REFRESH_TOKEN_SECRET);
        console.log('ACCESS_TOKEN_SECRET exists:', !!process.env.ACCESS_TOKEN_SECRET);
        
        const refreshToken = userFound.genRefreshToken();
        const accessToken = userFound.genAccessToken();
        console.log('Refresh Token Generated => ', refreshToken)
        console.log('Access Token Generated =>', accessToken)
        
        // Test token validation
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            console.log('Generated refresh token is valid, decoded:', decoded);
        } catch (verifyError) {
            console.error('Generated refresh token validation failed:', verifyError);
        }
        
        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Token generation error:', error);
        throw new apiError(500, "Something went wrong while generating tokens");
    }
};

// REGISTER USER
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
    const updatedUser = await user.findByIdAndUpdate(newUser._id, {refreshToken}, {new: true}).select('+refreshToken');
    console.log('Refresh token saved in db successfully!')
    console.log('Updated user refresh token:', updatedUser?.refreshToken);

    // ✅ FIXED: Use res.cookie() instead of req.cookies()
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // now you can not get refresh token through javascript in the client side.
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax", // Adjust based on environment
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/' // Ensure cookie is available for all routes
    });
    console.log('Refresh token cookie set:', refreshToken);
    

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
    const updatedUser = await user.findByIdAndUpdate(loginUser._id, {refreshToken}, {new: true}).select('+refreshToken');
    console.log('Refresh token saved in db successfully!')
    console.log('Updated user refresh token:', updatedUser?.refreshToken);

    // ✅ FIXED: Use res.cookie() instead of req.cookies()
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/' // Ensure cookie is available for all routes
    });
    console.log('Login: Refresh token cookie set:', refreshToken);

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
    try {
        // Get refresh token from cookies to identify user
        const refreshToken = req.cookies.refreshToken;
        
        if (refreshToken) {
            try {
                // Verify refresh token to get user ID
                const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                
                // Remove refresh token from database
                await user.findByIdAndUpdate(decoded._id, {
                    $set: {
                        refreshToken: null
                    }
                });
                
                console.log('User logged out, refresh token removed from database');
            } catch (error) {
                console.log('Invalid refresh token during logout, but continuing with cookie clearing');
            }
        }

        // ✅ Clear the cookie on logout (always do this)
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax",
            path: '/'
        });

        // Send response
        res.status(200).json(new apiResponse(200, "User logged out successfully", {}));
    } catch (error) {
        console.error('Logout error:', error);
        // Even if there's an error, clear the cookie and send success response
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax",
            path: '/'
        });
        
        res.status(200).json(new apiResponse(200, "User logged out successfully", {}));
    }
});

const regenerateAccessToken = asyncHandler(async(req, res) => {
    try {
        // Get refresh token from cookies
        const refreshToken = req.cookies.refreshToken;
        console.log('I am in the regenerateAccessToken, here is the refreshToken', refreshToken )
        console.log('All cookies:', req.cookies);
        console.log('REFRESH_TOKEN_SECRET exists:', !!process.env.REFRESH_TOKEN_SECRET);
        
        if (!refreshToken) {
            throw new apiError(401, "Refresh token required!");
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        console.log("decoded variable value", decoded)
        
        // ✅ FIXED: Use 'user' instead of 'findById'
        const userDetail = await user.findById(decoded._id).select('+refreshToken');
        console.log('User found:', !!userDetail);
        console.log('User refresh token from DB:', userDetail?.refreshToken);
        console.log('Token comparison:', userDetail?.refreshToken === refreshToken);
        
        if (!userDetail) {
            throw new apiError(404, "User not found!");
        }

        // Verify refresh token matches the one in database
        if (userDetail.refreshToken !== refreshToken) {
            console.log('Token mismatch - DB token:', userDetail.refreshToken);
            console.log('Cookie token:', refreshToken);
            throw new apiError(401, "Invalid refresh token!");
        }

        // Create access token payload (only include necessary data)
        const payload = {
            _id: userDetail._id,
            email: userDetail.email,
            username: userDetail.username,
            firstName: userDetail.firstName
        };

        // Generate new access token
        const newAccessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m'
            }
        );

        res.status(200).json(
            new apiResponse(200, "Access token generated successfully!", {
                accessToken: newAccessToken
            })
        );

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new apiError(401, "Refresh token expired!");
        } else if (error.name === "JsonWebTokenError") {
            throw new apiError(401, "Invalid refresh token!");
        } else if (error instanceof apiError) {
            throw error;
        } else {
            throw new apiError(500, "Token generation failed!");
        }
    }
});

// Test endpoint to check environment variables
const testEnvironment = asyncHandler(async(req, res) => {
    const envCheck = {
        REFRESH_TOKEN_SECRET: !!process.env.REFRESH_TOKEN_SECRET,
        ACCESS_TOKEN_SECRET: !!process.env.ACCESS_TOKEN_SECRET,
        REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
        ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
        NODE_ENV: process.env.NODE_ENV
    };
    
    console.log('Environment check:', envCheck);
    res.status(200).json(new apiResponse(200, "Environment check", envCheck));
});

export { registerUser, loginUser, logoutUser, regenerateAccessToken, testEnvironment };