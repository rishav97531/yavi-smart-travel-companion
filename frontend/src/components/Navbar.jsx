import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  LogOut,
  DollarSign,
  Map as MapIcon,
  User,
  Luggage,
  Menu,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const userLabel = user?.displayName || user?.email || 'Traveler';
  const userInitial = userLabel?.[0] || 'T';

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    setMobileOpen(false);
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const navLinks = [
    { title: 'Home', path: '/', icon: Compass },
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { title: 'My Trips', path: '/my-trips', icon: Luggage },
    { title: 'Currency', path: '/currency', icon: DollarSign },
    { title: 'Explorer', path: '/explorer', icon: MapIcon },
    { title: 'Profile', path: '/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  const linkClass = (active) =>
    [
      'group relative flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-out',
      'text-zinc-400 hover:text-white',
      active
        ? 'text-white bg-white/12 shadow-[0_0_24px_rgba(59,130,246,0.18)] ring-1 ring-cyan-400/25'
        : 'hover:bg-white/6 hover:shadow-[0_0_20px_rgba(20,184,166,0.08)] active:scale-[0.98]',
    ].join(' ');

  return (
    <>
      <nav className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex justify-center px-3 pt-4 sm:px-4 sm:pt-5 md:px-6">
        <div
          className="pointer-events-auto flex w-full max-w-6xl items-center gap-3 rounded-2xl border border-white/12 bg-zinc-950/45 px-4 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.04)_inset,0_1px_0_rgba(255,255,255,0.06)_inset] backdrop-blur-2xl sm:gap-4 sm:rounded-3xl sm:px-6 sm:py-3.5 md:gap-6 md:px-8"
          style={{ WebkitBackdropFilter: 'blur(24px)' }}
        >
          {/* Left: logo + YAVI (unchanged) */}
          <div className="flex min-w-0 shrink-0 items-center">
            <Link to="/" className="flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-95 active:scale-[0.99]">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-yavi-blue to-yavi-purple shadow-[0_0_20px_rgba(139,92,246,0.35)]"
              >
                <Compass className="text-white" size={20} />
              </motion.div>
              <span className="text-xl font-heading font-bold leading-none tracking-tight gradient-text">YAVI</span>
            </Link>
          </div>

          {/* Center: desktop nav */}
          <div className="hidden min-h-[44px] flex-1 items-center justify-center md:flex">
            <ul className="flex items-center gap-1.5 md:gap-2 lg:gap-2.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <li key={link.path}>
                    <Link to={link.path} className={linkClass(active)}>
                      <Icon
                        size={18}
                        className={`shrink-0 transition-colors duration-200 ${
                          active ? 'text-yavi-teal' : 'text-zinc-500 group-hover:text-yavi-teal'
                        }`}
                        strokeWidth={2}
                      />
                      <span className="relative">
                        {link.title}
                        <span
                          className={`absolute -bottom-0.5 left-0 right-0 mx-auto h-0.5 max-w-[70%] rounded-full bg-gradient-to-r from-yavi-blue to-yavi-teal transition-all duration-200 ${
                            active ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-70'
                          }`}
                        />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right: auth / profile + mobile toggle */}
          <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
            <AnimatePresence mode="wait">
              {!isAuthenticated ? (
                <motion.div
                  key="auth-btns"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 sm:gap-3"
                >
                  <Link to="/auth" className="hidden sm:inline-block">
                    <span className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-400 transition-colors duration-200 hover:text-white">
                      Sign in
                    </span>
                  </Link>
                  <Link to="/auth">
                    <motion.span
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center rounded-xl bg-gradient-to-r from-yavi-teal to-yavi-blue px-4 py-2.5 text-sm font-bold text-white shadow-[0_4px_24px_rgba(20,184,166,0.35)] transition-shadow duration-200 hover:shadow-[0_6px_28px_rgba(59,130,246,0.4)] sm:px-6 sm:py-2.5"
                    >
                      Sign In
                    </motion.span>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="user-profile"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 sm:gap-3"
                >
                  <div className="hidden items-center gap-3 rounded-xl border border-white/10 bg-white/6 px-3 py-1.5 shadow-inner sm:flex md:px-4 md:py-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yavi-teal to-yavi-blue text-xs font-bold uppercase text-white shadow-[0_0_16px_rgba(20,184,166,0.35)]">
                      {userInitial}
                    </div>
                    <span className="max-w-32 truncate text-sm font-medium text-zinc-200 lg:max-w-40">{userLabel}</span>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/6 text-xs font-bold uppercase text-white shadow-[0_0_12px_rgba(139,92,246,0.25)] sm:hidden">
                    {userInitial}
                  </div>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="rounded-xl border border-red-500/20 bg-red-500/10 p-2.5 text-red-400 transition-colors duration-200 hover:border-red-400/40 hover:bg-red-500/20 hover:text-red-300"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/6 text-zinc-200 transition-colors duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white md:hidden"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="fixed top-18 right-3 left-3 z-40 max-h-[min(70vh,calc(100vh-6rem))] overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950/90 p-3 shadow-[0_24px_64px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:hidden"
              style={{ WebkitBackdropFilter: 'blur(20px)' }}
            >
              <ul className="flex flex-col gap-1">
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <motion.li
                      key={link.path}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                          active
                            ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-cyan-400/20'
                            : 'text-zinc-400 hover:bg-white/6 hover:text-white active:scale-[0.99]'
                        }`}
                      >
                        <Icon size={20} className={active ? 'text-yavi-teal' : 'text-zinc-500'} strokeWidth={2} />
                        {link.title}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
