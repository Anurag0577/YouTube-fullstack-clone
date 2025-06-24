import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: String,
    author: Object,
    video: Object,
    parentComment: Object,
    like: Number,
    dislike: Number,
    replies: Object,
    createdAt: Date,
    updatedAt: Date,
    isEdited: Boolean,
    likedBy: Object,
    dislikedBy: Object
})

const comment = mongoose.model('comment', commentSchema)

export default comment;