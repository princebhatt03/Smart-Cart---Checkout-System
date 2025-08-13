require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');

// Connect to DB
connectToDb();

const app = express();
const server = http.createServer(app);

// Allow multiple origins (local, production, preview)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  /\.netlify\.app$/,
];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // No origin → requests like Postman
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.some(o =>
          o instanceof RegExp ? o.test(origin) : o === origin
        )
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Routes
app.use('/api', userRoutes);

module.exports = { app, server };
