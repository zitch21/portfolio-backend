// routes/post.routes.js
const express = require('express');
const multer = require('multer');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });
const router = express.Router();

// ── GET /api/posts (Public: View all posts) ──
router.get('/', async (req, res) => {
  try {
    // .populate() replaces the author's ID with their actual name and profile pic!
    const posts = await Post.find().populate('author', 'name profilePic').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/posts/:id (Public: View a single post) ──
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name profilePic');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/posts (Protected: Create a post) ──
router.post('/', protect, memberOrAdmin, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const coverImage = req.file ? req.file.path : ''; // Get the full URL if an image was uploaded

    const post = await Post.create({ 
      title, 
      content, 
      category,
      coverImage, 
      author: req.user._id // The protect middleware gives us this!
    });
    
    await post.populate('author', 'name profilePic');
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/posts/:id (Protected: Edit a post) ──
router.put('/:id', protect, memberOrAdmin, upload.single('coverImage'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Security Check: Is this user the author, OR are they an admin?
    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'You can only edit your own posts' });

    if (req.body.title) post.title = req.body.title;
    if (req.body.content) post.content = req.body.content;
    if (req.body.category) post.category = req.body.category;
    if (req.file) post.coverImage = req.file.path;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/posts/:id (Protected: Delete a post) ──
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'You can only delete your own posts' });

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/posts/:id/like (Protected: Toggle Like) ──
// Notice we use `protect` so only logged-in users can like posts
router.put('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check if this user's ID is already inside the likes array
    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      // UNLIKE: Filter the user's ID out of the array
      post.likes = post.likes.filter((userId) => userId.toString() !== req.user._id.toString());
    } else {
      // LIKE: Push the user's ID into the array
      post.likes.push(req.user._id);
    }

    await post.save();
    
    // We send back the updated likes array so the frontend can update the heart icon!
    res.json(post.likes); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;