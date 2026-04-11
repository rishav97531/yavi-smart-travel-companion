const KEY = 'yavi_bookings_v1';
const LAST_SEARCH_KEY = 'yavi_last_flight_search_v1';

export function saveLastFlightSearch(payload) {
  try {
    localStorage.setItem(LAST_SEARCH_KEY, JSON.stringify({ ...payload, savedAt: Date.now() }));
  } catch {
    /* ignore */
  }
}

export function loadLastFlightSearch() {
  try {
    const raw = localStorage.getItem(LAST_SEARCH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const loadTrips = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveTrip = (trip) => {
  const list = loadTrips();
  const next = [trip, ...list.filter((t) => t.bookingId !== trip.bookingId)];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
};

export const partitionTrips = () => {
  const all = loadTrips();
  const now = Date.now();
  const upcoming = all.filter((t) => new Date(t.departureAt || t.createdAt).getTime() >= now - 86400000);
  const past = all.filter((t) => new Date(t.departureAt || t.createdAt).getTime() < now - 86400000);
  return { upcoming, past, all };
};
