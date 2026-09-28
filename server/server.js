const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Forces Node to resolve MongoDB Atlas links correctly


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Database Connection ──────────────────────────────────
require('./config/db');

// ─── API Routes ───────────────────────────────────────────
app.use('/api/auth',        require('./routes/authRoutes'));
app.use('/api/trips',       require('./routes/tripRoutes'));
app.use('/api/bookings',    require('./routes/bookingRoutes'));
app.use('/api/expenses',    require('./routes/expenseRoutes'));
app.use('/api/manager',     require('./routes/managerRoutes'));
app.use('/api/admin',       require('./routes/adminRoutes'));
app.use('/api/suggestions', require('./routes/suggestionRoutes'));
app.use('/api/pdf',         require('./routes/pdfRoutes'));

// ─── Health Check ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'WanderPlan API is running!', status: 'OK' });
});

// ─── Global Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
