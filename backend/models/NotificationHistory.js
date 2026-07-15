const mongoose = require('mongoose');

const NotificationHistorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  target: { type: String, required: true }, // e.g. All, Category, State, Topic
  status: { type: String, required: true }, // SUCCESS, FAILED
  provider: { type: String, required: true } // Firebase, OneSignal
}, { timestamps: true });

module.exports = mongoose.model('NotificationHistory', NotificationHistorySchema);
