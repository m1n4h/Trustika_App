const mongoose = require('mongoose');

const VariationSchema = new mongoose.Schema(
  {
    name: String,
    priceDelta: { type: Number, default: 0 },
  },
  { _id: false },
);

const MenuItemSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    category: { type: String, index: true },
    name: { type: String, required: true },
    description: String,
    imageUrl: String,
    basePrice: { type: Number, required: true },
    variations: [VariationSchema],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('MenuItem', MenuItemSchema);

