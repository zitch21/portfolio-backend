// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false } // Helps you track what you've replied to!
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);