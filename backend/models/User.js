const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firebaseUID: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    phoneNumber: {
        type: String,
        default: ''
    },
    preferences: {
        type: [String],
        default: []
    },
    destinationsType: {
        type: String,
        enum: ['India', 'International', 'Both', ''],
        default: ''
    },
    budgetType: {
        type: String,
        enum: ['Low', 'Medium', 'Luxury', ''],
        default: ''
    },
    travelStyle: {
        type: String,
        enum: ['Adventure', 'Relaxation', 'Cultural', 'Family', ''],
        default: ''
    },
    foodPreference: {
        type: String,
        enum: ['Veg', 'Non-Veg', 'Both', ''],
        default: ''
    },
    favoriteDestinations: {
        type: [String],
        default: []
    },
    travelHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip'
    }],
    achievements: [{
        badgeName: String,
        earnedDate: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
