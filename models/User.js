const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  mobileNumber: { type: String, unique: true, required: true },
  name: { type: String },
  email: { type: String, unique: true, default: null },
  deviceFingerprint: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
