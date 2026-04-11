import { fetchWithAuth } from '../../../utils/api';

async function parseJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.message || data.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export async function searchFlightsApi({ origin, destination, date, adults, travelClass }) {
  const qs = new URLSearchParams({
    origin,
    destination,
    date,
    adults: String(adults || 1),
    travelClass: travelClass || 'ECONOMY',
  });
  const res = await fetchWithAuth(`/api/booking/flights?${qs.toString()}`);
  return parseJson(res);
}

export async function searchHotelsApi({ city, checkin, checkout, adults }) {
  const qs = new URLSearchParams({ city: city || 'Mumbai' });
  if (checkin) qs.set('checkin', checkin);
  if (checkout) qs.set('checkout', checkout);
  if (adults) qs.set('adults', String(adults));
  const res = await fetchWithAuth(`/api/booking/hotels?${qs.toString()}`);
  return parseJson(res);
}

export async function yaviAssistantApi({ message, history, flightContext }) {
  const res = await fetchWithAuth('/api/booking/assistant', {
    method: 'POST',
    body: JSON.stringify({ message, history, flightContext }),
  });
  return parseJson(res);
}

export async function createRazorpayOrderApi({ amountPaise, receipt }) {
  const res = await fetchWithAuth('/api/booking/payment/order', {
    method: 'POST',
    body: JSON.stringify({ amountPaise, receipt }),
  });
  return parseJson(res);
}
