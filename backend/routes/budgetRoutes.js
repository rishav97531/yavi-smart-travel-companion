const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

// Route to add a new expense to a trip
router.post('/add', budgetController.addExpense);

// Route to get all expenses for a trip
router.get('/:tripId', budgetController.getExpenses);

module.exports = router;
