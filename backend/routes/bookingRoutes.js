const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  searchFlights,
  searchHotels,
  yaviBookingAssistant,
  createRazorpayOrder,
} = require('../controllers/bookingController');

router.get('/flights', protect, searchFlights);
router.get('/hotels', protect, searchHotels);
router.post('/assistant', protect, yaviBookingAssistant);
router.post('/payment/order', protect, createRazorpayOrder);

module.exports = router;
