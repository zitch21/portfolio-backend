// routes/admin.routes.js
const express = require('express');
const router = express.Router();

// 1. Import all required Models
const User = require('../models/User');
const Post = require('../models/Post');
const Message = require('../models/Message');

// 2. Import your security middlewares
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

// ─── USER MANAGEMENT ───

// GET /api/admin/users (Admin: View all users)
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    // We use .select('-password') to ensure we never send hashed passwords to the frontend!
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id/status (Admin: Deactivate or Reactivate a user)
router.put('/users/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Stop admins from accidentally deactivating themselves!
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot deactivate an admin account' });
    }

    // Toggle the status
    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();
    
    res.json({ message: `User status updated to ${user.status}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST MANAGEMENT ───

// DELETE /api/admin/posts/:id (Admin: Delete ANY post globally)
router.delete('/posts/:id', protect, adminOnly, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post successfully deleted by admin' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── CONTACT MESSAGES ───

// GET /api/admin/messages (Admin: View all contact messages)
router.get('/messages', protect, adminOnly, async (req, res) => {
  try {
    // Sort by newest first
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/messages/:id (Admin: Delete a specific message)
router.delete('/messages/:id', protect, adminOnly, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;