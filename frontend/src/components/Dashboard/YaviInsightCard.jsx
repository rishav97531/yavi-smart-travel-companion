import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function YaviInsightCard({ title, body, delay = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-[#534AB7]/30 bg-gradient-to-br from-[#534AB7]/12 via-white/[0.04] to-[#1D9E75]/10 p-4 shadow-[0_8px_32px_rgba(83,74,183,0.12)] backdrop-blur-md transition-all duration-300 hover:border-[#1D9E75]/35 hover:shadow-[0_12px_40px_rgba(29,158,117,0.15)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#534AB7]/25 bg-[#534AB7]/15 px-2.5 py-0.5">
        <Sparkles className="h-3 w-3 text-[#1D9E75]" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-violet-100">AI</span>
      </div>
      <h4 className="relative text-sm font-bold leading-snug text-white">{title}</h4>
      <p className="relative mt-1.5 text-xs leading-relaxed text-zinc-400">{body}</p>
    </motion.article>
  );
}
