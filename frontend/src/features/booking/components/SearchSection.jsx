import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Hotel, CarFront, Users, Sparkles, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ParallaxHero from './ParallaxHero';
import { useBookingFlow } from '../context/BookingFlowContext';
import { fetchPlaceSuggestions } from '../services/geoapify';
import { searchFlightsApi, searchHotelsApi } from '../services/bookingApi';
import { fetchCabRouteSummary } from '../services/geoapify';
import { CABINS } from '../constants';
import { saveLastFlightSearch } from '../utils/bookingStorage';
import debounce from 'lodash.debounce';

function CityField({ label, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const run = debounce(async (text) => {
      const s = await fetchPlaceSuggestions(text);
      setSuggestions(s);
    }, 220);
    run(q);
    return () => run.cancel();
  }, [q]);

  useEffect(() => {
    if (value?.label) setQ(value.label);
  }, [value?.label]);

  return (
    <div className="relative text-left">
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      <input
        value={open ? q : value?.label || q || ''}
        onFocus={() => {
          setOpen(true);
          setQ(value?.label || '');
        }}
        onBlur={() => setTimeout(() => setOpen(false), 160)}
        onChange={(e) => {
          setQ(e.target.value);
          onChange(null);
          setOpen(true);
        }}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20"
      />
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute z-30 mt-2 max-h-56 w-full overflow-auto rounded-2xl border border-slate-100 bg-white py-2 shadow-xl"
          >
            {suggestions.map((s) => (
              <li key={`${s.label}-${s.iata || s.source}`}>
                <button
                  type="button"
                  className="flex w-full flex-col px-4 py-2.5 text-left text-sm hover:bg-[#F8F7FF]"
                  onClick={() => {
                    onChange(s);
                    setOpen(false);
                  }}
                >
                  <span className="font-semibold text-slate-900">{s.label}</span>
                  {s.iata && <span className="text-xs text-[#1D9E75]">IATA: {s.iata}</span>}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SearchSection() {
  const {
    searchTab,
    setSearchTab,
    tripType,
    setTripType,
    from,
    setFrom,
    to,
    setTo,
    departDate,
    setDepartDate,
    returnDate,
    setReturnDate,
    passengerCount,
    setPassengerCount,
    cabinClass,
    setCabinClass,
    setFlights,
    setFlightsMeta,
    setStepIndex,
    hotelCity,
    setHotelCity,
    setHotels,
    cabFrom,
    setCabFrom,
    cabTo,
    setCabTo,
    setCabEstimate,
    setSearchingFlights,
  } = useBookingFlow();

  const [loading, setLoading] = useState(false);
  const [inlineHotelsLoading, setInlineHotelsLoading] = useState(false);
  const [inlineCabLoading, setInlineCabLoading] = useState(false);

  const yaviTip = useMemo(() => {
    const a = from?.iata || from?.city || 'Origin';
    const b = to?.iata || to?.city || 'Destination';
    return `Yavi suggests: fares on ${a} → ${b} are often ~15% lower Tue–Thu mornings.`;
  }, [from, to]);

  const runFlightSearch = async () => {
    if (!from?.iata || !to?.iata || !departDate) {
      toast.error('Pick cities with airport codes (or choose from the suggested list).');
      return;
    }
    setLoading(true);
    setSearchingFlights(true);
    await new Promise((r) => setTimeout(r, 1500));
    try {
      const data = await searchFlightsApi({
        origin: from.iata,
        destination: to.iata,
        date: departDate,
        adults: passengerCount,
        travelClass: cabinClass,
      });
      setFlights(data.flights || []);
      setFlightsMeta({ source: data.source, warning: data.warning });
      saveLastFlightSearch({
        from,
        to,
        departDate,
        returnDate,
        tripType,
        passengerCount,
        cabinClass,
      });
      setStepIndex(1);
    } catch (e) {
      console.error(e);
      setFlights([]);
      setFlightsMeta({ source: 'error', warning: e.message });
    } finally {
      setLoading(false);
      setSearchingFlights(false);
    }
  };

  const runHotelSearch = async () => {
    setInlineHotelsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    try {
      const data = await searchHotelsApi({
        city: hotelCity,
        checkin: departDate || undefined,
        checkout: returnDate || undefined,
        adults: passengerCount,
      });
      setHotels(data.hotels || []);
    } catch {
      setHotels([]);
    } finally {
      setInlineHotelsLoading(false);
    }
  };

  const runCabSearch = async () => {
    if (!cabFrom.trim() || !cabTo.trim()) return;
    setInlineCabLoading(true);
    try {
      const est = await fetchCabRouteSummary(cabFrom, cabTo);
      setCabEstimate(est);
    } finally {
      setInlineCabLoading(false);
    }
  };

  const tabs = [
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'cabs', label: 'Cabs', icon: CarFront },
  ];

  return (
    <ParallaxHero>
      <div className="p-6 md:p-10">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#534AB7]">Book with Yavi</p>
            <h2 className="mt-2 font-heading text-3xl font-extrabold text-slate-900 md:text-4xl">Go anywhere, beautifully.</h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600">Search live fares, lock seats, pay securely, and keep every trip in My Trips.</p>
          </div>
          <div className="flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = searchTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSearchTab(t.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    active ? 'bg-white text-[#534AB7] shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {searchTab === 'flights' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-3">
              <CityField label="From" value={from} onChange={setFrom} placeholder="City or airport" />
            </div>
            <div className="lg:col-span-3">
              <CityField label="To" value={to} onChange={setTo} placeholder="City or airport" />
            </div>
            <div className="lg:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Depart</label>
              <input
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium shadow-sm outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20"
              />
            </div>
            <div className="lg:col-span-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Trip</span>
                <button
                  type="button"
                  onClick={() => setTripType(tripType === 'round' ? 'oneway' : 'round')}
                  className="text-xs font-bold text-[#534AB7] hover:underline"
                >
                  {tripType === 'round' ? 'Round trip' : 'One way'}
                </button>
              </div>
              {tripType === 'round' ? (
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium shadow-sm outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20"
                />
              ) : (
                <div className="flex h-[46px] items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 text-xs text-slate-500">
                  Add return for more options
                </div>
              )}
            </div>
            <div className="lg:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Passengers</label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <Users className="h-4 w-4 text-[#534AB7]" />
                <input
                  type="number"
                  min={1}
                  max={9}
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-transparent text-sm font-semibold outline-none"
                />
              </div>
            </div>
            <div className="md:col-span-2 lg:col-span-4">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Cabin</label>
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm outline-none focus:border-[#534AB7]"
              >
                {CABINS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end lg:col-span-4">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                onClick={runFlightSearch}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#534AB7] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#534AB7]/30 transition hover:bg-[#43389a] disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                Search flights
              </motion.button>
            </div>
          </motion.div>
        )}

        {searchTab === 'hotels' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-1">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">City / Area</label>
              <input
                value={hotelCity}
                onChange={(e) => setHotelCity(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm outline-none focus:border-[#534AB7]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Check-in</label>
              <input
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm outline-none focus:border-[#534AB7]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Check-out</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm outline-none focus:border-[#534AB7]"
              />
            </div>
            <div className="md:col-span-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={runHotelSearch}
                disabled={inlineHotelsLoading}
                className="rounded-2xl bg-[#1D9E75] px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-[#178763] disabled:opacity-60"
              >
                {inlineHotelsLoading ? 'Searching…' : 'Search hotels'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {searchTab === 'cabs' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Pickup</label>
              <input
                value={cabFrom}
                onChange={(e) => setCabFrom(e.target.value)}
                placeholder="Airport / hotel / area"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm outline-none focus:border-[#534AB7]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Drop</label>
              <input
                value={cabTo}
                onChange={(e) => setCabTo(e.target.value)}
                placeholder="Destination"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm outline-none focus:border-[#534AB7]"
              />
            </div>
            <div className="flex items-end">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={runCabSearch}
                disabled={inlineCabLoading}
                className="w-full rounded-2xl bg-[#EF9F27] px-6 py-3 text-sm font-bold text-slate-900 shadow-md hover:brightness-95 disabled:opacity-60"
              >
                {inlineCabLoading ? 'Estimating…' : 'Estimate ride'}
              </motion.button>
            </div>
          </motion.div>
        )}

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-violet-100 bg-[#F8F7FF] p-4">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#534AB7]" />
          <p className="text-sm font-medium leading-relaxed text-slate-700">{yaviTip}</p>
        </div>
      </div>
    </ParallaxHero>
  );
}
