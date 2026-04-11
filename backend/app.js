const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({ path: __dirname + '/.env' });

connectDB();

const path = require('path');
const app = express();

// Serve static files from the root directory (Landing Page)
app.use(express.static(path.join(__dirname, '../')));

const allowedOrigins = (process.env.FRONTEND_URLS || 'http://localhost:5173,http://localhost:5001,http://127.0.0.1:5173,http://127.0.0.1:5001')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request Logger for debugging
app.use((req, res, next) => {
    console.log(`🚀 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});


app.use(express.json());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/journals', require('./routes/journalRoutes'));
app.use('/api/itinerary', require('./routes/itineraryRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/budget', require('./routes/budgetRoutes'));
app.use('/api/currency', require('./routes/currencyRoutes'));
app.use('/api/places', require('./routes/placeRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/booking', require('./routes/bookingRoutes'));

app.get('/', (req, res) => {
    res.send('Smart Travel Companion API is running...');
});

module.exports = app;
