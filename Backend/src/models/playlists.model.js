import mongoose from "mongoose";

const playlistsSchema = new mongoose.Schema({
    name: String,
    description: String,
    owner: Object,
    channel: Object,
    videos: Object,
    isPublic: Boolean,
    thumbnailUrl: String,
},{
    timestamps: true
})

const playlists = mongoose.model('playlists', playlistsSchema)

export default playlists;