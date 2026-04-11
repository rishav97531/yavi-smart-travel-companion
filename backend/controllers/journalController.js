const Journal = require('../models/Journal');
const User = require('../models/User');

// @desc    Create a journal entry
// @route   POST /api/journals
// @access  Private
exports.createEntry = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUID: req.user.uid });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const { tripId, title, content, photos, location, date } = req.body;

        const entry = await Journal.create({
            userId: user._id,
            tripId,
            title,
            content,
            photos,
            location,
            date
        });

        res.status(201).json(entry);
    } catch (error) {
        console.error('Create Journal Error:', error);
        res.status(500).json({ message: 'Server error creating journal entry.' });
    }
};

// @desc    Get entries for a trip or user
// @route   GET /api/journals
// @access  Private
exports.getEntries = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUID: req.user.uid });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const query = { userId: user._id };
        if (req.query.tripId) query.tripId = req.query.tripId;

        const entries = await Journal.find(query).sort({ date: -1 });
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching journal entries.' });
    }
};

// @desc    Get single journal entry
// @route   GET /api/journals/:id
// @access  Private
exports.getEntryById = async (req, res) => {
    try {
        const entry = await Journal.findById(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Entry not found.' });

        const user = await User.findOne({ firebaseUID: req.user.uid });
        if (entry.userId.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized.' });
        }

        res.status(200).json(entry);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// @desc    Update entry
// @route   PUT /api/journals/:id
// @access  Private
exports.updateEntry = async (req, res) => {
    try {
        let entry = await Journal.findById(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Entry not found.' });

        const user = await User.findOne({ firebaseUID: req.user.uid });
        if (entry.userId.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized.' });
        }

        entry = await Journal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(entry);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating entry.' });
    }
};

// @desc    Delete entry
// @route   DELETE /api/journals/:id
// @access  Private
exports.deleteEntry = async (req, res) => {
    try {
        const entry = await Journal.findById(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Entry not found.' });

        const user = await User.findOne({ firebaseUID: req.user.uid });
        if (entry.userId.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized.' });
        }

        await entry.deleteOne();
        res.status(200).json({ message: 'Entry removed.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting entry.' });
    }
};
