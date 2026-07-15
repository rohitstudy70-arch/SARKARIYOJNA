const mongoose = require('mongoose');

const FaqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  status: { type: String, default: 'PUBLISHED', enum: ['PUBLISHED', 'DRAFT'] }
}, { timestamps: true });

module.exports = mongoose.model('Faq', FaqSchema);
