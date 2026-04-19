// portfolio-backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Authenticate with your .env credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configure the storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ejpb_portfolio', // This will create a folder in your Cloudinary account
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
    transformation: [{ width: 1000, crop: "limit" }] // Automatically shrinks massive 4K images!
  }
});

module.exports = { cloudinary, storage };