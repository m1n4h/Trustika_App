const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['restaurant', 'pharmacy', 'store', 'service'],
      required: true,
    },
    name: { type: String, required: true },
    description: String,
    logoUrl: String,
    bannerUrl: String,
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    minOrderAmount: { type: Number, default: 0 },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [lng, lat]
        index: '2dsphere',
      },
      address: String,
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    openingHours: {
      // Simple representation for now
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
      sunday: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Vendor', VendorSchema);

