import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Video title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [5000, 'Description cannot exceed 5000 characters'],
    default: ''
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required']
  },
  thumbnailUrl: {
    type: String,
    required: [true, 'Thumbnail URL is required']
  },
  duration: {
    type: Number,
    required: [true, 'Video duration is required'],
    min: [1, 'Duration must be at least 1 second']
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  dislikes: {
    type: Number,
    default: 0,
    min: 0
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: [true, 'Channel is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Video owner is required']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  category: {
    type: String,
    enum: [
      'Gaming', 'Music', 'Entertainment', 'News', 'Sports', 
      'Education', 'Technology', 'Comedy', 'Travel', 'Cooking',
      'Beauty', 'Fashion', 'Health', 'Fitness', 'DIY', 'Other'
    ],
    default: 'Other'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: null
  },
  videoQuality: {
    '360p': {
      type: String,
      default: null
    },
    '480p': {
      type: String,
      default: null
    },
    '720p': {
      type: String,
      default: null
    },
    '1080p': {
      type: String,
      default: null
    }
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  engagement: {
    likedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    dislikedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    savedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }
}, {
  timestamps: true
});


videoSchema.pre('save', async function(next){
  if(this.isModified(this.isPublished) && (this.isPublished) && (!this.publishedAt)){
    this.publishedAt = new Date();
  }
  next()
})

const videos = mongoose.model('videos', videoSchema);

export default videos;