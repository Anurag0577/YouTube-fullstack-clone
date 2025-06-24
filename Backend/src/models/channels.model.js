import mongoose from "mongoose";

const channelsSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true,
        unique: true,
        maxLength: 15,
        minLength: 15
    },
    owner: Object,
    description: String,
    avatar: String,
    banner: String,
    subscriberCount: Number,
    totalViews: Number,
    createdAt: Date,
    updatedAt: Date,
    isVarified: Boolean,
    socialLinks: Object,
    channelStats: Object
})