import { motion } from 'framer-motion';
import { Plane, Hotel, Train, Shield, Wallet, CloudSun, Map as MapIcon, Globe, ArrowRight, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AuthPanel from '../components/AuthPanel';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: <Plane className="text-yavi-blue" />, title: 'Smart Booking', desc: 'AI-optimized flight and stay comparisons.' },
  { icon: <Wallet className="text-yavi-purple" />, title: 'Budget Vault', desc: 'Real-time expense tracking & AI insights.' },
  { icon: <CloudSun className="text-yavi-teal" />, title: 'Live Weather', desc: 'Hyper-local forecasts for your trip.' },
  { icon: <Shield className="text-red-400" />, title: 'Safety SOS', desc: '24/7 emergency support and safety alerts.' },
  { icon: <Globe className="text-blue-300" />, title: 'Globe Trotter', desc: 'Explore hidden gems curated by AI.' },
  { icon: <MapIcon className="text-green-400" />, title: 'Vault', desc: 'Securely store documents and visas.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const Home = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col gap-24 overflow-hidden bg-[#050505]">
      {/* Animated Deep Background Blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-yavi-blue/20 rounded-full blur-[120px]"
        ></motion.div>
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-yavi-purple/10 rounded-full blur-[120px]"
        ></motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-20 overflow-hidden">
        <motion.div
           variants={containerVariants}
           initial="hidden"
           animate="visible"
           className="max-w-5xl z-10"
        >
          <motion.h1 variants={itemVariants} className="text-7xl md:text-[10rem] font-heading font-black mb-8 leading-[0.9] tracking-tighter">
            Smart Travel <br />
            <span className="gradient-text drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">Companion</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-400 mb-14 max-w-3xl mx-auto leading-relaxed font-medium">
            Your trip, perfectly mapped.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-yavi-blue to-yavi-purple px-12 py-5 rounded-2xl text-lg font-bold shadow-2xl transition-all flex items-center gap-3 group"
                >
                  Enter Dashboard <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </motion.button>
              </Link>
            ) : (
              <Link to="/auth">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-yavi-blue to-yavi-purple px-12 py-5 rounded-2xl text-lg font-bold shadow-2xl transition-all flex items-center gap-3 group"
                >
                  Start Planning <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </motion.button>
              </Link>
            )}
            <a href="#features">
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.95 }}
                className="glass px-12 py-5 rounded-2xl text-lg font-bold transition-all border-white/20"
              >
                Core Features
              </motion.button>
            </a>
          </motion.div>
        </motion.div>

        {/* Floating Icons with increased depth */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
           <motion.div animate={{ y: [0, -40, 0], rotate: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[15%] left-[5%] opacity-10 text-yavi-blue"><Plane size={120} /></motion.div>
           <motion.div animate={{ y: [0, 40, 0], rotate: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[10%] right-[5%] opacity-10 text-yavi-purple"><Globe size={180} /></motion.div>
           <motion.div animate={{ x: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[40%] right-[15%] opacity-5 text-yavi-teal"><Hotel size={100} /></motion.div>
        </div>
      </section>

      {/* Feature Grid with Scroll Reveal */}
      <section id="features" className="px-4 py-20 bg-[#050505]/50 relative z-10">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 leading-tight">
              Powerful Features for <br /><span className="gradient-text">Modern Explorers</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yavi-blue to-yavi-teal mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="glass-card flex flex-col gap-6 group relative overflow-hidden"
              >
                {/* Decorative background glow */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
                
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-lg relative z-10">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold font-heading mb-3 group-hover:text-yavi-teal transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
                
                <div className="mt-4 pt-6 border-t border-white/5 flex items-center text-sm font-bold text-yavi-blue group-hover:translate-x-2 transition-transform cursor-pointer">
                  Learn more <ArrowRight size={16} className="ml-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-32 text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="glass p-12 md:p-24 rounded-[3rem] max-w-6xl mx-auto border-white/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yavi-blue/20 via-transparent to-yavi-purple/20 pointer-events-none"></div>
          <h2 className="text-4xl md:text-6xl font-heading font-extrabold mb-8 relative z-10">
            Ready for your next <br /><span className="gradient-text">Global Mission?</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto relative z-10">
            Join 50k+ smart travelers who have optimized their journeys with YAVI AI.
          </p>
          {isAuthenticated ? (
            <Link to="/dashboard" className="relative z-10 inline-block">
              <button className="bg-white text-black px-12 py-5 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all">
                Open Dashboard
              </button>
            </Link>
          ) : (
            <Link to="/auth" className="relative z-10 inline-block">
              <button className="bg-white text-black px-12 py-5 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all">
                Get Started Now
              </button>
            </Link>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
