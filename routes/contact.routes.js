// routes/contact.routes.js
const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// ── POST /api/contact (Public: Submit a message) ──
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await Message.create({ name, email, message });
    res.status(201).json({ success: true, message: 'Message sent securely to the admin!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;