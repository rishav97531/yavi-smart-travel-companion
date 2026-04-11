const Trip = require('../models/Trip');
const User = require('../models/User');

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
exports.createTrip = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUID: req.user.uid });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const { destination, startDate, endDate, budgetLimit, itinerary } = req.body;

        const trip = await Trip.create({
            userId: user._id,
            destination,
            startDate,
            endDate,
            budgetLimit,
            itinerary
        });

        // Add trip to user's travel history
        user.travelHistory.push(trip._id);
        await user.save();

        res.status(201).json(trip);
    } catch (error) {
        console.error('Create Trip Error:', error);
        res.status(500).json({ message: 'Server error creating trip.' });
    }
};

// @desc    Get all trips for logged in user
// @route   GET /api/trips
// @access  Private
exports.getTrips = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUID: req.user.uid });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const trips = await Trip.find({ userId: user._id }).sort({ startDate: -1 });
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching trips.' });
    }
};

// @desc    Get single trip by ID
// @route   GET /api/trips/:id
// @access  Private
exports.getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found.' });
        
        // Ensure user owns this trip
        const user = await User.findOne({ firebaseUID: req.user.uid });
        if (trip.userId.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized.' });
        }

        res.status(200).json(trip);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
exports.updateTrip = async (req, res) => {
    try {
        let trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found.' });

        const user = await User.findOne({ firebaseUID: req.user.uid });
        if (trip.userId.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized.' });
        }

        trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(trip);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating trip.' });
    }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
exports.deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found.' });

        const user = await User.findOne({ firebaseUID: req.user.uid });
        if (trip.userId.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized.' });
        }

        await trip.deleteOne();
        
        // Remove from user history
        user.travelHistory = user.travelHistory.filter(id => id.toString() !== req.params.id);
        await user.save();

        res.status(200).json({ message: 'Trip removed.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting trip.' });
    }
};
