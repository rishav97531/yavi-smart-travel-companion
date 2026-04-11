import axios from 'axios';
import { CITY_AIRPORTS, filterCityAirports } from '../utils/cityAirports';

const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

/**
 * Returns suggestions: { label, iata?, city, lat?, lon? }
 */
export async function fetchPlaceSuggestions(text) {
  const local = filterCityAirports(text);
  const localMapped = local.map((c) => ({
    label: c.label,
    iata: c.iata,
    city: c.city,
    country: c.country,
    source: 'catalog',
  }));

  if (!apiKey || !text || text.trim().length < 2) {
    return localMapped;
  }

  try {
    const { data } = await axios.get('https://api.geoapify.com/v1/geocode/autocomplete', {
      params: {
        text,
        type: 'city',
        limit: 6,
        apiKey,
      },
    });

    const remote = (data.features || []).map((f) => {
      const p = f.properties || {};
      const city = p.city || p.name || p.county;
      const country = p.country;
      const label = city && country ? `${city}, ${country}` : p.formatted || city;
      return {
        label,
        iata: null,
        city,
        country,
        lat: p.lat,
        lon: p.lon,
        source: 'geoapify',
      };
    });

    const merged = [...localMapped];
    for (const r of remote) {
      if (!merged.some((m) => m.label.toLowerCase() === r.label.toLowerCase())) merged.push(r);
    }
    return merged.slice(0, 10);
  } catch {
    return localMapped;
  }
}

export async function fetchCabRouteSummary(fromText, toText) {
  if (!apiKey) {
    return {
      distanceKm: 12.4,
      durationMin: 28,
      source: 'mock',
    };
  }

  try {
    const geo = async (q) => {
      const { data } = await axios.get('https://api.geoapify.com/v1/geocode/search', {
        params: { text: q, limit: 1, apiKey },
      });
      const f = data.features?.[0];
      return f ? [f.properties.lon, f.properties.lat] : null;
    };

    const a = await geo(fromText);
    const b = await geo(toText);
    if (!a || !b) {
      return { distanceKm: 15, durationMin: 35, source: 'fallback' };
    }

    const { data } = await axios.get('https://api.geoapify.com/v1/routing', {
      params: {
        waypoints: `${a[1]},${a[0]}|${b[1]},${b[0]}`,
        mode: 'drive',
        apiKey,
      },
    });

    const props = data.features?.[0]?.properties;
    const distanceKm = props?.distance ? props.distance / 1000 : 14;
    const durationMin = props?.time ? Math.round(props.time / 60) : 30;
    return { distanceKm: Math.round(distanceKm * 10) / 10, durationMin, source: 'geoapify' };
  } catch {
    return { distanceKm: 14, durationMin: 32, source: 'mock' };
  }
}
