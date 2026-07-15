const mongoose = require('mongoose');

const StateSchema = new mongoose.Schema({
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
  }
}, { timestamps: true });

module.exports = mongoose.model('State', StateSchema);
