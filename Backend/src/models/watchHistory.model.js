import mongoose from "mongoose"

const watchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: [true, 'Video is required']
  },
  watchDuration: {
    type: Number,
    required: [true, 'Watch duration is required'],
    min: 0
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: 'watchedAt', updatedAt: false }
});


const watchHistory = mongoose.model('watchHistory', watchHistorySchema);

export default watchHistory;