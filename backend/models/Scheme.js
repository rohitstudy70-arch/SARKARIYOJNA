const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true
  },
  hindiName: {
    type: String,
    default: ''
  },
  shortDesc: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  eligibility: {
    type: String,
    default: ''
  },
  benefits: {
    type: String,
    default: ''
  },
  documents: {
    type: String,
    default: ''
  },
  officialLinks: {
    type: String,
    default: ''
  },
  applicationProcess: {
    type: String,
    default: ''
  },
  images: {
    type: String, // Store JSON array of image URLs
    default: '[]'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    default: null
  },
  status: {
    type: String,
    default: 'PUBLISHED',
    enum: ['PUBLISHED', 'DRAFT']
  },
  seoTitle: {
    type: String,
    default: ''
  },
  seoDesc: {
    type: String,
    default: ''
  },
  keywords: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  },
  popular: {
    type: Boolean,
    default: false
  },
  priorityOrder: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Scheme', SchemeSchema);
