const axios = require('axios');

// @desc    Get places using MapTiler Geocoding and Geoapify
// @route   GET /api/places/:place
// @access  Private
exports.getPlaces = async (req, res) => {
    try {
        const { place } = req.params;
        const mtApiKey = process.env.MAPTILER_API_KEY;
        const geoApiKey = process.env.GEOAPIFY_API_KEY;

        if (!mtApiKey || !geoApiKey) {
            return res.status(500).json({ message: 'Mapping API keys are missing.' });
        }

        // 1. Get coordinates using MapTiler Geocoding
        const mtUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(place)}.json?key=${mtApiKey}&limit=1`;
        const mtResponse = await axios.get(mtUrl);

        if (!mtResponse.data.features || mtResponse.data.features.length === 0) {
            return res.status(404).json({ message: 'Destination not found.' });
        }

        const [lon, lat] = mtResponse.data.features[0].center;

        // 2. Get attractions using Geoapify
        const geoUrl = `https://api.geoapify.com/v2/places?categories=tourism.attraction&filter=circle:${lon},${lat},10000&limit=12&apiKey=${geoApiKey}`;
        const geoResponse = await axios.get(geoUrl);

        const places = geoResponse.data.features.map(f => ({
            id: f.properties.place_id,
            name: f.properties.name || f.properties.street || 'Point of Interest',
            address: f.properties.formatted,
            rating: null, // OSM doesn't have Google ratings
            location: {
                lat: f.properties.lat,
                lng: f.properties.lon
            },
            types: f.properties.categories
        }));

        res.status(200).json(places);
    } catch (error) {
        console.error('Place Discovery Error:', error.message);
        res.status(500).json({ message: 'Server error fetching places.' });
    }
};

// @desc    Get Wikipedia summary for a place
// @route   GET /api/places/wiki/:place
// @access  Private
exports.getWikiSummary = async (req, res) => {
    try {
        const { place } = req.params;
        // Try searching for the exact term first
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(place)}`;
        const response = await axios.get(url).catch(err => {
            if (err.response && err.response.status === 404) return null;
            throw err;
        });

        if (!response || !response.data || response.data.type === 'disambiguation') {
            return res.status(200).json({
                title: place,
                extract: `Explore the vibrant city of ${place}. We found no specific Wikipedia summary, but it's a popular destination for travelers looking for local attractions and cultural experiences.`,
                description: 'Travel Destination',
                thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800',
                contentUrls: `https://en.wikipedia.org/wiki/${encodeURIComponent(place)}`
            });
        }

        res.status(200).json({
            title: response.data.title || place,
            extract: response.data.extract || '',
            description: response.data.description || 'Travel Destination',
            thumbnail: response.data.thumbnail ? response.data.thumbnail.source : null,
            contentUrls: response.data.content_urls ? response.data.content_urls.desktop.page : `https://en.wikipedia.org/wiki/${encodeURIComponent(place)}`
        });
    } catch (error) {
        console.error('Wiki Error:', error.message);
        res.status(200).json({
            title: req.params.place,
            extract: "An error occurred while fetching destination details. You can still explore attractions below.",
            description: 'Destination'
        });
    }
};

// @desc    Get current weather for a place
// @route   GET /api/places/weather/:city
// @access  Private
exports.getWeather = async (req, res) => {
    try {
        const { city } = req.params;
        const apiKey = process.env.OPENWEATHER_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ message: 'OpenWeather API key is missing.' });
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
        const response = await axios.get(url);

        res.status(200).json({
            temp: Math.round(response.data.main.temp),
            condition: response.data.weather[0].main,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon,
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed
        });
    } catch (error) {
        console.error('Weather Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch weather data.' });
    }
};

// @desc    Get nearby places from Geoapify
// @route   GET /api/places/nearby
// @access  Private
exports.getNearbyPlaces = async (req, res) => {
    try {
        const { lat, lon, categories } = req.query;
        const apiKey = process.env.GEOAPIFY_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ message: 'Geoapify API key is missing.' });
        }

        const url = `https://api.geoapify.com/v2/places?categories=${categories || 'tourism.attraction,accommodation.hotel,catering.restaurant'}&filter=circle:${lon},${lat},5000&limit=10&apiKey=${apiKey}`;
        const response = await axios.get(url);

        const places = response.data.features.map(f => ({
            id: f.properties.place_id,
            name: f.properties.name || f.properties.street || 'Unknown Place',
            category: f.properties.categories[0],
            address: f.properties.formatted,
            lat: f.properties.lat,
            lon: f.properties.lon,
            distance: f.properties.distance
        }));

        res.status(200).json(places);
    } catch (error) {
        console.error('Geoapify Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch nearby places.' });
    }
};

// @desc    Get high-res images from Unsplash
// @route   GET /api/places/images/:query
// @access  Private
exports.getImages = async (req, res) => {
    try {
        const { query } = req.params;
        const accessKey = process.env.UNSPLASH_ACCESS_KEY;

        if (!accessKey) {
            return res.status(500).json({ message: 'Unsplash access key is missing.' });
        }

        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=8&client_id=${accessKey}`;
        const response = await axios.get(url);

        const images = response.data.results.map(img => ({
            id: img.id,
            url: img.urls.regular,
            thumb: img.urls.small,
            alt: img.alt_description,
            user: img.user.name,
            link: img.links.html
        }));

        res.status(200).json(images);
    } catch (error) {
        console.error('Unsplash Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch images.' });
    }
};
