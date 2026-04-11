import { motion } from 'framer-motion';
import AuthPanel from '../components/AuthPanel';
import { Compass, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] relative flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob" style={{ top: '20%', left: '10%', opacity: 0.15 }}></div>
        <div className="blob blob-2" style={{ top: '60%', left: '70%', opacity: 0.1 }}></div>
      </div>

      <div className="container max-w-6xl mx-auto flex flex-col items-center relative z-10 w-full">
        {/* Header/Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <Link to="/" className="flex items-center gap-3 group mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yavi-blue to-yavi-purple flex items-center justify-center shadow-lg shadow-yavi-blue/20">
              <Compass className="text-white w-7 h-7" />
            </div>
            <span className="text-3xl font-heading font-bold gradient-text">YAVI</span>
          </Link>
          
          <Link 
            to="/" 
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to homepage
          </Link>
        </motion.div>

        <div className="w-full flex justify-center">
            <AuthPanel />
        </div>

        {/* Footer info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-gray-500 text-sm"
        >
          &copy; 2026 YAVI Travel. Secure biometric-ready transmission.
        </motion.p>
      </div>
    </div>
  );
};

export default AuthPage;
