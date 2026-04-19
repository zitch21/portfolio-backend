// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create the uploads/ folder automatically if it doesn't exist yet
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Tell Multer where and how to save the files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    // Create a unique filename: timestamp + random number + original extension
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// Security: Only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);
  
  if (ext && mime) return cb(null, true);
  cb(new Error('Only image files are allowed (jpg, png, gif, webp)'));
};

const upload = multer({ 
  storage, 
  fileFilter, 
  limits: { fileSize: 5 * 1024 * 1024 } // Set a maximum file size of 5MB
});

module.exports = upload;