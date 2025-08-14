const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../models/transaction.model');
const Cart = require('../models/cart.model');
const User = require('../models/user.model');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(400).json({ message: 'Amount is required' });

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      payment_capture: 1,
    });
    res.json(order);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Order creation failed', error: err.message });
  }
});

// Verify payment
router.post('/verify', async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    amount,
  } = req.body;
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !userId ||
    !amount
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const transaction = new Transaction({
      orderId: razorpay_order_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      status: 'paid',
      amount,
      method: 'Razorpay',
    });
    await transaction.save();

    await Cart.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Payment successful!' });
  } catch (err) {
    console.error('Payment verification error:', err);
    res
      .status(500)
      .json({ message: 'Payment processing failed', error: err.message });
  }
});

module.exports = router;
