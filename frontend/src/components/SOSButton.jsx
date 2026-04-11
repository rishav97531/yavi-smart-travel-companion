import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Phone, Share2, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';

const SOSButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const emergencyActions = [
    { 
      label: 'Call Emergency', 
      icon: <Phone size={20} />, 
      color: 'bg-red-500', 
      action: () => toast.error('Calling emergency services...')
    },
    { 
      label: 'Share Live Location', 
      icon: <Share2 size={20} />, 
      color: 'bg-blue-500', 
      action: () => toast.success('Location shared with emergency contacts.')
    },
    { 
      label: 'Emergency Contacts', 
      icon: <Users size={20} />, 
      color: 'bg-amber-500', 
      action: () => toast('Opening emergency contacts...')
    },
  ];

  return (
    <>
      <div className="fixed bottom-8 left-8 z-[100] flex flex-col items-start gap-4">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20, x: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20, x: -20 }}
              className="glass p-6 rounded-3xl border border-red-500/30 w-72 mb-4 relative shadow-2xl overflow-hidden"
            >
              {/* Background urgency glow */}
              <div className="absolute inset-0 bg-red-500/5 pointer-events-none animate-pulse"></div>
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-wider text-sm">
                  <AlertCircle size={18} />
                  Emergency SOS
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-3 relative z-10">
                {emergencyActions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => { item.action(); setIsOpen(false); }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-left group"
                  >
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center text-white shadow-lg`}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl relative transition-all duration-500 ${
            isOpen ? 'bg-gray-800 rotate-90' : 'bg-red-600 shadow-red-600/40'
          }`}
        >
          {/* Pulsing Urgency Animation */}
          {!isOpen && (
            <div className="absolute inset-x-0 inset-y-0 rounded-full bg-red-500 animate-ping opacity-25"></div>
          )}
          
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
              >
                <X className="text-white w-8 h-8" />
              </motion.div>
            ) : (
              <motion.div
                key="sos"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center justify-center"
              >
                <span className="text-[10px] font-black text-white leading-none">SOS</span>
                <AlertCircle className="text-white w-6 h-6 mt-0.5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
};

export default SOSButton;
