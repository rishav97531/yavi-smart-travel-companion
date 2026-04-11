import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { useBookingFlow } from '../context/BookingFlowContext';
import { createRazorpayOrderApi } from '../services/bookingApi';
import { saveTrip } from '../utils/bookingStorage';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function randomBookingId() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `YV-${n}`;
}

export default function PaymentStep() {
  const {
    selectedFlight,
    selectedSeats,
    passengers,
    insurance,
    baseFare,
    seatsFee,
    taxesAndFees,
    insuranceFee,
    grandTotal,
    departDate,
    setBookingId,
    setStepIndex,
    from,
    to,
  } = useBookingFlow();

  const [paying, setPaying] = useState(false);

  const finalize = useCallback(
    (id) => {
      setBookingId(id);
      confetti({ particleCount: 140, spread: 70, origin: { y: 0.35 } });
      const trip = {
        bookingId: id,
        route: `${from?.iata || selectedFlight?.departure?.iataCode} → ${to?.iata || selectedFlight?.arrival?.iataCode}`,
        airline: selectedFlight?.airlineDisplay || selectedFlight?.airlineName,
        flightNumber: selectedFlight?.flightNumber,
        departureAt: selectedFlight?.departure?.at,
        seats: selectedSeats,
        passengers: passengers.map((p) => p.fullName),
        totalINR: grandTotal,
        createdAt: new Date().toISOString(),
      };
      saveTrip(trip);
      setStepIndex(5);
    },
    [
      from?.iata,
      grandTotal,
      passengers,
      selectedFlight,
      selectedSeats,
      setBookingId,
      setStepIndex,
      to?.iata,
    ]
  );

  const pay = async () => {
    setPaying(true);
    try {
      const ok = await loadRazorpayScript();
      if (!ok) {
        toast.error('Could not load Razorpay');
        setPaying(false);
        return;
      }

      const amountPaise = Math.round(grandTotal * 100);
      let order;
      try {
        order = await createRazorpayOrderApi({
          amountPaise,
          receipt: `yv_${Date.now()}`,
        });
      } catch (e) {
        console.warn(e);
        toast('Razorpay not configured — completing demo payment', { icon: '✨' });
        finalize(randomBookingId());
        setPaying(false);
        return;
      }

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Yavi Travel',
        description: 'Flight booking',
        order_id: order.id,
        handler() {
          finalize(randomBookingId());
          setPaying(false);
        },
        prefill: {
          name: passengers[0]?.fullName || 'Traveler',
          email: passengers[0]?.email || 'demo@yavi.travel',
          contact: passengers[0]?.phone || '9999999999',
        },
        theme: { color: '#534AB7' },
        modal: {
          ondismiss() {
            setPaying(false);
          },
        },
      };

      const rz = new window.Razorpay(options);
      rz.on('payment.failed', () => {
        toast.error('Payment failed');
        setPaying(false);
      });
      rz.open();
    } catch (err) {
      console.error(err);
      toast.error('Payment could not start');
      setPaying(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        <h3 className="text-xl font-bold text-slate-900">Secure checkout</h3>
        <p className="mt-1 text-sm text-slate-500">Razorpay test mode · use card 4111 1111 1111 1111</p>
        <ul className="mt-6 space-y-3 text-sm text-slate-600">
          <li className="flex justify-between">
            <span>Flight</span>
            <span className="font-semibold text-slate-900">
              {selectedFlight?.airlineDisplay} {selectedFlight?.flightNumber}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Route</span>
            <span className="font-semibold text-slate-900">
              {from?.iata || selectedFlight?.departure?.iataCode} → {to?.iata || selectedFlight?.arrival?.iataCode}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Date</span>
            <span className="font-semibold text-slate-900">{departDate}</span>
          </li>
          <li className="flex justify-between">
            <span>Seats</span>
            <span className="font-semibold text-slate-900">{selectedSeats.join(', ')}</span>
          </li>
          <li className="flex justify-between">
            <span>Travelers</span>
            <span className="font-semibold text-slate-900">{passengers.map((p) => p.fullName).join(', ')}</span>
          </li>
        </ul>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          disabled={paying}
          onClick={pay}
          className="mt-8 w-full rounded-2xl bg-[#1D9E75] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#1D9E75]/25 disabled:opacity-50"
        >
          {paying ? 'Opening Razorpay…' : `Pay ₹${grandTotal.toLocaleString('en-IN')}`}
        </motion.button>
      </div>

      <div className="h-fit rounded-3xl border border-slate-100 bg-[#F8F7FF] p-6 shadow-inner">
        <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">Price breakdown</h4>
        <div className="mt-4 space-y-3 text-sm">
          <Row label="Base fare" value={baseFare} />
          <Row label="Seats" value={seatsFee} />
          <Row label="Taxes & fees" value={taxesAndFees} />
          {insurance ? <Row label="Insurance" value={insuranceFee} /> : null}
          <div className="my-3 border-t border-slate-200" />
          <div className="flex items-center justify-between text-lg font-black text-slate-900">
            <span>Total</span>
            <span>₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between font-semibold text-slate-700">
      <span>{label}</span>
      <span>₹{Math.round(value || 0).toLocaleString('en-IN')}</span>
    </div>
  );
}
