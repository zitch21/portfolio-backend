require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

connectDB().then(async () => {
  const exists = await User.findOne({ email: 'admin@portfolio.com' });
  if (exists) {
    console.log('Admin already exists.');
    process.exit();
  }
  await User.create({
    name: 'Main Admin',
    email: 'admin@portfolio.com',
    password: 'AdminPassword123',
    role: 'admin',
  });
  console.log('Admin account created!');
  process.exit();
});