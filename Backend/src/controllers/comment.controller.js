import videos from "../models/videos.model.js";
import asyncHandler from "../utiles/asyncHandler.js";
import apiError from "../utiles/apiError.js"
import comment from "../models/comment.model";
import mongoose from "mongoose";

// GET /api/videos/:videoId/comments** - Takes: videoId + pagination → Returns: paginated comments list 
// *Gets comments for video player page*
const getVideoComment = asyncHandler(async(req, res) => {
    const {videoId} = req.params;
    
    const video = await videos.findById(videoId);
    if(!video){
        throw new error(400, "Video not found!")
    }

    res.send(200).json(new apiResponse(200, "Video information get successfully!", video.comments))
})

// - [ ]  **POST /api/videos/:videoId/comments** - Takes: videoId + comment text → Returns: created comment object | 
// *Adds new comment to video*
const addNewComment = asyncHandler(async(req, res) => {
    const videoId = req.params.videoId;
    const {videoComment} = req.body;
    const authorId = req.user._id;

    if(!videoId || !videoComment || !authorId){
        throw new apiError(400, "video/comment/author missing!")
    }

    const newComment = new comment({
        content: videoComment,
        author: authorId,
        video: videoId  
    });
    const savedComment = await newComment.save();
    // found the video
    const video = await videos.findById(videoId);
    if(!video){
        throw new apiError(400, "video not found.");
    }
    video.comments.push(savedComment._id)
    await videos.save();

    res.status(200).json(new apiResponse(200, "Comment successfully registered!", videoComment))

})


// - [ ]  **DELETE /api/comments/:commentId** - Takes: commentId → Returns: success message | 
// *Deletes comment*
const deleteNewComment = asyncHandler(async(req, res) => {
    const {commentId} = req.params;

    if(!commentId){
        throw new apiError(400, "comment not found!")
    }
    const comment = await comment.findByIdAndDelete(commentId);

    res.send(200).json(200, "comment deleted successfully!", comment)
})


export {
    deleteNewComment,
    addNewComment,
    getVideoComment
}