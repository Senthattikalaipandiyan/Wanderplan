const dns = require('node:dns');
// Forces Node to resolve MongoDB Atlas links correctly on cloud hosting platforms
dns.setServers(['8.8.8.8', '8.8.4.4']); 

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from a local .env file (ignored in production by Render)
dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────
// Uses your Render configuration online, or defaults to localhost for local coding
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:3000';

app.use(cors({ 
  origin: allowedOrigin, 
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Database Connection ──────────────────────────────────
// Imports the connection function and executes it cleanly
const connectDB = require('./config/db');
connectDB();

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
// Automatically uses Render's assigned cloud port, or 5000 locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
