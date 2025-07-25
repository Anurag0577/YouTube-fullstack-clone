// This module is useless for now because I did not add a feature of playlists in my YouTube Clone Project. May be I'll use it in future.

import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Playlist name is required'],
    trim: true,
    maxlength: [100, 'Playlist name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Playlist owner is required']
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: [true, 'Channel is required']
  },
  videos: [{
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    position: {
      type: Number,
      required: true
    }
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  thumbnailUrl: {
    type: String,
    default: null
  },
  totalVideos: {
    type: Number,
    default: 0,
    min: 0
  },
  totalDuration: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Update totalVideos when videos array changes
playlistSchema.pre('save', function(next) {
  this.totalVideos = this.videos.length;
  next();
});

const playlists = mongoose.model('playlists', playlistSchema)

export default playlists;