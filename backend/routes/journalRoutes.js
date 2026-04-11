const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, journalController.createEntry)
    .get(protect, journalController.getEntries);

router.route('/:id')
    .get(protect, journalController.getEntryById)
    .put(protect, journalController.updateEntry)
    .delete(protect, journalController.deleteEntry);

module.exports = router;
