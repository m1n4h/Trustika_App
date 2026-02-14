const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // <-- Needed for password hashing

// Address schema remains unchanged
const AddressSchema = new mongoose.Schema(
  {
    label: String,
    line1: String,
    line2: String,
    city: String,
    region: String,
    country: String,
    postalCode: String,
    latitude: Number,
    longitude: Number,
    isDefault: { type: Boolean, default: false },
  },
  { _id: false },
);

// User schema with password
const UserSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, index: true },
    phone: { type: String, index: true },
    password: { type: String, required: true }, 
    name: String,
    photoUrl: String,
    password: { type: String, required: true }, // <-- Add password field
    role: {
      type: String,
      enum: ['customer', 'admin', 'rider', 'vendor'],
      default: 'customer',
    },
    favoriteVendors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }],
    addresses: [AddressSchema],
  },
  { timestamps: true },
);

// --- Pre-save hook to hash password ---
UserSchema.pre('save', async function (next) {
  // Only hash password if it's new or modified
  if (!this.isModified('password')) return next();

  try {
    const hash = await bcrypt.hash(this.password, 10); // 10 salt rounds
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

// Optional method to compare passwords during login
UserSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
