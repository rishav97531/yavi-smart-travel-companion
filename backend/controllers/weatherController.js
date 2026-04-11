const axios = require('axios');

exports.getWeather = async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ message: 'City is required.' });
    }

    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) {
            return res.status(503).json({ message: 'OpenWeather API key is not configured (OPENWEATHER_API_KEY).' });
        }
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        
        const weatherData = {
            city: response.data.name,
            temp: response.data.main.temp,
            description: response.data.weather[0].description,
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed,
            icon: response.data.weather[0].icon
        };

        res.status(200).json(weatherData);
    } catch (err) {
        console.error('Weather API Error:', err.message);
        res.status(500).json({ message: 'Failed to fetch weather data.', error: err.message });
    }
};
