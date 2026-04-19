// portfolio-backend/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  coverImage: { type: String, default: '' },
  category: { type: String, default: 'General' },
  
  // NEW ADDITION: An array storing the IDs of users who liked the post
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }]
  
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);