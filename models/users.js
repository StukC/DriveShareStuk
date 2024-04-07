const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  securityQuestion1: { type: String, required: true },
  securityAnswer1: { type: String, required: true },
  securityQuestion2: { type: String, required: true },
  securityAnswer2: { type: String, required: true },
  securityQuestion3: { type: String, required: true },
  securityAnswer3: { type: String, required: true },
});

userSchema.pre('save', async function(next) {
  // Hash password if it's modified or new
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  // Hash security answers
  if (this.isModified('securityAnswer1')) {
    this.securityAnswer1 = await bcrypt.hash(this.securityAnswer1, 8);
  }
  if (this.isModified('securityAnswer2')) {
    this.securityAnswer2 = await bcrypt.hash(this.securityAnswer2, 8);
  }
  if (this.isModified('securityAnswer3')) {
    this.securityAnswer3 = await bcrypt.hash(this.securityAnswer3, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
