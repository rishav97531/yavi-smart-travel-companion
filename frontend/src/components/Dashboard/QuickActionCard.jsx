import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * @param {{ to: string; title: string; subtitle?: string; emoji?: string; icon?: React.ReactNode; delay?: number }} props
 */
export default function QuickActionCard({ to, title, subtitle, emoji, icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={to} className="group block h-full">
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className="relative flex h-full min-h-[132px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/6 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl ring-1 ring-white/6 transition-shadow duration-300 hover:border-[#534AB7]/35 hover:shadow-[0_16px_48px_rgba(83,74,183,0.25)]"
        >
          <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#534AB7]/20 blur-2xl transition-opacity group-hover:opacity-100 opacity-70" />
          <span className="pointer-events-none absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-[#1D9E75]/15 blur-2xl opacity-80" />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                {emoji && <span className="text-xl leading-none">{emoji}</span>}
                {icon && <span className="text-[#1D9E75]">{icon}</span>}
                <h3 className="text-base font-bold text-white">{title}</h3>
              </div>
              {subtitle && <p className="mt-2 text-sm leading-snug text-zinc-400">{subtitle}</p>}
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 transition-colors group-hover:border-[#1D9E75]/30 group-hover:text-[#1D9E75]">
              Go
            </span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
