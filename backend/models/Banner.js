const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  link: { type: String, default: '' },
  position: { type: String, default: 'homepage' }, // homepage, popup, announcement
  status: { type: String, default: 'PUBLISHED', enum: ['PUBLISHED', 'DRAFT'] },
  priority: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Banner', BannerSchema);
