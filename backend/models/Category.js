const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  hindiName: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'scheme'
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
