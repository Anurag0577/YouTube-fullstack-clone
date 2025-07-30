import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  channelName: { // same as usernamer default, but you can change it.
    type: String,
    required: [true, 'Channel name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Channel name must be at least 3 characters'],
    maxlength: [50, 'Channel name cannot exceed 50 characters']
  },
  owner: { // userId
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Channel owner is required']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },
  avatar: {
    type: String,
    default: null
  },
  cover: {
    // we have to make a image uploader for this cover image
    type: String,
    default: null
  },
  subscriberCount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalViews: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

const channel = mongoose.model('channel', channelSchema)
export default channel;