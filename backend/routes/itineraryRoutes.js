const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');
// const { protect } = require('../middleware/authMiddleware');

// Route to generate AI-powered itinerary
router.post('/generate', itineraryController.generateItinerary);

module.exports = router;
