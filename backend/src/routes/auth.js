const express = require('express');
const User = require('../models/User');
const { authenticateFirebase } = require('../middleware/authenticateFirebase');
const config = require('../../helpers/config');

const router = express.Router();

// Attach Firebase-authenticated user and ensure we have a corresponding Mongo user.
router.post('/me', authenticateFirebase, async (req, res, next) => {
  try {
    const { uid, email, phone, name, picture } = req.user;

    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        phone,
        name,
        photoUrl: picture,
      });
    }

    return res.json({
      ok: true,
      user,
    });
  } catch (error) {
    return next(error);
  }
});

// Simple admin login using configured credentials (for admin dashboard)
router.post('/admin/login', async (req, res) => {
  try {
    // Accept either userName or email field
    const { userName, email, password } = req.body || {};
    
    // Use email if provided, otherwise use userName
    const loginEmail = email || userName;
    
    console.log('Admin login attempt:', { loginEmail, password });
    console.log('Expected admin:', { 
      email: config.adminUserName, 
      password: config.adminPassword 
    });

    if (
      loginEmail === config.adminUserName &&
      password === config.adminPassword
    ) {
      // Find or create admin user
      let admin = await User.findOne({ email: config.adminUserName });
      
      if (!admin) {
        admin = new User({
          email: config.adminUserName,
          name: config.adminName || 'Trustika Admin',
          role: 'admin',
          firebaseUid: 'admin-' + Date.now(),
          isActive: true
        });
        await admin.save();
      }
      
      return res.json({
        ok: true,
        success: true,
        admin: {
          id: admin._id || config.adminUserId,
          name: admin.name || config.adminName,
          email: admin.email || config.adminUserName,
          role: 'admin'
        },
        token: 'admin-token-' + Date.now()
      });
    }

    return res.status(401).json({ 
      error: true, 
      success: false,
      message: 'Invalid admin credentials' 
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ 
      error: true, 
      success: false,
      message: 'Server error during login' 
    });
  }
});

module.exports = router;
