const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    budgetLimit: {
        type: Number,
        default: 0
    },
    itinerary: {
        type: Array, // Day-by-day JSON format
        default: []
    },
    expenses: [{
        description: String,
        amount: Number,
        category: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    isOffline: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Trip', tripSchema);
