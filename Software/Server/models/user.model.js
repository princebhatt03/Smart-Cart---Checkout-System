// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
