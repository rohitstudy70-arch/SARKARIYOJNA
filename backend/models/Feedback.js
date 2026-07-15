const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: '' },
  message: { type: String, required: true },
  type: { type: String, default: 'feedback' }, // feedback, suggestion, bug
  status: { type: String, default: 'NEW' } // NEW, REVIEWED, RESOLVED
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
