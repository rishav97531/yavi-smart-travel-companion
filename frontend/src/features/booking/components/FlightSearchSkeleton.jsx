import { motion } from 'framer-motion';

export default function FlightSearchSkeleton() {
  return (
    <div className="mt-6 grid gap-3">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
          className="flex gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
        >
          <div className="h-14 w-14 rounded-2xl bg-slate-100" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-slate-100" />
            <div className="h-3 w-1/2 rounded bg-slate-100" />
            <div className="h-3 w-2/3 rounded bg-slate-100" />
          </div>
          <div className="hidden w-24 flex-col gap-2 sm:flex">
            <div className="h-4 rounded bg-slate-100" />
            <div className="h-3 rounded bg-slate-100" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
