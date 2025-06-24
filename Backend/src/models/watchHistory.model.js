import mongoose from "mongoose"

const watchHistorySchema = new mongoose.Schema({
    user: Object,
    video: Object,
    watchedAt: Date,
    watchDuration: Number,
    completed: Boolean
})

const watchHistory = mongoose.model('watchHistory', watchHistorySchema);

export default watchHistory;