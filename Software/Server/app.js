require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const connectToDb = require('./db/db');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.routes');

// Connect to DB
connectToDb();

const app = express();
const server = http.createServer(app);

// CORS configuration
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173'];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api/users', userRoutes);

module.exports = { app, server };
