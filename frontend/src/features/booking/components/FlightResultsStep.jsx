import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Coffee, Luggage, Armchair, ChevronDown, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useBookingFlow } from '../context/BookingFlowContext';
import { getAirlineMeta } from '../utils/airlineBrand';

function formatTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(isoDur) {
  if (!isoDur) return '—';
  const m = isoDur.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!m) return isoDur;
  const h = m[1] ? `${m[1]}h ` : '';
  const min = m[2] ? `${m[2]}m` : '';
  return `${h}${min}`.trim();
}

function StopsBadge({ stops }) {
  const label = stops === 0 ? 'Non-stop' : `${stops} stop${stops > 1 ? 's' : ''}`;
  const color =
    stops === 0 ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : stops === 1 ? 'bg-amber-50 text-amber-900 border-amber-100' : 'bg-rose-50 text-rose-800 border-rose-100';
  return <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${color}`}>{label}</span>;
}

export default function FlightResultsStep() {
  const {
    flights,
    flightsMeta,
    expandedFlightId,
    setExpandedFlightId,
    setSelectedFlight,
    setStepIndex,
    from,
    to,
  } = useBookingFlow();

  const [sort, setSort] = useState('best');
  const [maxPrice, setMaxPrice] = useState(200000);
  const [stopFilter, setStopFilter] = useState('any');
  const [airlineFilter, setAirlineFilter] = useState('ALL');

  const airlines = useMemo(() => {
    const set = new Set(flights.map((f) => f.airlineCode || f.airlineName));
    return ['ALL', ...Array.from(set)];
  }, [flights]);

  const yaviPickId = useMemo(() => {
    if (!flights.length) return null;
    const scored = flights.map((f, i) => {
      const durationScore = (f.stops || 0) * 40 + (f.priceTotal || 0) / 200;
      return { f, score: durationScore, i };
    });
    scored.sort((a, b) => a.score - b.score);
    return scored[0]?.f?.id;
  }, [flights]);

  const processed = useMemo(() => {
    let list = [...flights];
    list = list.filter((f) => (f.priceTotal || 0) <= maxPrice);
    if (stopFilter === '0') list = list.filter((f) => (f.stops || 0) === 0);
    if (stopFilter === '1') list = list.filter((f) => (f.stops || 0) === 1);
    if (stopFilter === '2+') list = list.filter((f) => (f.stops || 0) >= 2);
    if (airlineFilter !== 'ALL') list = list.filter((f) => (f.airlineCode || f.airlineName) === airlineFilter);

    if (sort === 'cheapest') list.sort((a, b) => (a.priceTotal || 0) - (b.priceTotal || 0));
    else if (sort === 'fastest') list.sort((a, b) => (a.stops || 0) - (b.stops || 0) || (a.priceTotal || 0) - (b.priceTotal || 0));
    else
      list.sort(
        (a, b) =>
          (a.stops || 0) - (b.stops || 0) + ((a.priceTotal || 0) - (b.priceTotal || 0)) / 4000
      );

    return list;
  }, [flights, maxPrice, stopFilter, airlineFilter, sort]);

  const maxFare = useMemo(() => Math.max(8000, ...flights.map((f) => f.priceTotal || 0), 1), [flights]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Choose your flight</h3>
            <p className="text-sm text-slate-500">
              {from?.iata || 'Origin'} → {to?.iata || 'Destination'}
              {flightsMeta.warning && <span className="ml-2 text-amber-600">({flightsMeta.warning})</span>}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['best', 'cheapest', 'fastest'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSort(s)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize ${
                  sort === s ? 'bg-[#534AB7] text-white shadow' : 'bg-white text-slate-600 ring-1 ring-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {!processed.length && (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              No flights match your filters. Try widening the price range or airline filter.
            </div>
          )}
          <AnimatePresence>
            {processed.map((f, index) => {
              const meta = getAirlineMeta(f.airlineCode, f.airlineName);
              const expanded = expandedFlightId === f.id;
              const isPick = f.id === yaviPickId;
              return (
                <motion.div
                  key={f.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFlightId(expanded ? null : f.id)}
                    className="flex w-full flex-col gap-4 p-5 text-left md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-100">
                        {meta.logo ? (
                          <img src={meta.logo} alt="" className="h-full w-full object-contain p-1" loading="lazy" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-lg font-black text-[#534AB7]">
                            {meta.name.slice(0, 1)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-bold text-slate-900">{meta.name}</p>
                          {isPick && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#1D9E75]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1D9E75]">
                              <Sparkles className="h-3 w-3" />
                              Yavi Pick
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-500">{f.flightNumber}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-800">
                          <span>{formatTime(f.departure?.at)}</span>
                          <span className="text-slate-300">→</span>
                          <span>{formatTime(f.arrival?.at)}</span>
                          <span className="text-xs font-medium text-slate-400">{formatDuration(f.duration)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-end">
                      <div className="hidden flex-col items-center px-4 md:flex">
                        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#534AB7]/20 via-[#534AB7] to-[#534AB7]/20" />
                        <StopsBadge stops={f.stops} />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-slate-900">₹{Math.round(f.priceTotal || 0).toLocaleString('en-IN')}</p>
                        {f.seatsLeft <= 4 && (
                          <p className="text-xs font-bold text-[#E24B4A]">Only {f.seatsLeft} seats left!</p>
                        )}
                        <div className="mt-2 flex justify-end md:hidden">
                          <StopsBadge stops={f.stops} />
                        </div>
                        <div className="mt-2 flex justify-end gap-2 text-slate-400">
                          <Wifi className="h-4 w-4" title="Wi‑Fi" />
                          <Coffee className="h-4 w-4" />
                          <Luggage className="h-4 w-4" />
                          <Armchair className="h-4 w-4" />
                        </div>
                      </div>
                      <ChevronDown className={`hidden h-5 w-5 text-slate-400 transition md:block ${expanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-100 bg-[#F8F7FF]/80 px-5 py-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm text-slate-600">
                            {f.departure?.iataCode} terminal {f.departure?.terminal || '—'} · Cabin {f.cabin}
                          </p>
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              setSelectedFlight({ ...f, airlineDisplay: meta.name, airlineLogo: meta.logo });
                              setStepIndex(2);
                            }}
                            className="rounded-2xl bg-[#534AB7] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-[#534AB7]/25"
                          >
                            Select flight
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <aside className="h-fit rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 font-bold text-slate-900">
          <SlidersHorizontal className="h-4 w-4 text-[#534AB7]" />
          Filters
        </div>
        <label className="text-xs font-semibold text-slate-500">Max price (₹{maxPrice.toLocaleString('en-IN')})</label>
        <input
          type="range"
          min={3000}
          max={Math.max(maxFare, 8000)}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="mt-2 w-full accent-[#534AB7]"
        />
        <label className="mt-4 block text-xs font-semibold text-slate-500">Stops</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            { id: 'any', label: 'Any' },
            { id: '0', label: 'Non-stop' },
            { id: '1', label: '1 stop' },
            { id: '2+', label: '2+' },
          ].map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setStopFilter(o.id)}
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                stopFilter === o.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <label className="mt-4 block text-xs font-semibold text-slate-500">Airline</label>
        <select
          value={airlineFilter}
          onChange={(e) => setAirlineFilter(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold"
        >
          {airlines.map((a) => (
            <option key={a} value={a}>
              {a === 'ALL' ? 'All airlines' : a}
            </option>
          ))}
        </select>
      </aside>
    </div>
  );
}
