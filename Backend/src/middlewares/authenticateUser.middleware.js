import apiError from "../utiles/apiError";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();

const authenticateUser = (req, res, next) => {

    // get token from the header
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader){
        throw new apiError(400, "Authorization header not found!")
    }

    // extract token from the authHeader
    const token = authHeader.split(" ")[1];
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const user = jwt.verify(token, secret, data => {
        if(!data){
            throw new apiError(401, "Invalid token!")
        }
        return data;
    })
    req.user = user;
    next();
}

export default authenticateUser;