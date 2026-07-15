const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'ADMIN'
  }
}, { timestamps: true });

module.exports = mongoose.model('AdminUser', AdminUserSchema);
