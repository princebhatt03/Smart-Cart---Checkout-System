require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const connectToDb = require('./db/db');

// Connect to DB Function
connectToDb();
const app = express();
const server = http.createServer(app);

module.exports = { app, server };
