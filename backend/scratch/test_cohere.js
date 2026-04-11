const { CohereClient } = require('cohere-ai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

async function testChat() {
    console.log('🚀 Testing Cohere AI Chat integration...');
    console.log('Using Key:', process.env.COHERE_API_KEY ? 'Present (Verified)' : 'MISSING');

    try {
        const response = await cohere.chat({
            model: "command-r-plus",
            message: "Hello, I'm testing the Smart Travel Companion AI. Tell me one interesting fact about travel.",
            preamble: "You are a helpful travel assistant.",
            temperature: 0.7,
        });

        console.log('\n✅ Response received from Cohere:');
        console.log('-----------------------------------');
        console.log(response.text);
        console.log('-----------------------------------');
        console.log('\n✨ AI Chat interaction successful.');
    } catch (error) {
        console.error('\n❌ Cohere Error:', error);
        if (error.status === 401) {
            console.error('Hint: Your Cohere API Key might be invalid or expired.');
        }
    }
}

testChat();
