import apiError from "../utiles/apiError.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();

const authenticateUser = (req, res, next) => {
    try {
        // get token from the header
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if(!authHeader){
            throw new apiError(401, "Authorization header not found!")
        }

        // Check if authHeader starts with 'Bearer '
        if(!authHeader.startsWith('Bearer ')){
            throw new apiError(401, "Invalid authorization format. Use 'Bearer <token>'")
        }

        // extract token from the authHeader
        const token = authHeader.split(" ")[1];
        if(!token){
            throw new apiError(401, "Token not found in authorization header!")
        }

        const secret = process.env.ACCESS_TOKEN_SECRET;
        if(!secret){
            throw new apiError(500, "Access token secret not configured!")
        }

        // Verify token synchronously
        const decoded = jwt.verify(token, secret);
        console.log("Decoded JWT:", decoded);
        // Add user data to request object
        req.user = decoded;
        req.user.id = decoded._id;
        console.log("Authenticated user:", req.user._id);
        // Proceed to the next middleware or route handler
        next();
        
    } catch (error) {
        // Handle JWT specific errors
        if(error.name === 'JsonWebTokenError'){
            return next(new apiError(401, "Invalid token!"));
        }
        if(error.name === 'TokenExpiredError'){
            return next(new apiError(401, "Token expired!"));
        }
        if(error.name === 'NotBeforeError'){
            return next(new apiError(401, "Token not active yet!"));
        }
        
        // Handle custom apiError
        if(error instanceof apiError){
            return next(error);
        }
        
        // Handle any other errors
        return next(new apiError(500, "Authentication failed!"));
    }
}

export default authenticateUser;