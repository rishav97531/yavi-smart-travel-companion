const express = require('express');
const router = express.Router();
const { convertCurrency } = require('../controllers/currencyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:from/:to/:amount', protect, convertCurrency);

module.exports = router;
