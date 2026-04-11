import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, ArrowRightLeft, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
import { fetchWithAuth } from '../utils/api';
import toast from 'react-hot-toast';

const Currency = () => {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const currencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
  ];

  const handleConvert = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetchWithAuth(`/api/currency/${from}/${to}/${amount}`);
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        throw new Error(data.message || 'Conversion failed');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-yavi-blue/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-yavi-purple/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-yavi-teal text-xs font-bold uppercase tracking-widest mb-6">
            <RefreshCw size={14} className="animate-spin-slow" />
            Live Exchange Rates
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-4">
            Currency <span className="gradient-text">Converter</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get instant, accurate conversion rates for your global travels. Trusted by explorers worldwide.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 md:p-12 relative overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8 relative z-10">
            {/* From */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">From</label>
              <div className="relative">
                <select 
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white appearance-none focus:outline-none focus:border-yavi-blue transition-all"
                >
                  {currencies.map(c => (
                    <option key={c.code} value={c.code} className="bg-[#0f172a]">{c.flag} {c.code} - {c.name}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  ▼
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <motion.button
              whileHover={{ rotate: 180, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSwap}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-yavi-teal hover:bg-white/10 transition-all mt-6"
            >
              <ArrowRightLeft size={20} />
            </motion.button>

            {/* To */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">To</label>
              <div className="relative">
                <select 
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white appearance-none focus:outline-none focus:border-yavi-teal transition-all"
                >
                  {currencies.map(c => (
                    <option key={c.code} value={c.code} className="bg-[#0f172a]">{c.flag} {c.code} - {c.name}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  ▼
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Amount</label>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-yavi-blue">
                  <DollarSign size={20} />
                </div>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white text-xl font-bold focus:outline-none focus:border-yavi-blue transition-all"
                />
              </div>
              <button
                onClick={handleConvert}
                disabled={loading}
                className="bg-gradient-to-r from-yavi-blue via-yavi-teal to-yavi-blue bg-[length:200%_auto] hover:bg-right px-10 py-4 rounded-2xl text-white font-bold shadow-lg shadow-yavi-blue/20 transition-all disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin" /> : 'Convert Now'}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-12 pt-12 border-t border-white/5"
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Result</h3>
                    <p className="text-2xl text-gray-300">
                      {result.amount} {result.base} =
                    </p>
                    <p className="text-5xl md:text-6xl font-heading font-black gradient-text">
                      {result.convertedAmount.toLocaleString()} {result.target}
                    </p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-yavi-teal/20 flex items-center justify-center text-yavi-teal">
                        <TrendingUp size={20} />
                      </div>
                      <span className="text-sm font-bold text-gray-300 uppercase">Live Exchange Rate</span>
                    </div>
                    <div className="space-y-2">
                        <p className="text-gray-400 text-sm">1 {result.base} = {result.rate} {result.target}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <AlertCircle size={12} />
                          Updated: {new Date(result.lastUpdate).toLocaleString()}
                        </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { title: 'Real-time', desc: 'Updates every minute for precision.' },
              { title: 'Secure', desc: 'Encrypted backend synchronization.' },
              { title: 'Global', desc: 'Supports 160+ world currencies.' }
            ].map((f, i) => (
              <div key={i} className="glass p-6 rounded-3xl border border-white/5">
                <h4 className="font-bold text-yavi-teal mb-2">{f.title}</h4>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Currency;
