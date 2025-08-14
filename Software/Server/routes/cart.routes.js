const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model');

// Add product to cart
router.post('/add', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId)
      return res.status(400).json({ message: 'UserId and ProductId required' });

    let cart = await Cart.findOne({ userId });

    if (cart) {
      const item = cart.products.find(
        p => p.productId.toString() === productId
      );
      if (item) {
        item.quantity += 1;
      } else {
        cart.products.push({ productId, quantity: 1 });
      }
      await cart.save();
    } else {
      cart = new Cart({ userId, products: [{ productId, quantity: 1 }] });
      await cart.save();
    }

    await cart.populate('products.productId');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user cart
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate(
      'products.productId'
    );
    res.json(cart || { products: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove product from cart
router.post('/remove', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId)
      return res.status(400).json({ message: 'UserId and ProductId required' });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = cart.products.filter(
      p => p.productId.toString() !== productId
    );
    await cart.save();

    await cart.populate('products.productId');
    res.json({ products: cart.products });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to remove product from cart',
      error: err.message,
    });
  }
});

// Clear cart
// Clear cart
router.post('/clear', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID required' });

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // Auto-create an empty cart for user
      cart = new Cart({ userId, products: [] });
      await cart.save();
    } else {
      cart.products = [];
      await cart.save();
    }

    res.json({ products: [] });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to clear cart', error: err.message });
  }
});

module.exports = router;
