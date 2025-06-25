import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  subscriber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Subscriber is required']
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: [true, 'Channel is required']
  },
  notificationsEnabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: 'subscribedAt', updatedAt: true }
});


const subscriptions = mongoose.model('subscriptions' , subscriptionsSchema)

export default subscriptions