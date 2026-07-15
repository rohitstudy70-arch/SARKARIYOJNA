const mongoose = require('mongoose');

const SyllabusSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, trim: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  status: { type: String, default: 'PUBLISHED', enum: ['PUBLISHED', 'DRAFT'] },
  downloadLink: { type: String, default: '' },
  officialLink: { type: String, default: '' },
  seoTitle: { type: String, default: '' },
  seoDesc: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Syllabus', SyllabusSchema);
