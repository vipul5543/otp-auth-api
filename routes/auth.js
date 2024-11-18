const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const OTP = require('../models/OTP');
const sendSMS = require('../utils/sendSMS');

const router = express.Router();

// Generate and send OTP
router.post('/login', async (req, res) => {
  const { mobileNumber } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + process.env.OTP_EXPIRY_MINUTES * 60000);

  await OTP.create({ mobileNumber, otp, expiresAt });

  await sendSMS(mobileNumber, `Your OTP is: ${otp}`);
  res.status(200).json({ message: 'OTP sent successfully' });
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { mobileNumber, otp } = req.body;
  console.log('Received OTP:', otp);
    console.log('Received Mobile Number:', mobileNumber);
  const existingOTP = await OTP.findOne({ mobileNumber, otp, isUsed: false });
  if (!existingOTP || new Date() > existingOTP.expiresAt) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }
  console.log('OTP is valid, updating it as used');
  await OTP.updateOne({ _id: existingOTP._id }, { isUsed: true });

  let user = await User.findOne({ mobileNumber });
  if (!user) {
    console.log('User not found, creating a new user');
    user = await User.create({ mobileNumber, email: '' });
  }
  console.log('Generating token for user');
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.status(200).json({ token, user });
});

// Fetch current user
router.get('/user', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log(token);
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    console.log(userId);
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
