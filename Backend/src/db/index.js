import express from 'express';
import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
import dotenv from 'dotenv';
dotenv.config();

 const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/youtube-fullstack-project`);
        console.log(`Mongoose database connected! Host: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log('Database connection failed!', error.message)
        process.exit(1); // terminate the program or process
        // This approach is not good, we should try to reconnect with db few times before exit. Since you are beginner, this is okay.
    }
 }

 export default connectDB;