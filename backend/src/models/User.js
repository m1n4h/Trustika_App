const mongoose = require('mongoose');

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

const UserSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, index: true },
    phone: { type: String, index: true },
    name: String,
    photoUrl: String,
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

module.exports = mongoose.model('User', UserSchema);

