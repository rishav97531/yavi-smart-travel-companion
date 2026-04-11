import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Luggage } from 'lucide-react';
import { useBookingFlow } from './context/BookingFlowContext';
import { loadLastFlightSearch } from './utils/bookingStorage';
import StepIndicator from './components/StepIndicator';
import SearchSection from './components/SearchSection';
import FlightSearchSkeleton from './components/FlightSearchSkeleton';
import FlightResultsStep from './components/FlightResultsStep';
import SeatSelectionStep from './components/SeatSelectionStep';
import PassengerFormStep from './components/PassengerFormStep';
import PaymentStep from './components/PaymentStep';
import ConfirmationStep from './components/ConfirmationStep';
import YaviAssistant from './components/YaviAssistant';

function HotelsInline() {
  const { hotels, searchTab } = useBookingFlow();
  if (searchTab !== 'hotels' || !hotels.length) return null;
  return (
    <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Hotel results</h3>
        <span className="text-xs font-semibold text-slate-500">Full checkout optimized for flights</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {hotels.map((h) => (
          <div key={h.id} className="rounded-2xl border border-slate-100 bg-[#F8F7FF] p-4">
            <p className="font-bold text-slate-900">{h.name}</p>
            <p className="text-xs text-slate-500">{h.address || 'Central location'}</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-lg font-black text-[#1D9E75]">
                ₹{Math.round(Number(h.price) || 0).toLocaleString('en-IN')}
                <span className="text-xs font-semibold text-slate-500"> / stay</span>
              </p>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#534AB7] ring-1 ring-[#534AB7]/20">
                ★ {h.reviewScore || '8.8'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CabInline() {
  const { cabEstimate, searchTab } = useBookingFlow();
  if (searchTab !== 'cabs' || !cabEstimate) return null;
  return (
    <div className="mt-8 rounded-3xl border border-amber-100 bg-amber-50/60 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">Cab estimate</h3>
      <p className="mt-2 text-sm text-slate-600">
        ~{cabEstimate.distanceKm} km · about {cabEstimate.durationMin} mins · powered by{' '}
        {cabEstimate.source === 'geoapify' ? 'Geoapify' : 'Yavi demo routing'}
      </p>
      <p className="mt-3 text-xs font-semibold text-amber-900">
        Airport transfers & hourly rentals are rolling out — save this estimate for your trip brief.
      </p>
    </div>
  );
}

function StepBody() {
  const { stepIndex, setStepIndex, searchingFlights } = useBookingFlow();

  return (
    <AnimatePresence mode="wait">
      {stepIndex === 0 && (
        <motion.div
          key="step0"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
        >
          <SearchSection />
          {searchingFlights && <FlightSearchSkeleton />}
          <HotelsInline />
          <CabInline />
        </motion.div>
      )}
      {stepIndex === 1 && (
        <motion.div
          key="step1"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
        >
          <FlightResultsStep />
        </motion.div>
      )}
      {stepIndex === 2 && (
        <motion.div key="step2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
          <SeatSelectionStep />
        </motion.div>
      )}
      {stepIndex === 3 && (
        <motion.div key="step3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
          <PassengerFormStep />
        </motion.div>
      )}
      {stepIndex === 4 && (
        <motion.div key="step4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
          <PaymentStep />
        </motion.div>
      )}
      {stepIndex === 5 && (
        <motion.div key="step5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
          <ConfirmationStep />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function BookingExperience() {
  const [searchParams] = useSearchParams();
  const resumeHydrated = useRef(false);
  const {
    stepIndex,
    setStepIndex,
    setSearchTab,
    setFrom,
    setTo,
    setDepartDate,
    setReturnDate,
    setTripType,
    setPassengerCount,
    setCabinClass,
  } = useBookingFlow();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'hotels' || tab === 'cabs' || tab === 'flights') {
      setSearchTab(tab);
    }
  }, [searchParams, setSearchTab]);

  useEffect(() => {
    if (searchParams.get('resume') !== '1' || resumeHydrated.current) return;
    const s = loadLastFlightSearch();
    if (!s) return;
    resumeHydrated.current = true;
    if (s.from) setFrom(s.from);
    if (s.to) setTo(s.to);
    if (s.departDate) setDepartDate(s.departDate);
    if (s.returnDate !== undefined) setReturnDate(s.returnDate || '');
    if (s.tripType) setTripType(s.tripType);
    if (s.passengerCount) setPassengerCount(s.passengerCount);
    if (s.cabinClass) setCabinClass(s.cabinClass);
    setSearchTab('flights');
    setStepIndex(0);
  }, [
    searchParams,
    setFrom,
    setTo,
    setDepartDate,
    setReturnDate,
    setTripType,
    setPassengerCount,
    setCabinClass,
    setSearchTab,
    setStepIndex,
  ]);

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[#F8F7FF] px-3 py-8 text-slate-900 shadow-[0_40px_120px_rgba(83,74,183,0.12)] ring-1 ring-violet-100 sm:px-6 md:px-10">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#534AB7]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-[#1D9E75]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#534AB7]">Yavi Booking</p>
            <h1 className="mt-2 font-heading text-3xl font-black text-slate-900 md:text-4xl">Smart travel, start to finish</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Live fares, seat maps, Razorpay checkout, and an AI copilot tuned to your selected flight.
            </p>
          </div>
          <Link
            to="/my-trips"
            className="inline-flex items-center justify-center gap-2 self-start rounded-2xl border border-[#534AB7]/20 bg-white px-5 py-2.5 text-sm font-bold text-[#534AB7] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Luggage className="h-4 w-4" />
            My Trips
          </Link>
        </div>

        <StepIndicator stepIndex={stepIndex} onStepClick={setStepIndex} />
        <StepBody />
      </div>

      <YaviAssistant />
    </div>
  );
}
