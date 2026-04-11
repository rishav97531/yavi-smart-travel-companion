import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBookingFlow } from '../context/BookingFlowContext';

const ROWS = 8;
const LEFT = ['A', 'B', 'C'];
const RIGHT = ['D', 'E', 'F'];

function hashSeatOccupied(flightId, seatId) {
  let h = 0;
  const s = `${flightId}:${seatId}`;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 4 === 0;
}

export default function SeatSelectionStep() {
  const { selectedFlight, selectedSeats, setSelectedSeats, passengerCount, setStepIndex } = useBookingFlow();

  const seats = useMemo(() => {
    const fid = selectedFlight?.id || 'mock';
    const list = [];
    for (let r = 1; r <= ROWS; r += 1) {
      const premiumRow = r <= 2;
      [...LEFT, ...RIGHT].forEach((col) => {
        const id = `${r}${col}`;
        const occupied = hashSeatOccupied(fid, id);
        list.push({ id, row: r, col, premium: premiumRow, occupied });
      });
    }
    return list;
  }, [selectedFlight?.id]);

  const toggle = (seat) => {
    if (seat.occupied) return;
    setSelectedSeats((prev) => {
      const exists = prev.includes(seat.id);
      if (exists) return prev.filter((s) => s !== seat.id);
      if (prev.length >= passengerCount) return prev;
      return [...prev, seat.id];
    });
  };

  const canContinue = selectedSeats.length === passengerCount;

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Pick your seats</h3>
          <p className="text-sm text-slate-500">
            Select {passengerCount} seat{passengerCount > 1 ? 's' : ''} · Premium rows highlighted in gold
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-semibold">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            <span className="h-3 w-3 rounded-sm border border-slate-300 bg-white" />
            Available
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#534AB7]/10 px-3 py-1 text-[#534AB7]">
            <span className="h-3 w-3 rounded-sm bg-[#534AB7]" />
            Selected
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-3 py-1 text-slate-600">
            <span className="h-3 w-3 rounded-sm bg-slate-400" />
            Occupied
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-amber-900">
            <span className="h-3 w-3 rounded-sm bg-amber-400" />
            Premium
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl overflow-x-auto rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6">
        <div className="mb-6 rounded-full bg-slate-200 py-2 text-center text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
          Cockpit
        </div>
        <div className="mx-auto flex w-max flex-col gap-2">
          {Array.from({ length: ROWS }, (_, i) => i + 1).map((row) => (
            <div key={row} className="flex items-center gap-3">
              <span className="w-6 text-right text-xs font-bold text-slate-400">{row}</span>
              <div className="flex items-center gap-2">
                {LEFT.map((col) => {
                  const seat = seats.find((s) => s.id === `${row}${col}`);
                  return (
                    <SeatButton key={seat.id} seat={seat} active={selectedSeats.includes(seat.id)} onToggle={() => toggle(seat)} />
                  );
                })}
              </div>
              <div className="w-8 text-center text-[10px] font-bold text-slate-300">||</div>
              <div className="flex items-center gap-2">
                {RIGHT.map((col) => {
                  const seat = seats.find((s) => s.id === `${row}${col}`);
                  return (
                    <SeatButton key={seat.id} seat={seat} active={selectedSeats.includes(seat.id)} onToggle={() => toggle(seat)} />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-700">
          Selected:{' '}
          <span className="text-[#534AB7]">{selectedSeats.length ? selectedSeats.join(', ') : 'None yet'}</span>
        </p>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          disabled={!canContinue}
          onClick={() => setStepIndex(3)}
          className="rounded-2xl bg-[#534AB7] px-8 py-3 text-sm font-bold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue to travelers
        </motion.button>
      </div>
    </div>
  );
}

function SeatButton({ seat, active, onToggle }) {
  const premium = seat.premium && !seat.occupied;
  const occupied = seat.occupied;
  const title = occupied ? 'Occupied' : premium ? 'Premium seat' : 'Available';

  return (
    <motion.button
      type="button"
      title={title}
      whileHover={{ scale: occupied ? 1 : 1.06 }}
      whileTap={{ scale: occupied ? 1 : 0.95 }}
      onClick={onToggle}
      disabled={occupied}
      className={`relative h-10 w-10 rounded-xl text-xs font-black transition ${
        occupied
          ? 'cursor-not-allowed bg-slate-300 text-slate-500 line-through'
          : active
            ? 'bg-[#534AB7] text-white shadow-lg shadow-[#534AB7]/30'
            : premium
              ? 'border-2 border-amber-400 bg-amber-50 text-amber-900'
              : 'border border-slate-200 bg-white text-slate-800 hover:border-[#534AB7]'
      }`}
    >
      {seat.id}
    </motion.button>
  );
}
