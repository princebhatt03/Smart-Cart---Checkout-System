const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  razorpay_payment_id: String,
  razorpay_order_id: String,
  razorpay_signature: String,
  status: String,
  method: String,
  amount: Number,
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
