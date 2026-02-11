const express = require('express');
const Vendor = require('../models/Vendor');
const { trackEvent } = require('../../helpers/monitoring');
const { authenticateFirebase } = require('../middleware/authenticateFirebase'); // ADD THIS LINE

const router = express.Router();

// List vendors by type (restaurant, pharmacy, etc.) near a given location.
// Authentication is optional for now so the mobile app can work without
// Firebase auth during early integration.
router.get('/', async (req, res, next) => {
  try {
    const { type, lat, lng, featured } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (featured === 'true') filter.isFeatured = true;

    let query = Vendor.find(filter);

    if (lat && lng) {
      // Use simple geo-near search if location provided
      query = query.where('location.coordinates').near({
        center: {
          type: 'Point',
          coordinates: [Number(lng), Number(lat)],
        },
        maxDistance: 10_000, // 10km
      });
    }

    // Simple seed data (runs only when DB is empty) so the app shows
    // something on first run, inspired by the existing mock data.
    const existingCount = await Vendor.countDocuments();
    if (existingCount === 0) {
      await Vendor.insertMany([
        {
          type: 'restaurant',
          name: 'Green Garden Bistro',
          description: 'Signature Green Salad & Healthy Bowls',
          rating: 4.8,
          minOrderAmount: 5000,
          isFeatured: true,
          location: {
            type: 'Point',
            coordinates: [39.2804, -6.7924],
            address: 'Dar es Salaam, Tanzania',
          },
        },
        {
          type: 'restaurant',
          name: 'The Urban Grill',
          description: 'Premium grilled steaks and artisanal burgers',
          rating: 4.5,
          minOrderAmount: 7000,
          isFeatured: true,
          location: {
            type: 'Point',
            coordinates: [39.2805, -6.7925],
            address: 'Dar es Salaam, Tanzania',
          },
        },
        {
          type: 'restaurant',
          name: 'Sushi Zen',
          description: 'Traditional Japanese & Modern Rolls',
          rating: 4.9,
          minOrderAmount: 8000,
          isFeatured: true,
          location: {
            type: 'Point',
            coordinates: [39.2806, -6.7926],
            address: 'Dar es Salaam, Tanzania',
          },
        },
      ]);
    }

    const vendors = await query.limit(50);

    trackEvent('list_vendors', { type }, null);

    return res.json({ ok: true, vendors });
  } catch (error) {
    return next(error);
  }
});

// Get vendor details
router.get('/:id', authenticateFirebase, async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ error: true, message: 'Vendor not found' });
    }
    return res.json({ ok: true, vendor });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

