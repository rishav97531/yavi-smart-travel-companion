const { CohereClient } = require('cohere-ai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

/**
 * @desc    Chat with the AI Travel Assistant
 * @route   POST /api/chat
 * @access  Private
 */
exports.chatWithAI = async (req, res) => {
    const { message, history, userPreferences } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message is required.' });
    }

    try {
        let personalContext = '';
        if (userPreferences) {
            const { destinationsType, budgetType, travelStyle, foodPreference } = userPreferences;
            personalContext = `
USER PERSONALIZATION CONTEXT:
- Destination Preference: ${destinationsType || 'Flexible'}
- Budget Level: ${budgetType || 'Moderate'}
- Travel Style: ${travelStyle || 'Curious Explorer'}
- Food Preference: ${foodPreference || 'No specific preference'}
Use this context to tailor your suggestions specifically to the user's style.
`;
        }

        const systemPrompt = `
You are Yavi, an intelligent AI Travel Assistant for the "Smart Travel Companion" app.
Your goal is to help users plan trips easily and quickly.

${personalContext}

You ONLY answer travel-related questions. Help users with:
- Flight and hotel recommendations
- Visa requirements for any country
- Best time to visit destinations
- Packing lists and weather tips
- Local culture, food, and safety advice
- Budget planning for trips
- Airport and transit guidance

If someone asks something NOT travel-related, politely say:
"I'm Yavi, your travel companion! I can only help with travel-related questions. Ask me about destinations, flights, hotels, visas, or packing tips!"

Always be warm, concise, and end with one travel tip.
Use emojis occasionally to feel friendly.
`;

        const chatHistory = (history || []).map(msg => ({
            role: msg.role === 'assistant' ? 'CHATBOT' : 'USER',
            message: msg.content
        }));


        const response = await cohere.chat({
            model: "command-r-plus",
            message,
            chatHistory,
            preamble: systemPrompt,
            temperature: 0.7,
        });

        const reply = response.text;

        res.status(200).json({ reply });
    } catch (err) {
        console.error('Cohere Chat Error:', err);
        const status = err.status || 500;
        const message = status === 401 ? 'Invalid Cohere API Key.' : 'AI Assistant is temporarily unavailable.';
        res.status(status).json({ message, error: err.message });
    }
};
