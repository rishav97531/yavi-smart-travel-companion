import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plane,
  TrainFront,
  ArrowRight,
  Ticket,
  Pencil,
  CloudSun,
  Utensils,
  Building2,
  ChevronRight,
  Sparkles,
  MapPin,
  Clock3,
} from 'lucide-react';
import QuickActionCard from '../components/Dashboard/QuickActionCard';
import YaviInsightCard from '../components/Dashboard/YaviInsightCard';
import { partitionTrips, loadLastFlightSearch, loadTrips } from '../features/booking/utils/bookingStorage';
import { fetchWithAuth } from '../utils/api';

const todayPlan = [
  {
    time: '08:30',
    title: 'Airport transfer window',
    detail: 'Leave by 07:45 for a relaxed check-in at the terminal.',
    type: 'flight',
  },
  {
    time: '13:00',
    title: 'Coastal lunch reservation',
    detail: 'Stay near your food budget — set menu options look best value today.',
    type: 'food',
  },
  {
    time: '18:45',
    title: 'Hotel check-in & keys',
    detail: 'Digital key ready in app; concierge desk open until 22:00.',
    type: 'hotel',
  },
];

const insightCopy = [
  {
    title: 'Flight prices for Mumbai are ~12% lower this week',
    body: 'Mid-week departures are trending cheaper than weekends for short hops.',
  },
  {
    title: 'Hotels near Baga Beach are filling fast',
    body: 'Book flexible rates now if you want free cancellation closer to your dates.',
  },
  {
    title: 'Currency: INR is steady against USD',
    body: 'Lock extras in rupees to avoid double conversion fees on the road.',
  },
];

function planIcon(type) {
  const cls = 'h-5 w-5 shrink-0';
  if (type === 'flight') return <Plane className={`${cls} text-[#534AB7]`} />;
  if (type === 'food') return <Utensils className={`${cls} text-[#1D9E75]`} />;
  if (type === 'hotel') return <Building2 className={`${cls} text-violet-300`} />;
  return <Clock3 className={`${cls} text-zinc-400`} />;
}

function formatCountdown(iso) {
  if (!iso) return null;
  const t = new Date(iso).getTime() - Date.now();
  if (Number.isNaN(t)) return null;
  if (t <= 0) return 'Trip underway or past';
  const days = Math.floor(t / 86400000);
  const hours = Math.floor((t % 86400000) / 3600000);
  if (days >= 1) return `${days} day${days === 1 ? '' : 's'} to go`;
  if (hours >= 1) return `${hours} hour${hours === 1 ? '' : 's'} to go`;
  return 'Less than an hour to go';
}

function pickWeatherCity(last) {
  const t = last?.to;
  if (!t) return 'Mumbai';
  if (t.city) return t.city;
  if (t.label) return t.label.split(',')[0].trim();
  if (t.iata) return t.iata;
  return 'Mumbai';
}

const Dashboard = () => {
  const [tick, setTick] = useState(0);
  const [weather, setWeather] = useState(null);
  const [weatherMeta, setWeatherMeta] = useState({ loading: true, cityLabel: 'Mumbai' });

  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 60000);
    const onFocus = () => setTick((x) => x + 1);
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const lastSearch = useMemo(() => {
    void tick;
    return loadLastFlightSearch();
  }, [tick]);

  const weatherCity = useMemo(() => pickWeatherCity(lastSearch), [lastSearch]);

  useEffect(() => {
    let cancelled = false;
    setWeatherMeta((m) => ({ ...m, loading: true, cityLabel: weatherCity }));
    (async () => {
      try {
        const res = await fetchWithAuth(`/api/places/weather/${encodeURIComponent(weatherCity)}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Weather unavailable');
        if (!cancelled) {
          setWeather(data);
          setWeatherMeta({ loading: false, cityLabel: weatherCity });
        }
      } catch {
        if (!cancelled) {
          setWeather(null);
          setWeatherMeta({ loading: false, cityLabel: weatherCity });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [weatherCity, tick]);

  const { upcoming } = useMemo(() => {
    void tick;
    return partitionTrips();
  }, [tick]);

  const activeTrip = upcoming[0] || null;
  const recentBooking = useMemo(() => {
    void tick;
    const all = loadTrips();
    return all[0] || null;
  }, [tick]);

  const countdownLabel = activeTrip ? formatCountdown(activeTrip.departureAt || activeTrip.createdAt) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col gap-10 overflow-hidden pb-8"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[22rem] bg-[radial-gradient(ellipse_at_20%_0%,rgba(83,74,183,0.35),transparent_50%),radial-gradient(ellipse_at_80%_20%,rgba(29,158,117,0.2),transparent_45%),radial-gradient(ellipse_at_50%_100%,rgba(59,130,246,0.12),transparent_55%)]" />

      {/* SECTION 1: Hero */}
      <motion.section
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
        }}
        className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#534AB7]/25 via-zinc-900/80 to-[#1D9E75]/15 p-8 shadow-[0_28px_80px_rgba(83,74,183,0.2)] backdrop-blur-xl md:p-10"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300">
              <Sparkles size={14} className="text-[#1D9E75]" />
              Control center
            </div>
            <h1 className="font-heading text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
              Your journey just got <span className="bg-gradient-to-r from-white via-violet-100 to-[#1D9E75] bg-clip-text text-transparent">brighter</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-zinc-400 md:text-lg">
              Book flights, hotels, and essentials in fewer taps. Everything here points to your next move.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-stretch xl:flex-row">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/booking"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#534AB7] px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_40px_rgba(83,74,183,0.45)] transition-shadow hover:shadow-[0_16px_48px_rgba(83,74,183,0.55)] sm:w-auto"
              >
                Start Booking
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            {lastSearch?.from && lastSearch?.to && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/booking?resume=1"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-[#1D9E75]/40 hover:bg-white/15 sm:w-auto"
                >
                  Continue Last Search
                  <span className="max-w-40 truncate text-xs font-medium text-zinc-300">
                    {lastSearch.from?.iata || lastSearch.from?.label} → {lastSearch.to?.iata || lastSearch.to?.label}
                  </span>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>

      {/* SECTION 2: Quick actions */}
      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white md:text-xl">Quick actions</h2>
            <p className="mt-1 text-sm text-zinc-500">Jump straight into what you need.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickActionCard
            to="/booking"
            title="Book Flight"
            subtitle="Search fares, seats, and pay securely"
            emoji="✈️"
            delay={0.02}
          />
          <QuickActionCard
            to="/booking?tab=hotels"
            title="Book Hotel"
            subtitle="Stays curated for your route"
            emoji="🏨"
            delay={0.06}
          />
          <QuickActionCard
            to="/explorer"
            title="Book train"
            subtitle="Scout routes, stations & nearby stops"
            icon={<TrainFront className="h-5 w-5" />}
            delay={0.1}
          />
          <QuickActionCard
            to="/currency"
            title="Currency Converter"
            subtitle="Live rates for your wallet"
            emoji="💱"
            delay={0.14}
          />
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col gap-10">
          {/* SECTION 3: Active trip */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white md:text-xl">Active trip</h2>
            {activeTrip ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/6 p-6 shadow-[0_16px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#1D9E75]">Upcoming</p>
                    <h3 className="mt-2 flex flex-wrap items-center gap-2 text-2xl font-black text-white">
                      <MapPin className="h-6 w-6 text-[#534AB7]" />
                      {activeTrip.route}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      {activeTrip.airline} · {activeTrip.flightNumber}
                    </p>
                    {countdownLabel && (
                      <p className="mt-3 inline-flex rounded-full border border-[#534AB7]/30 bg-[#534AB7]/15 px-4 py-1.5 text-sm font-bold text-violet-100">
                        {countdownLabel}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 md:flex-col">
                    <Link
                      to="/my-trips"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      <Ticket className="h-4 w-4" />
                      View Ticket
                    </Link>
                    <Link
                      to="/booking"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1D9E75] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#1D9E75]/25 transition hover:brightness-110"
                    >
                      <Pencil className="h-4 w-4" />
                      Modify Booking
                    </Link>
                  </div>
                </div>
                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Timeline</p>
                  <ul className="space-y-4">
                    {[
                      { label: 'Flight', sub: activeTrip.flightNumber || 'Confirmed', time: 'Departure' },
                      { label: 'Hotel check-in', sub: 'Add stay in booking to sync', time: 'Day 1' },
                      { label: 'Cab pickup', sub: 'Book airport transfer from Booking → Cabs', time: 'Optional' },
                    ].map((row, i) => (
                      <li key={row.label} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <span className="flex h-3 w-3 rounded-full bg-[#1D9E75] ring-4 ring-[#1D9E75]/20" />
                          {i < 2 && <span className="mt-1 w-px flex-1 min-h-8 bg-gradient-to-b from-white/20 to-transparent" />}
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase text-zinc-500">{row.time}</p>
                          <p className="font-bold text-white">{row.label}</p>
                          <p className="text-sm text-zinc-400">{row.sub}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/3 p-8 text-center backdrop-blur-sm">
                <p className="text-sm text-zinc-400">No upcoming trip yet.</p>
                <p className="mt-2 text-lg font-bold text-white">Your next adventure starts with a booking.</p>
                <Link
                  to="/booking"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#534AB7] px-6 py-3 text-sm font-bold text-white shadow-lg"
                >
                  Start Booking
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </section>

          {/* SECTION 4: Today's plan */}
          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-white md:text-xl">Today on your trip</h2>
              <span className="rounded-full border border-[#1D9E75]/25 bg-[#1D9E75]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#1D9E75]">
                Live plan
              </span>
            </div>
            <div className="space-y-3">
              {todayPlan.map((item, index) => (
                <motion.div
                  key={item.time}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + index * 0.05 }}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 flex-1 gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                      {planIcon(item.type)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#534AB7]">{item.time}</p>
                      <h4 className="font-semibold text-white">{item.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-400">{item.detail}</p>
                    </div>
                  </div>
                  <Link
                    to="/explorer"
                    className="inline-flex shrink-0 items-center gap-1 self-start rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-[#534AB7]/40 hover:text-white sm:self-center"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-10">
          {/* SECTION 5: Yavi Insights */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white md:text-xl">Yavi Insights</h2>
            <div className="space-y-3">
              {insightCopy.map((item, i) => (
                <YaviInsightCard key={item.title} title={item.title} body={item.body} delay={0.05 + i * 0.06} />
              ))}
            </div>
          </section>

          {/* Weather — OpenWeather via GET /api/places/weather/:city */}
          <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/15 via-zinc-900/40 to-[#534AB7]/10 p-5 shadow-inner backdrop-blur-xl">
            <h3 className="mb-1 flex items-center gap-2 text-base font-bold text-white">
              <CloudSun className="h-5 w-5 text-[#1D9E75]" />
              Weather snapshot
            </h3>
            <p className="mb-4 text-xs text-zinc-500">
              OpenWeather · {weatherMeta.cityLabel}
              {weatherMeta.loading ? ' · loading…' : ''}
            </p>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-4xl font-black text-white">
                  {weather != null ? `${weather.temp}°` : '—'}
                </p>
                <p className="text-sm capitalize text-zinc-400">
                  {weather?.description || (weatherMeta.loading ? 'Fetching…' : 'Add OPENWEATHER_API_KEY in backend/.env')}
                </p>
              </div>
              {weather?.icon ? (
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt=""
                  className="h-16 w-16"
                  width={64}
                  height={64}
                />
              ) : (
                <span className="text-4xl opacity-60" aria-hidden>
                  ☀️
                </span>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-3">
              <div className="rounded-xl border border-white/5 bg-white/5 py-2">
                <p className="text-zinc-500">Wind</p>
                <p className="font-bold text-white">
                  {weather != null && typeof weather.windSpeed === 'number'
                    ? `${Math.round(weather.windSpeed * 3.6)} km/h`
                    : '—'}
                </p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/5 py-2">
                <p className="text-zinc-500">Humidity</p>
                <p className="font-bold text-white">{weather?.humidity != null ? `${weather.humidity}%` : '—'}</p>
              </div>
              <div className="hidden rounded-xl border border-white/5 bg-white/5 py-2 sm:block">
                <p className="text-zinc-500">Sky</p>
                <p className="truncate px-1 font-bold text-white">{weather?.condition || '—'}</p>
              </div>
            </div>
          </section>

          {/* SECTION 6: Recent activity */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white md:text-xl">Recent activity</h2>
            {recentBooking ? (
              <div className="rounded-2xl border border-white/10 bg-white/6 p-5 backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Last booking</p>
                <p className="mt-2 text-lg font-bold text-white">{recentBooking.route}</p>
                <p className="mt-1 text-2xl font-black text-[#1D9E75]">
                  ₹{Math.round(recentBooking.totalINR || 0).toLocaleString('en-IN')}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{recentBooking.bookingId}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    to={lastSearch ? '/booking?resume=1' : '/booking'}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#534AB7] px-4 py-2.5 text-sm font-bold text-white min-w-[140px]"
                  >
                    Continue Booking
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/my-trips"
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-zinc-200 min-w-[120px] hover:bg-white/5"
                  >
                    My Trips
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/4 p-5 text-sm text-zinc-400">
                <p>No bookings on this device yet.</p>
                <Link to="/booking" className="mt-3 inline-flex items-center gap-2 font-bold text-[#1D9E75] hover:underline">
                  Start your first booking
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
