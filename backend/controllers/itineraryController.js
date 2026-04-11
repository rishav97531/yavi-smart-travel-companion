const { CohereClient } = require('cohere-ai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

const Trip = require('../models/Trip');

exports.generateItinerary = async (req, res) => {
    const { destination, days, budget, preferences, tripId } = req.body;

    if (!destination || !days) {
        return res.status(400).json({ message: 'Destination and duration are required.' });
    }

    try {
        const prompt = `Create a detailed day-wise travel itinerary for ${days} days in ${destination}. 
        Budget level: ${budget || 'moderate'}. 
        Preferences: ${preferences || 'none'}. 
        Strictly format the output as JSON only. The JSON must be an object with an 'itinerary' key which is an array of objects. Each object has 'day' (number), 'title' (string), and 'activities' (array of strings).`;

        const response = await cohere.chat({
            model: "command-r-plus",
            message: prompt,
            preamble: "You are a travel planning expert. Your output must be strictly valid JSON.",
            responseFormat: { type: "json_object" }
        });

        // Cohere v7+ response access
        const content = response.text;
        const itineraryData = JSON.parse(content);
        
        // If tripId is provided, update the trip with the new itinerary
        if (tripId) {
            await Trip.findByIdAndUpdate(tripId, { itinerary: itineraryData.itinerary || itineraryData });
        }

        res.status(200).json(itineraryData);
    } catch (err) {
        console.error('Cohere Error:', err);
        const status = err.status || 500;
        const message = status === 401 ? 'Invalid Cohere API Key. Please check your .env file.' : 'Failed to generate itinerary.';
        res.status(status).json({ message, error: err.message });
    }
};
