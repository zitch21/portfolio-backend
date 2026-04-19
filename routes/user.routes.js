// portfolio-backend/routes/user.routes.js
const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary'); // ⬅️ NEW: Import Cloudinary
const path = require('path');
const User = require('../models/User');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

// ─── MULTER CLOUD CONFIGURATION ───
const upload = multer({ storage }); // ⬅️ NEW: Uses Cloudinary instead of your local folder

// ─── GET /api/users/search?q=name (Search Users) ───
router.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.q;
    if (!searchQuery) return res.json([]);

    const users = await User.find({ 
      name: { $regex: searchQuery, $options: 'i' } 
    }).select('-password'); 

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/users/:id (Get Public Profile & Their Posts) ───
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userPosts = await Post.find({ author: req.params.id }).sort({ createdAt: -1 });

    res.json({ user, posts: userPosts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PUT /api/users/:id/follow (Toggle Follow/Unfollow) ───
router.put('/:id/follow', protect, async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser || !currentUser) return res.status(404).json({ message: 'User not found' });

    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(currentUser._id);
    } else {
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({ message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PUT /api/users/profile-pic (Upload Image to Cloud) ───
router.put('/profile-pic', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    const user = await User.findById(req.user.id);
    
    // ─── NEW: Rate Limiting - Check if updated in last 24 hours (bypass for admins) ───
    if (user.lastProfilePicUpdate && user.role !== 'admin') {
      const lastUpdate = new Date(user.lastProfilePicUpdate);
      const now = new Date();
      const diffHours = (now - lastUpdate) / (1000 * 60 * 60);
      if (diffHours < 24) {
        return res.status(429).json({ message: 'You can only change your profile picture once a day.' });
      }
    }

    // ⬅️ CHANGED: Cloudinary returns a full URL in req.file.path, not just a filename
    user.profilePic = req.file.path;
    user.lastProfilePicUpdate = new Date(); // ─── NEW: Update the timestamp ───
    await user.save();

    res.json({ message: 'Profile picture updated!', profilePic: user.profilePic });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;