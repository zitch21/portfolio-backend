// portfolio-backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['member', 'admin', 'user'], default: 'member' },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
  profilePic: { type: String, default: '' },
  
  // ─── OTP Fields for Password Recovery ───
  resetPasswordOtp: { type: String },
  resetPasswordExpires: { type: Date },

  // ─── NEW: Social Features ───
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  
}, { timestamps: true });

// Pre-save hook: hash password before storing 
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return; // skip if password is unchanged
  this.password = await bcrypt.hash(this.password, 12);
});

// Method to compare passwords during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);