const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  status: { type: String, default: 'NEW' } // NEW, REPLIED
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);
