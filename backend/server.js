require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const connectDB = require('./config/db');

const path = require('path');

// Initialize app
const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(compression());
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1y',
  etag: true
}));

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/admin', require('./routes/admin'));
app.use('/api/v1/admin/upload', require('./routes/upload'));
app.use('/api/v1/public', require('./routes/public'));

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error. Please check server logs.' });
});

// Port configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
