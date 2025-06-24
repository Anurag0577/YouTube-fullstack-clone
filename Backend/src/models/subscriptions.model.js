import mongoose from "mongoose";

const subscriptionsSchema = new mongoose.Schema({
    subscriber: Objecct,
    channel: Object,
    subscribedAt: Date,
    notificationsEnabled: Boolean
})

const subscriptions = mongoose.model('subscriptions' , subscriptionsSchema)

export default subscriptions