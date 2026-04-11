const Trip = require('../models/Trip');

exports.addExpense = async (req, res) => {
    const { tripId, description, amount, category } = req.body;

    try {
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found.' });
        }

        const newExpense = { description, amount, category };
        trip.expenses.push(newExpense);
        
        await trip.save();
        res.status(201).json(trip.expenses);
    } catch (err) {
        res.status(500).json({ message: 'Failed to add expense.', error: err.message });
    }
};

exports.getExpenses = async (req, res) => {
    const { tripId } = req.params;

    try {
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found.' });
        }

        res.status(200).json(trip.expenses);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch expenses.', error: err.message });
    }
};
