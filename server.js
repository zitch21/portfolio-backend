// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Initialize the app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// ── Serve Uploaded Images ──
// This lets your React app access images via http://localhost:5000/uploads/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Attach API Routes ──
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/posts', require('./routes/post.routes'));
app.use('/api/comments', require('./routes/comment.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/contact', require('./routes/contact.routes'));
app.use('/api/users', require('./routes/user.routes')); // ⬅️ NEW: User interactions (search, follow, profile)
// Add this line in server.js around line 28
app.use('/api/ai', require('./routes/ai.routes'));
// A simple test route
app.get('/', (req, res) => {
  res.send('Portfolio API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});