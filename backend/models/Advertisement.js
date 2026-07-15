const mongoose = require('mongoose');

const AdvertisementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, default: 'banner' }, // banner, native, interstitial
  imageUrl: { type: String, default: '' },
  scriptCode: { type: String, default: '' },
  link: { type: String, default: '' },
  position: { type: String, default: 'sidebar' }, // sidebar, in_content, header
  status: { type: String, default: 'PUBLISHED', enum: ['PUBLISHED', 'DRAFT'] }
}, { timestamps: true });

module.exports = mongoose.model('Advertisement', AdvertisementSchema);
