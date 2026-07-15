const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, trim: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  status: { type: String, default: 'PUBLISHED', enum: ['PUBLISHED', 'DRAFT'] },
  seoTitle: { type: String, default: '' },
  seoDesc: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogSchema);
