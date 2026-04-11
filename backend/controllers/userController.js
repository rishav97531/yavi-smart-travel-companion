const User = require('../models/User');

// @desc    Sync Firebase user with MongoDB
// @route   POST /api/users/sync
// @access  Private
exports.syncUser = async (req, res) => {
    try {
        const { uid, email, name, picture } = req.user;

        let user = await User.findOne({ firebaseUID: uid });

        if (!user) {
            user = await User.create({
                firebaseUID: uid,
                email: email,
                name: name || email.split('@')[0],
                profilePicture: picture || ''
            });
            return res.status(201).json(user);
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('User Sync Error:', error);
        res.status(500).json({ message: 'Server error during user sync.' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUID: req.user.uid }).populate('travelHistory');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching profile.' });
    }
};
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    try {
        const { 
            name, 
            bio, 
            phoneNumber, 
            preferences, 
            destinationsType, 
            budgetType, 
            travelStyle, 
            foodPreference,
            favoriteDestinations
        } = req.body;
        
        const user = await User.findOneAndUpdate(
            { firebaseUID: req.user.uid },
            { 
                $set: { 
                    name, 
                    bio, 
                    phoneNumber, 
                    preferences,
                    destinationsType,
                    budgetType,
                    travelStyle,
                    foodPreference,
                    favoriteDestinations
                } 
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server error updating profile.' });
    }
};
