import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Download, Share2, Plane } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import { useBookingFlow } from '../context/BookingFlowContext';

export default function ConfirmationStep() {
  const {
    bookingId,
    selectedFlight,
    selectedSeats,
    passengers,
    departDate,
    resetFlow,
    from,
    to,
  } = useBookingFlow();

  const primary = passengers[0];
  const seat = selectedSeats[0] || '—';

  const downloadPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.setFillColor(83, 74, 183);
    doc.rect(0, 0, 420, 120, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Yavi Boarding Pass', 40, 60);
    doc.setFontSize(11);
    doc.text(bookingId, 40, 90);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(14);
    doc.text(`Route: ${from?.iata || selectedFlight?.departure?.iataCode} → ${to?.iata || selectedFlight?.arrival?.iataCode}`, 40, 160);
    doc.text(`Passenger: ${primary?.fullName || 'Traveler'}`, 40, 190);
    doc.text(`Seat: ${seat}`, 40, 220);
    doc.text(`Flight: ${selectedFlight?.flightNumber}`, 40, 250);
    doc.text(`Date: ${departDate}`, 40, 280);
    doc.save(`${bookingId}.pdf`);
    toast.success('PDF downloaded');
  };

  const share = async () => {
    const text = `I'm flying with Yavi! ${bookingId} · ${from?.iata}→${to?.iata} · Seat ${seat}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Yavi Trip', text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success('Copied trip summary');
      }
    } catch {
      toast.error('Share cancelled');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      className="mx-auto max-w-lg"
    >
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-[#534AB7]/15">
        <div className="relative bg-gradient-to-r from-[#534AB7] to-[#43389a] px-8 py-6 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <Plane className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">E‑ticket</p>
              <p className="text-2xl font-black">{bookingId}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-6 px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">From</p>
              <p className="text-2xl font-black text-slate-900">{from?.iata || selectedFlight?.departure?.iataCode}</p>
              <p className="text-xs text-slate-500">{from?.city || selectedFlight?.departure?.iataCode}</p>
            </div>
            <div className="text-center text-xs font-bold text-[#1D9E75]">NONSTOP</div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase text-slate-400">To</p>
              <p className="text-2xl font-black text-slate-900">{to?.iata || selectedFlight?.arrival?.iataCode}</p>
              <p className="text-xs text-slate-500">{to?.city || selectedFlight?.arrival?.iataCode}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-[#F8F7FF] p-4">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Passenger</p>
              <p className="font-semibold text-slate-900">{primary?.fullName}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Seat</p>
              <p className="font-semibold text-slate-900">{seat}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Flight</p>
              <p className="font-semibold text-slate-900">{selectedFlight?.flightNumber}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Date</p>
              <p className="font-semibold text-slate-900">{departDate}</p>
            </div>
          </div>
          <div className="flex justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-4">
            <QRCodeSVG value={bookingId} size={160} level="H" includeMargin />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={downloadPdf}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#534AB7] px-4 py-3 text-sm font-bold text-white shadow-md"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            <button
              type="button"
              onClick={share}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
          <button
            type="button"
            onClick={resetFlow}
            className="w-full rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            Book another trip
          </button>
        </div>
      </div>
    </motion.div>
  );
}
