const express = require('express');
const router = express.Router();
const { getPlaces, getWikiSummary, getWeather, getNearbyPlaces, getImages } = require('../controllers/placeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:place', protect, getPlaces);
router.get('/wiki/:place', protect, getWikiSummary);
router.get('/weather/:city', protect, getWeather);
router.get('/nearby', protect, getNearbyPlaces);
router.get('/images/:query', protect, getImages);

module.exports = router;
