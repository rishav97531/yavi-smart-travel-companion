import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { yaviAssistantApi } from '../services/bookingApi';
import { useBookingFlow } from '../context/BookingFlowContext';

const PROMPTS = ['Is this a good price?', 'What should I pack?', 'Do I need a visa?'];

export default function YaviAssistant() {
  const { flightContextForAi } = useBookingFlow();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState('');

  const send = async (text) => {
    const msg = text.trim();
    if (!msg) return;
    const prior = history;
    setHistory((h) => [...h, { role: 'user', content: msg }]);
    setInput('');
    setLoading(true);
    setTyping('');
    try {
      const res = await yaviAssistantApi({
        message: msg,
        history: prior.map(({ role, content }) => ({ role, content })),
        flightContext: flightContextForAi,
      });
      const reply = res.reply || 'Yavi is thinking… try again in a moment.';
      await animateTyping(reply);
      setTyping('');
      setHistory((h) => [...h, { role: 'assistant', content: reply }]);
    } catch (e) {
      console.error(e);
      toast.error(e.message || 'Assistant unavailable');
      setTyping('');
      setHistory((h) => [
        ...h,
        {
          role: 'assistant',
          content:
            'I could not reach the Yavi brain just now. Double-check your connection and that the backend has COHERE_API_KEY set.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const animateTyping = (full) =>
    new Promise((resolve) => {
      const chunk = 2;
      let i = 0;
      const id = setInterval(() => {
        i += chunk;
        setTyping(full.slice(0, i));
        if (i >= full.length) {
          clearInterval(id);
          resolve();
        }
      }, 18);
    });

  return (
    <>
      <motion.button
        type="button"
        aria-label="Ask Yavi"
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#534AB7] text-white shadow-2xl shadow-[#534AB7]/40 md:bottom-10 md:right-8"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: 380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 380, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 28 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#534AB7]">Ask Yavi</p>
                <p className="text-sm font-semibold text-slate-600">Your smart travel copilot</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3">
              {PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => send(p)}
                  className="rounded-full bg-[#F8F7FF] px-3 py-1 text-xs font-semibold text-[#534AB7] ring-1 ring-[#534AB7]/15"
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {history.length === 0 && (
                <p className="text-sm text-slate-500">
                  Ask anything about this booking — prices, baggage, visas, or what to pack for your route.
                </p>
              )}
              {history.map((m, i) => (
                <div
                  key={`${i}-${m.role}`}
                  className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === 'user' ? 'ml-auto bg-[#534AB7] text-white' : 'mr-auto bg-slate-100 text-slate-800'
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {typing && (
                <div className="mr-auto max-w-[90%] rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-800">{typing}</div>
              )}
              {loading && !typing && (
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Yavi is typing…
                </div>
              )}
            </div>
            <form
              className="flex items-center gap-2 border-t border-slate-100 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Yavi…"
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#534AB7]"
              />
              <button
                type="submit"
                className="rounded-2xl bg-[#534AB7] p-3 text-white shadow-md disabled:opacity-40"
                disabled={loading}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
