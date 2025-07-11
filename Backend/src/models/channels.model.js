import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    required: [true, 'Channel name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Channel name must be at least 3 characters'],
    maxlength: [50, 'Channel name cannot exceed 50 characters']
  },
  owner: {
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
  banner: {
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
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  socialLinks: {
    website: {
      type: String,
      default: null,
      match: [/^https?:\/\/.+/, 'Please enter a valid URL']
    },
    twitter: {
      type: String,
      default: null
    },
    instagram: {
      type: String,
      default: null
    },
    facebook: {
      type: String,
      default: null
    }
  },
  channelStats: {
    totalVideos: {
      type: Number,
      default: 0,
      min: 0
    },
    totalSubscribers: {
      type: Number,
      default: 0,
      min: 0
    },
    totalViews: {
      type: Number,
      default: 0,
      min: 0
    }
  }
}, {
  timestamps: true
});

const channel = mongoose.model('channel', channelSchema)
export default channel;