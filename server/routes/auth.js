const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Admin email whitelist - tambahkan email admin di sini
// Format: array email yang diizinkan sebagai admin
const ADMIN_EMAILS = [
  // Tambahkan email admin di sini, contoh:
  // 'admin@example.com',
  'naufalananda79@gmail.com'
  // 'superadmin@example.com'
  // Email yang mengandung kata "admin" juga otomatis jadi admin
];

// Function to check if email is admin
function isAdminEmail(email) {
  if (!email) return false;
  
  // Check if email is in whitelist
  if (ADMIN_EMAILS.some(adminEmail => email.toLowerCase() === adminEmail.toLowerCase())) {
    return true;
  }
  
  // Check if email contains "admin" (backward compatibility)
  if (email.toLowerCase().includes('admin')) {
    return true;
  }
  
  return false;
}

// Verify token and get/create user
router.post('/verify', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let user = await User.findOne({ uid });
    
    if (!user) {
      // User baru - tentukan role berdasarkan email
      const role = isAdminEmail(email) ? 'admin' : 'user';
      
      user = new User({
        uid,
        email,
        displayName,
        photoURL: photoURL || '',
        role: role
      });
      await user.save();
    } else {
      // User sudah ada - update lastLogin dan role jika berubah
      user.lastLogin = new Date();
      // Update role jika email ada di whitelist admin
      const shouldBeAdmin = isAdminEmail(email);
      if (shouldBeAdmin && user.role !== 'admin') {
        user.role = 'admin';
      }
      await user.save();
    }

    res.json({ user: { uid: user.uid, email: user.email, displayName: user.displayName, role: user.role } });
  } catch (error) {
    console.error('Auth verify error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

