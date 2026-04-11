const axios = require('axios');
const { CohereClient } = require('cohere-ai');
const Razorpay = require('razorpay');
const { getMockFlights, getMockHotels } = require('./mockFlightsData');

const cohereToken = process.env.COHERE_API_KEY;
const cohere = cohereToken ? new CohereClient({ token: cohereToken }) : null;

const mapAmadeusOffer = (offer, index) => {
  const itinerary = offer.itineraries?.[0] || {};
  const segment = itinerary.segments?.[0];
  const lastSeg = itinerary.segments?.[itinerary.segments.length - 1];
  const carrier = segment?.carrierCode || 'XX';
  const price = offer.price?.grandTotal || offer.price?.total || '0';
  const currency = offer.price?.currency || 'INR';

  return {
    id: offer.id || `offer-${index}`,
    airlineCode: carrier,
    airlineName: carrier,
    flightNumber: `${carrier}${segment?.number || ''}`,
    departure: {
      iataCode: segment?.departure?.iataCode,
      at: segment?.departure?.at,
      terminal: segment?.departure?.terminal,
    },
    arrival: {
      iataCode: lastSeg?.arrival?.iataCode,
      at: lastSeg?.arrival?.at,
      terminal: lastSeg?.arrival?.terminal,
    },
    duration: itinerary.duration,
    stops: Math.max(0, (itinerary.segments?.length || 1) - 1),
    segments: itinerary.segments?.length || 1,
    priceTotal: parseFloat(price),
    currency,
    cabin: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY',
    seatsLeft: Math.min(9, 3 + (index % 4)),
    raw: offer,
  };
};

/**
 * GET /api/booking/flights?origin=DEL&destination=BOM&date=2026-05-01&adults=1&travelClass=ECONOMY
 */
exports.searchFlights = async (req, res) => {
  const { origin, destination, date, adults = 1, travelClass = 'ECONOMY' } = req.query;

  if (!origin || !destination || !date) {
    return res.status(400).json({ message: 'origin, destination, and date are required (IATA codes).' });
  }

  const clientId = process.env.AMADEUS_CLIENT_ID || process.env.AMADEUS_API_KEY;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET || process.env.AMADEUS_API_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(200).json({ source: 'mock', flights: getMockFlights(origin, destination, date) });
  }

  try {
    const tokenRes = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const accessToken = tokenRes.data.access_token;
    const offersRes = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        originLocationCode: origin.toUpperCase(),
        destinationLocationCode: destination.toUpperCase(),
        departureDate: date,
        adults: Math.min(9, parseInt(adults, 10) || 1),
        max: 15,
        currencyCode: 'INR',
        travelClass: ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'].includes(travelClass)
          ? travelClass
          : 'ECONOMY',
      },
    });

    const data = offersRes.data?.data || [];
    const flights = data.map(mapAmadeusOffer);
    return res.status(200).json({ source: 'amadeus', flights });
  } catch (err) {
    console.error('Amadeus flight search error:', err.response?.data || err.message);
    return res.status(200).json({
      source: 'mock',
      flights: getMockFlights(origin, destination, date),
      warning: 'Amadeus unavailable; showing sample results.',
    });
  }
};

/**
 * GET /api/booking/hotels?city=Bali&checkin=2026-05-01&checkout=2026-05-05&adults=2
 * Uses RapidAPI when RAPIDAPI_KEY is set; otherwise returns mock list.
 */
exports.searchHotels = async (req, res) => {
  const { city = 'Mumbai', checkin, checkout, adults = 2 } = req.query;
  const key = process.env.RAPIDAPI_KEY;
  const host = process.env.RAPIDAPI_HOTELS_HOST || 'booking-com.p.rapidapi.com';

  if (!key) {
    return res.status(200).json({
      source: 'mock',
      hotels: getMockHotels(city),
    });
  }

  try {
    const { data } = await axios.get(`https://${host}/v1/hotels/locations`, {
      params: { name: city, locale: 'en-gb' },
      headers: {
        'X-RapidAPI-Key': key,
        'X-RapidAPI-Host': host,
      },
    });

    const destId = Array.isArray(data) && data[0]?.dest_id;
    if (!destId) {
      return res.status(200).json({ source: 'mock', hotels: getMockHotels(city) });
    }

    const search = await axios.get(`https://${host}/v2/hotels/search`, {
      params: {
        dest_id: destId,
        dest_type: data[0].dest_type || 'city',
        checkin_date: checkin || '2026-05-01',
        checkout_date: checkout || '2026-05-03',
        adults: adults || 2,
        room_qty: 1,
        units: 'metric',
        locale: 'en-gb',
        filter_by_currency: 'INR',
        order_by: 'popularity',
      },
      headers: {
        'X-RapidAPI-Key': key,
        'X-RapidAPI-Host': host,
      },
    });

    const results = (search.data?.results || []).slice(0, 12).map((h, i) => ({
      id: h.hotel_id || `h-${i}`,
      name: h.name || h.hotel_name,
      address: h.address,
      reviewScore: h.review_score,
      price: h.price_breakdown?.gross_price || h.min_total_price || h.composite_price_breakdown?.gross_amount?.value,
      currency: h.price_breakdown?.currency || 'INR',
      photo: h.main_photo_url || h.photoUri,
    }));

    return res.status(200).json({ source: 'rapidapi', hotels: results.length ? results : getMockHotels(city) });
  } catch (err) {
    console.error('Hotel search error:', err.response?.data || err.message);
    return res.status(200).json({
      source: 'mock',
      hotels: getMockHotels(city),
      warning: 'Hotel API unavailable; sample hotels shown.',
    });
  }
};

/**
 * POST /api/booking/assistant
 * body: { message, history, flightContext }
 */
exports.yaviBookingAssistant = async (req, res) => {
  const { message, history = [], flightContext } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'message is required' });
  }

  if (!cohere) {
    return res.status(503).json({ message: 'AI assistant not configured (COHERE_API_KEY).' });
  }

  const flightBlock = flightContext
    ? `
SELECTED FLIGHT CONTEXT (use for grounded answers):
${JSON.stringify(flightContext, null, 2)}
`
    : '';

  const systemPrompt = `You are Yavi, a smart and friendly AI travel companion for the "Yavi – Smart Travel Companion" app.
You help users compare fares, understand policies, packing, visas, and airport tips.
Be concise, warm, and practical. Use bullet points when listing steps.
If you lack real-time fare data beyond the provided context, say so honestly.
${flightBlock}`;

  try {
    const chatHistory = (history || []).map((msg) => ({
      role: msg.role === 'assistant' ? 'CHATBOT' : 'USER',
      message: msg.content,
    }));

    const response = await cohere.chat({
      model: 'command-r-plus',
      message,
      chatHistory,
      preamble: systemPrompt,
      temperature: 0.65,
    });

    return res.status(200).json({ reply: response.text });
  } catch (err) {
    console.error('Yavi booking assistant error:', err);
    return res.status(500).json({ message: 'Assistant temporarily unavailable.', error: err.message });
  }
};

/**
 * POST /api/booking/payment/order
 * body: { amountPaise, receipt }
 */
exports.createRazorpayOrder = async (req, res) => {
  const { amountPaise, receipt } = req.body;
  const amount = parseInt(amountPaise, 10);

  if (!amount || amount < 100) {
    return res.status(400).json({ message: 'amountPaise must be at least 100 (INR 1.00).' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(503).json({ message: 'Razorpay is not configured on the server.' });
  }

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: receipt || `yv_${Date.now()}`,
      payment_capture: true,
    });

    return res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (err) {
    console.error('Razorpay order error:', err);
    return res.status(500).json({ message: 'Could not create payment order.', error: err.message });
  }
};
