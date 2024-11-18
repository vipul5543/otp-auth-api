const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  mobileNumber: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  isUsed: { type: Boolean, default: false },
});

module.exports = mongoose.model('OTP', OTPSchema);
