const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, default: '' },
  status: { type: String, default: 'PUBLISHED', enum: ['PUBLISHED', 'DRAFT'] }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);
