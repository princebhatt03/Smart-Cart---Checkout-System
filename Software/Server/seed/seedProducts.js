require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/product.model');
const products = require('../../Client/products.json');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const seedProducts = async () => {
  try {
    await connectDB();

    // Remove existing products
    await Product.deleteMany({});
    console.log('Existing products cleared');

    // Insert products from JSON
    await Product.insertMany(products);
    console.log('Products seeded successfully');

    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedProducts();
