import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import ChatDrawer from './ChatDrawer';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-row items-center gap-3">
      <ChatDrawer open={isOpen} onClose={() => setIsOpen(false)} />

      <span
        className="hidden select-none rounded-[20px] border px-3 py-1 text-[14px] font-medium text-white shadow-[0_0_20px_rgba(83,74,183,0.25)] md:inline-block"
        style={{
          background: 'rgba(83, 74, 183, 0.2)',
          borderColor: 'rgba(83, 74, 183, 0.4)',
          padding: '4px 12px',
        }}
      >
        Yavi AI
      </span>

      <motion.button
        type="button"
        aria-label={isOpen ? 'Close Yavi AI' : 'Open Yavi AI'}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-yavi-blue to-yavi-purple shadow-2xl shadow-blue-500/30"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-7 w-7 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <MessageSquare className="h-7 w-7 text-white" />
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#050505] bg-emerald-500" aria-hidden />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default Chatbot;
