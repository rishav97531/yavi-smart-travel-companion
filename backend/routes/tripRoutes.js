const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, tripController.createTrip)
    .get(protect, tripController.getTrips);

router.route('/:id')
    .get(protect, tripController.getTripById)
    .put(protect, tripController.updateTrip)
    .delete(protect, tripController.deleteTrip);

module.exports = router;
