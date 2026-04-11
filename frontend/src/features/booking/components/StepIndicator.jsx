import { motion } from 'framer-motion';
import { BOOKING_STEPS } from '../constants';
import { Check } from 'lucide-react';

export default function StepIndicator({ stepIndex, onStepClick }) {
  return (
    <div className="mb-8 w-full">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {BOOKING_STEPS.map((s, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          return (
            <button
              key={s.id}
              type="button"
              disabled={i > stepIndex}
              onClick={() => i < stepIndex && onStepClick?.(i)}
              className="group flex flex-1 min-w-[4.5rem] flex-col items-center gap-2 disabled:cursor-default"
            >
              <div className="relative flex w-full items-center">
                {i > 0 && (
                  <span
                    className="absolute right-1/2 top-1/2 z-0 h-0.5 w-1/2 -translate-y-1/2 rounded-full"
                    style={{ background: i <= stepIndex ? '#534AB7' : '#e5e7eb' }}
                  />
                )}
                <motion.div
                  initial={false}
                  animate={{
                    scale: active ? 1.05 : 1,
                    backgroundColor: active || done ? '#534AB7' : '#e5e7eb',
                  }}
                  className="relative z-10 mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shadow-md ring-4 ring-white"
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </motion.div>
                {i < BOOKING_STEPS.length - 1 && (
                  <span
                    className="absolute left-1/2 top-1/2 z-0 h-0.5 w-1/2 -translate-y-1/2 rounded-full"
                    style={{ background: i < stepIndex ? '#534AB7' : '#e5e7eb' }}
                  />
                )}
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wide sm:text-xs ${
                  active ? 'text-[#534AB7]' : done ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
