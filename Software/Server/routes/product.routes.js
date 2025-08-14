const express = require('express');
const Product = require('../models/product.model');
const router = express.Router();

// 📌 Add multiple products at once (seeding)
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = req.body;
    await Product.insertMany(products);
    res.json({
      message: 'Products seeded successfully',
      count: products.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 GET products by mall name
router.get('/:mallName', async (req, res) => {
  try {
    const mallName = req.params.mallName;
    const products = await Product.find({ mallName });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
