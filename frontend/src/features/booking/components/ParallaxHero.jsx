import { useMotionValue, useSpring, useTransform, motion } from 'framer-motion';
import { useEffect } from 'react';

export default function ParallaxHero({ children }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });
  const x1 = useTransform(sx, (v) => v * 0.06);
  const x2 = useTransform(sx, (v) => v * -0.04);
  const y1 = useTransform(sy, (v) => v * 0.05);

  useEffect(() => {
    const el = document.getElementById('booking-parallax-root');
    if (!el) return undefined;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = e.clientX - (r.left + r.width / 2);
      const py = e.clientY - (r.top + r.height / 2);
      mx.set(px);
      my.set(py);
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, [mx, my]);

  return (
    <div id="booking-parallax-root" className="relative overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-xl">
      <motion.div style={{ x: x1, y: y1 }} className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#534AB7]/15 blur-3xl" />
      <motion.div style={{ x: x2 }} className="pointer-events-none absolute -right-16 top-10 h-64 w-64 rounded-full bg-[#1D9E75]/20 blur-3xl" />
      <motion.div
        style={{ x: x1, y: y1 }}
        className="pointer-events-none absolute bottom-0 right-1/3 h-40 w-40 rounded-full bg-[#EF9F27]/15 blur-2xl"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
