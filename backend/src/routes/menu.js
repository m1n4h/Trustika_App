const express = require('express');
const MenuItem = require('../models/MenuItem')
const { authenticateFirebase } = require("../middleware/authenticateFirebase");;

const router = express.Router();

// Get menu for a vendor
router.get('/vendor/:vendorId', async (req, res, next) => {
  try {
    const vendorId = req.params.vendorId;

    // Seed basic menu items on first access if none exist yet for this vendor.
    const existingCount = await MenuItem.countDocuments({ vendor: vendorId });
    if (existingCount === 0) {
      await MenuItem.insertMany([
        {
          vendor: vendorId,
          category: 'Starters',
          name: 'Crispy Spring Rolls',
          description: '4 pieces with sweet chili dipping sauce and fresh mint.',
          basePrice: 16000,
        },
        {
          vendor: vendorId,
          category: 'Starters',
          name: 'Truffle Parm Fries',
          description: 'Golden fries tossed in truffle oil and aged parmesan.',
          basePrice: 22000,
        },
        {
          vendor: vendorId,
          category: 'Main Course',
          name: 'Avocado Zinger Burger',
          description: 'Spicy chicken, fresh avocado, brioche bun, house sauce.',
          basePrice: 32000,
        },
      ]);
    }

    const items = await MenuItem.find({ vendor: vendorId, isAvailable: true });
    return res.json({ ok: true, items });
  } catch (error) {
    return next(error);
  }
});

// Get single menu item
router.get('/:id', async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: true, message: 'Menu item not found' });
    }
    return res.json({ ok: true, item });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

