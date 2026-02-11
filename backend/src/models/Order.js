const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: String,
    quantity: { type: Number, default: 1 },
    basePrice: { type: Number, required: true },
    variationName: String,
    variationPriceDelta: { type: Number, default: 0 },
    notes: String,
  },
  { _id: false },
);

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'preparing', 'on_the_way', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    paymentProvider: {
      type: String,
      enum: ['cash', 'stripe', 'paypal'],
      default: 'cash',
    },
    deliveryAddress: {
      line1: String,
      line2: String,
      city: String,
      region: String,
      country: String,
      postalCode: String,
      latitude: Number,
      longitude: Number,
    },
    schedule: {
      type: Date,
      default: null,
    },
    trackingCode: {
      type: String,
      index: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Order', OrderSchema);

