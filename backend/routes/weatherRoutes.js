const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// Route to get weather for a city (public proxy)
router.get('/', weatherController.getWeather);

module.exports = router;
