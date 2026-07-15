const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  items: { type: String, required: true } // JSON array of links/items
}, { timestamps: true });

module.exports = mongoose.model('Menu', MenuSchema);
