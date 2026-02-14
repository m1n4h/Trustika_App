const mongoose = require('mongoose');
const { apiConfig } = require('../helpers/config'); // your mongoUri from config
const User = require('../src/models/User');      // adjust path

async function createAdmin() {
  await mongoose.connect(apiConfig.mongoUri);
  console.log('[mongo] connected');

  const existing = await User.findOne({ email: 'admin@example.com' });
  if (existing) {
    console.log('Admin already exists!');
    process.exit(0);
  }

  const admin = new User({
    firebaseUid: 'admin-uid-001',
    email: 'admin@example.com',
    password: 'trustika12@45', // will be hashed automatically
    name: 'Trustika Admin',
    role: 'admin',
  });

  await admin.save();
  console.log('Admin created with hashed password!');
  process.exit(0);
}

createAdmin();
