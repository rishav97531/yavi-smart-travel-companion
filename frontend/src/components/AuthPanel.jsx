import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Lock, Mail, User, LogIn, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AuthPanel = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return false;
    }

    if (!isLogin && !formData.name.trim()) {
      toast.error('Please enter your name.');
      return false;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Welcome back.');
      } else {
        await signup(formData.name.trim(), formData.email, formData.password);
        toast.success('Your account is ready.');
      }

      navigate(from, { replace: true });
    } catch (error) {
      console.error('Auth Error:', error);
      let message = 'Authentication failed.';
      
      // Parse Firebase Error Codes
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. Please try again.';
      } else if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Try signing in.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      } else if (error.code === 'auth/operation-not-allowed') {
        message = 'Email/Password sign-in is not enabled in Firebase Console.';
      } else if (error.message.includes('sync')) {
        message = 'Signed in successfully, but could not sync with the backend database.';
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/75 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.55)] backdrop-blur-2xl"
    >
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            Account Access
          </div>
          <h2 className="text-3xl font-heading font-bold text-white">
            {isLogin ? 'Pick up your trip where you left off' : 'Create your YAVI travel vault'}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {isLogin
              ? 'Sign in to open your dashboard, bookings, and saved travel profile.'
              : 'Set up an account to keep plans, bookings, and safety details in one place.'}
          </p>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/20">
          {isLogin ? <LogIn size={24} /> : <UserPlus size={24} />}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatePresence initial={false}>
          {!isLogin && (
            <motion.label
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="block"
            >
              <span className="mb-2 block text-sm font-medium text-slate-200">Full name</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5">
                <User size={18} className="text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="A traveler name"
                  className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                />
              </div>
            </motion.label>
          )}
        </AnimatePresence>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Email</span>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5">
            <Mail size={18} className="text-slate-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="traveler@email.com"
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Password</span>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5">
            <Lock size={18} className="text-slate-400" />
            <input
              type="password"
              value={formData.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </label>

        {!isLogin && (
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Confirm password</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5">
              <Lock size={18} className="text-slate-400" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(event) => updateField('confirmPassword', event.target.value)}
                placeholder="Repeat your password"
                className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </label>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 px-6 py-4 text-base font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <>
              {isLogin ? 'Open Dashboard' : 'Create Account'}
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-300">
        <span>{isLogin ? 'New here?' : 'Already have an account?'}</span>
        <button
          type="button"
          onClick={() => setIsLogin((current) => !current)}
          className="font-semibold text-cyan-300 transition hover:text-white"
        >
          {isLogin ? 'Create an account' : 'Sign in instead'}
        </button>
      </div>
    </motion.div>
  );
};

export default AuthPanel;
