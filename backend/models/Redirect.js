const mongoose = require('mongoose');

const RedirectSchema = new mongoose.Schema({
  source: { type: String, required: true, unique: true },
  destination: { type: String, required: true },
  type: { type: Number, default: 301 } // 301 or 302
}, { timestamps: true });

module.exports = mongoose.model('Redirect', RedirectSchema);
