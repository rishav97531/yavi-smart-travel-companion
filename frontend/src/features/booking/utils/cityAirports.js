/** Common airports for autocomplete merge with Geoapify */
export const CITY_AIRPORTS = [
  { label: 'Delhi (DEL)', city: 'Delhi', iata: 'DEL', country: 'India' },
  { label: 'Mumbai (BOM)', city: 'Mumbai', iata: 'BOM', country: 'India' },
  { label: 'Bengaluru (BLR)', city: 'Bengaluru', iata: 'BLR', country: 'India' },
  { label: 'Hyderabad (HYD)', city: 'Hyderabad', iata: 'HYD', country: 'India' },
  { label: 'Chennai (MAA)', city: 'Chennai', iata: 'MAA', country: 'India' },
  { label: 'Kolkata (CCU)', city: 'Kolkata', iata: 'CCU', country: 'India' },
  { label: 'Goa (GOI)', city: 'Goa', iata: 'GOI', country: 'India' },
  { label: 'Pune (PNQ)', city: 'Pune', iata: 'PNQ', country: 'India' },
  { label: 'Kochi (COK)', city: 'Kochi', iata: 'COK', country: 'India' },
  { label: 'Ahmedabad (AMD)', city: 'Ahmedabad', iata: 'AMD', country: 'India' },
  { label: 'Jaipur (JAI)', city: 'Jaipur', iata: 'JAI', country: 'India' },
  { label: 'Dubai (DXB)', city: 'Dubai', iata: 'DXB', country: 'UAE' },
  { label: 'Singapore (SIN)', city: 'Singapore', iata: 'SIN', country: 'Singapore' },
  { label: 'London (LHR)', city: 'London', iata: 'LHR', country: 'UK' },
  { label: 'New York (JFK)', city: 'New York', iata: 'JFK', country: 'USA' },
];

export const filterCityAirports = (q) => {
  const s = (q || '').trim().toLowerCase();
  if (!s) return CITY_AIRPORTS.slice(0, 8);
  return CITY_AIRPORTS.filter(
    (c) =>
      c.label.toLowerCase().includes(s) ||
      c.iata.toLowerCase().includes(s) ||
      c.city.toLowerCase().includes(s)
  ).slice(0, 10);
};
