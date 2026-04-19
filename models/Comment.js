// models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  
  // Link to the User who wrote the comment
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Link to the Post this comment belongs to
  post: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true 
  }
  
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);