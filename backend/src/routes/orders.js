const express = require('express');
const Order = require('../models/Order')
const { authenticateFirebase } = require("../middleware/authenticateFirebase");;
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const { trackEvent } = require('../../helpers/monitoring');

const router = express.Router();

// Create order.
// For now authentication is optional; if no authenticated user is found,
// orders are associated with a shared "guest" user. This keeps the mobile
// app working before full Firebase auth is wired in.
router.post('/', async (req, res, next) => {
  try {
    const { vendorId, items, deliveryAddress, schedule, paymentProvider } = req.body || {};

    if (!vendorId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: true,
        message: 'vendorId and items are required',
      });
    }

    let customer = null;
    if (req.user && req.user.uid) {
      customer =
        (await User.findOne({ firebaseUid: req.user.uid })) ||
        (await User.create({
          firebaseUid: req.user.uid,
          email: req.user.email,
          phone: req.user.phone,
          name: req.user.name,
          photoUrl: req.user.picture,
        }));
    } else {
      customer =
        (await User.findOne({ firebaseUid: 'guest-user' })) ||
        (await User.create({
          firebaseUid: 'guest-user',
          name: 'Guest User',
        }));
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: true, message: 'Vendor not found' });
    }

    // Simple totals calculation; in a full implementation, validate each item against MenuItem
    let subtotal = 0;
    const normalizedItems = items.map((item) => {
      const qty = Number(item.quantity || 1);
      const basePrice = Number(item.basePrice || 0);
      const variationPriceDelta = Number(item.variationPriceDelta || 0);
      const lineTotal = qty * (basePrice + variationPriceDelta);
      subtotal += lineTotal;
      return {
        menuItem: item.menuItemId,
        name: item.name,
        quantity: qty,
        basePrice,
        variationName: item.variationName,
        variationPriceDelta,
        notes: item.notes,
      };
    });

    const deliveryFee = 0; // placeholder for now
    const total = subtotal + deliveryFee;

    const trackingCode = `TRK-${Date.now().toString(36).toUpperCase()}`;
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

    const order = await Order.create({
      orderNumber,
      customer: customer._id,
      vendor: vendor._id,
      items: normalizedItems,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress,
      schedule: schedule ? new Date(schedule) : null,
      paymentProvider: paymentProvider || 'cash',
      trackingCode,
    });

    trackEvent(
      'create_order',
      { vendorId, total, paymentProvider: order.paymentProvider },
      req.user?.uid,
    );

    return res.status(201).json({
      ok: true,
      order,
    });
  } catch (error) {
    return next(error);
  }
});

// List my orders. If no auth, return guest orders.
router.get('/', async (req, res, next) => {
  try {
    const firebaseUid = req.user?.uid || 'guest-user';
    const customer = await User.findOne({ firebaseUid });
    if (!customer) {
      return res.json({ ok: true, orders: [] });
    }

    const orders = await Order.find({ customer: customer._id })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({ ok: true, orders });
  } catch (error) {
    return next(error);
  }
});

// Get order by id
router.get('/:id', authenticateFirebase, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: true, message: 'Order not found' });
    }
    return res.json({ ok: true, order });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

