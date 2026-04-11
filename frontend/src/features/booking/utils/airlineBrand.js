const AIRLINE_META = {
  AI: { name: 'Air India', logo: 'https://images.kiwi.com/airlines/64/AI.png' },
  '6E': { name: 'IndiGo', logo: 'https://images.kiwi.com/airlines/64/6E.png' },
  UK: { name: 'Vistara', logo: 'https://images.kiwi.com/airlines/64/UK.png' },
  SG: { name: 'SpiceJet', logo: 'https://images.kiwi.com/airlines/64/SG.png' },
  G8: { name: 'Go First', logo: 'https://images.kiwi.com/airlines/64/G8.png' },
  IX: { name: 'Air India Express', logo: 'https://images.kiwi.com/airlines/64/IX.png' },
};

export const getAirlineMeta = (code, fallbackName) => {
  const c = (code || '').toUpperCase();
  const meta = AIRLINE_META[c];
  return {
    name: meta?.name || fallbackName || c || 'Airline',
    logo: meta?.logo || null,
  };
};
