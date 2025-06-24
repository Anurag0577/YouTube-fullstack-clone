import mongoose from "mongoose";

const videosSchema = new mongoose({
    title: String,
    description: String,
    videoUrl: String,
    thumbnailUrl: String,
    duration: Number,
    views: Number,
    likes: Number,
    dislikes: Number,
    channel: Object,
    owner: Object,
    tags: [{
        type: String
    }],
    category: String,
    isPublished: Boolean,
    publishedAt: Date,
    videoQualilty: Object,
    comments: Objecct,
    engagement: Objecct
})

const videos = mongoose.model('videos', videosSchema);

export default videos;