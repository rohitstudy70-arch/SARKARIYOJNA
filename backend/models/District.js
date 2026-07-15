const mongoose = require('mongoose');

const DistrictSchema = new mongoose.Schema({
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
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('District', DistrictSchema);
