import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useBookingFlow } from '../context/BookingFlowContext';
import { INSURANCE_FEE_INR } from '../constants';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^[6-9]\d{9}$/;

function validatePassenger(p) {
  const errors = {};
  if (!p.fullName || p.fullName.trim().length < 2) errors.fullName = 'Enter full name';
  const age = parseInt(p.age, 10);
  if (!p.age || Number.isNaN(age) || age < 1 || age > 120) errors.age = 'Valid age required';
  if (!p.gender) errors.gender = 'Select gender';
  if (!p.idNumber || p.idNumber.trim().length < 6) errors.idNumber = 'Enter a valid ID number';
  if (!p.email || !emailRe.test(p.email.trim())) errors.email = 'Valid email required';
  if (!p.phone || !phoneRe.test(p.phone.trim())) errors.phone = '10-digit Indian mobile';
  return errors;
}

export default function PassengerFormStep() {
  const { passengers, setPassengers, insurance, setInsurance, grandTotal, setStepIndex } = useBookingFlow();
  const [touched, setTouched] = useState(() => passengers.map(() => ({})));
  const [submitAttempt, setSubmitAttempt] = useState(false);

  useEffect(() => {
    setTouched((t) => {
      const next = passengers.map((_, i) => t[i] || {});
      return next;
    });
  }, [passengers.length]);

  const update = (idx, field, value) => {
    setPassengers((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const allErrors = passengers.map((p) => validatePassenger(p));
  const hasErrors = allErrors.some((e) => Object.keys(e).length);

  const autofill = () => {
    setPassengers((prev) =>
      prev.map((_, i) => ({
        fullName: i === 0 ? 'Rishav Raj' : `Traveler ${i + 1}`,
        age: i === 0 ? '26' : '30',
        gender: i % 2 === 0 ? 'male' : 'female',
        idType: 'aadhaar',
        idNumber: '123456789012',
        email: 'hello@yavi.travel',
        phone: '9876543210',
      }))
    );
  };

  const onContinue = () => {
    setSubmitAttempt(true);
    if (hasErrors) return;
    setStepIndex(4);
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Traveler details</h3>
          <p className="text-sm text-slate-500">We will send your e‑ticket and updates here.</p>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={autofill}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#534AB7]/30 bg-[#F8F7FF] px-4 py-2 text-sm font-bold text-[#534AB7]"
        >
          <Sparkles className="h-4 w-4" />
          Autofill demo profile
        </motion.button>
      </div>

      <div className="space-y-8">
        {passengers.map((p, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-100 bg-[#F8F7FF]/40 p-4 md:p-6">
            <p className="mb-4 text-sm font-bold text-slate-800">Traveler {idx + 1}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Full name"
                value={p.fullName}
                onChange={(v) => update(idx, 'fullName', v)}
                error={allErrors[idx].fullName}
                show={submitAttempt || touched[idx]?.fullName}
                onBlur={() => setTouched((t) => {
                  const n = [...t];
                  n[idx] = { ...n[idx], fullName: true };
                  return n;
                })}
              />
              <Field
                label="Age"
                type="number"
                value={p.age}
                onChange={(v) => update(idx, 'age', v)}
                error={allErrors[idx].age}
                show={submitAttempt || touched[idx]?.age}
                onBlur={() => setTouched((t) => {
                  const n = [...t];
                  n[idx] = { ...n[idx], age: true };
                  return n;
                })}
              />
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Gender</label>
                <select
                  value={p.gender}
                  onChange={(e) => update(idx, 'gender', e.target.value)}
                  onBlur={() => setTouched((t) => {
                    const n = [...t];
                    n[idx] = { ...n[idx], gender: true };
                    return n;
                  })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold"
                >
                  <option value="">Select</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
                {allErrors[idx].gender && (submitAttempt || touched[idx]?.gender) && (
                  <p className="mt-1 text-xs font-semibold text-[#E24B4A]">{allErrors[idx].gender}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">ID type</label>
                <select
                  value={p.idType}
                  onChange={(e) => update(idx, 'idType', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold"
                >
                  <option value="aadhaar">Aadhaar</option>
                  <option value="passport">Passport</option>
                </select>
              </div>
              <Field
                label="ID number"
                value={p.idNumber}
                onChange={(v) => update(idx, 'idNumber', v)}
                error={allErrors[idx].idNumber}
                show={submitAttempt || touched[idx]?.idNumber}
                onBlur={() => setTouched((t) => {
                  const n = [...t];
                  n[idx] = { ...n[idx], idNumber: true };
                  return n;
                })}
              />
              <Field
                label="Email"
                value={p.email}
                onChange={(v) => update(idx, 'email', v)}
                error={allErrors[idx].email}
                show={submitAttempt || touched[idx]?.email}
                onBlur={() => setTouched((t) => {
                  const n = [...t];
                  n[idx] = { ...n[idx], email: true };
                  return n;
                })}
              />
              <Field
                label="Phone"
                value={p.phone}
                onChange={(v) => update(idx, 'phone', v)}
                error={allErrors[idx].phone}
                show={submitAttempt || touched[idx]?.phone}
                onBlur={() => setTouched((t) => {
                  const n = [...t];
                  n[idx] = { ...n[idx], phone: true };
                  return n;
                })}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={insurance}
            onChange={(e) => setInsurance(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 accent-[#1D9E75]"
          />
          <span>
            <span className="font-bold text-slate-900">Travel insurance</span>
            <span className="block text-xs text-slate-500">
              Covers trip delays & medical emergencies (+₹{INSURANCE_FEE_INR})
            </span>
          </span>
        </label>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase text-slate-500">Estimated total</p>
          <p className="text-2xl font-black text-[#534AB7]">₹{grandTotal.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="rounded-2xl bg-[#534AB7] px-10 py-3 text-sm font-bold text-white shadow-lg shadow-[#534AB7]/25"
        >
          Continue to payment
        </motion.button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, error, show, type = 'text', onBlur }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-semibold outline-none transition ${
          show && error ? 'border-[#E24B4A] ring-2 ring-[#E24B4A]/15' : 'border-slate-200 focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/15'
        }`}
      />
      {show && error && <p className="mt-1 text-xs font-semibold text-[#E24B4A]">{error}</p>}
    </div>
  );
}
