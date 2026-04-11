import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarClock, MapPin, Timer } from 'lucide-react';
import { partitionTrips } from '../features/booking/utils/bookingStorage';

function Countdown({ iso }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const t = new Date(iso).getTime() - now;
  if (Number.isNaN(t) || t <= 0) return <span className="text-xs font-bold text-slate-500">Past trip</span>;
  const d = Math.floor(t / 86400000);
  const h = Math.floor((t % 86400000) / 3600000);
  const m = Math.floor((t % 3600000) / 60000);
  const s = Math.floor((t % 60000) / 1000);
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#534AB7]/10 px-3 py-1 text-xs font-black text-[#534AB7]">
      <Timer className="h-3.5 w-3.5" />
      {d}d {h}h {m}m {s}s
    </span>
  );
}

export default function MyTrips() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const onStorage = () => setTick((x) => x + 1);
    const onFocus = () => setTick((x) => x + 1);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const { upcoming, past } = useMemo(() => {
    void tick;
    return partitionTrips();
  }, [tick]);

  return (
    <div className="mx-auto max-w-5xl rounded-[2rem] bg-[#F8F7FF] px-4 py-10 text-slate-900 shadow-inner ring-1 ring-violet-100 sm:px-8">
      <Link
        to="/booking"
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#534AB7] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to booking
      </Link>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#534AB7]">My Trips</p>
        <h1 className="mt-2 font-heading text-3xl font-black md:text-4xl">Your journey timeline</h1>
        <p className="mt-2 text-sm text-slate-600">Saved locally on this device — upcoming trips show a live countdown.</p>
      </div>

      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
          <CalendarClock className="h-5 w-5 text-[#1D9E75]" />
          Upcoming
        </h2>
        {!upcoming.length && <p className="text-sm text-slate-500">No upcoming trips yet. Complete a booking to see it here.</p>}
        <div className="space-y-4">
          {upcoming.map((trip, i) => (
            <motion.div
              key={trip.bookingId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">{trip.bookingId}</p>
                  <p className="mt-1 flex items-center gap-2 text-lg font-black text-slate-900">
                    <MapPin className="h-4 w-4 text-[#534AB7]" />
                    {trip.route}
                  </p>
                  <p className="text-sm text-slate-500">
                    {trip.airline} · {trip.flightNumber} · Seats {trip.seats?.join(', ')}
                  </p>
                </div>
                <Countdown iso={trip.departureAt || trip.createdAt} />
              </div>
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-xs font-bold uppercase text-slate-400">Timeline</p>
                <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#1D9E75]" />
                    Booked · {new Date(trip.createdAt).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#534AB7]" />
                    Departure · {trip.departureAt ? new Date(trip.departureAt).toLocaleString() : 'TBD'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-slate-900">Past trips</h2>
        {!past.length && <p className="text-sm text-slate-500">No past trips stored on this device.</p>}
        <div className="grid gap-3 md:grid-cols-2">
          {past.map((trip) => (
            <div key={trip.bookingId} className="rounded-2xl border border-slate-100 bg-white/80 p-4 text-sm text-slate-600">
              <p className="font-bold text-slate-900">{trip.bookingId}</p>
              <p className="mt-1">{trip.route}</p>
              <p className="text-xs text-slate-400">{new Date(trip.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
