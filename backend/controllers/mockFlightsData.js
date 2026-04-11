const AIRLINES = [
  { code: 'AI', name: 'Air India' },
  { code: '6E', name: 'IndiGo' },
  { code: 'UK', name: 'Vistara' },
  { code: 'SG', name: 'SpiceJet' },
  { code: 'G8', name: 'Go First' },
];

const addHours = (iso, hours) => {
  const d = new Date(iso);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
};

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

exports.getMockFlights = (origin, destination, date) => {
  const baseDate = date || '2026-05-01';
  const departMorning = `${baseDate}T08:30:00`;
  const templates = [
    { dur: 2.5, stops: 0, price: 6200 },
    { dur: 5.2, stops: 1, price: 5100 },
    { dur: 3.1, stops: 0, price: 7800 },
    { dur: 4.4, stops: 1, price: 5400 },
    { dur: 2.9, stops: 0, price: 9100 },
    { dur: 6.0, stops: 2, price: 4300 },
  ];

  return templates.map((t, index) => {
    const airline = AIRLINES[index % AIRLINES.length];
    const dep = addHours(departMorning, index * 1.25);
    const arr = addHours(dep, t.dur);
    const duration = `PT${Math.floor(t.dur)}H${Math.round((t.dur % 1) * 60)}M`;

    return {
      id: `mock-${origin}-${destination}-${index}`,
      airlineCode: airline.code,
      airlineName: airline.name,
      flightNumber: `${airline.code}${100 + index * 11}`,
      departure: { iataCode: origin?.toUpperCase() || 'DEL', at: dep },
      arrival: { iataCode: destination?.toUpperCase() || 'BOM', at: arr },
      duration,
      stops: t.stops,
      segments: t.stops + 1,
      priceTotal: t.price + randomInt(0, 900),
      currency: 'INR',
      cabin: 'ECONOMY',
      seatsLeft: randomInt(1, 8),
    };
  });
};

exports.getMockHotels = (city) => {
  const c = city || 'City';
  return [
    { id: 'h1', name: `${c} Grand Palace`, address: c, reviewScore: 9.1, price: 7200, currency: 'INR', photo: null },
    { id: 'h2', name: `The ${c} Atrium`, address: `${c} Central`, reviewScore: 8.7, price: 5400, currency: 'INR', photo: null },
    { id: 'h3', name: 'Harbor View Suites', address: `${c} Waterfront`, reviewScore: 8.9, price: 8900, currency: 'INR', photo: null },
    { id: 'h4', name: 'Skyline Executive', address: `${c} CBD`, reviewScore: 8.4, price: 6100, currency: 'INR', photo: null },
  ];
};
