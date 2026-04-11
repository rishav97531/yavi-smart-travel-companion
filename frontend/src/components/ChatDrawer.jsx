import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, X, Send } from 'lucide-react';
import { fetchWithAuth } from '../utils/api';

const QUICK_CHIPS = [
  { label: '✈️ Best flights to Goa?', text: 'Best flights to Goa?' },
  { label: '🎒 What to pack for Manali?', text: 'What to pack for Manali?' },
  { label: '🌍 Do I need visa for Dubai?', text: 'Do I need a visa for Dubai?' },
  { label: '🏨 Budget hotels in Jaipur?', text: 'Budget hotels in Jaipur?' },
];

const WELCOME_TEXT =
  "Hi — I'm Yavi AI ✨\n\nAsk me anything about trips: flights, stays, visas, packing, or budgets. Pick a quick question below or type your own.";

import { useAuth } from '../context/AuthContext';

function buildBackendHistory(msgs) {
  const history = [];
  for (const m of msgs) {
    if (m.isWelcome || m.isError || m.isGuestNotice) continue;
    if (m.role === 'user' || m.role === 'assistant') {
      history.push({ role: m.role, content: m.text });
    }
  }
  const last = history.pop();
  return { message: last?.content || '', history };
}

export default function ChatDrawer({ open, onClose }) {
  const { isAuthenticated } = useAuth();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([{ id: 'welcome', role: 'assistant', text: WELCOME_TEXT, isWelcome: true }]);
  const [errorBanner, setErrorBanner] = useState(null);
  const bottomRef = useRef(null);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, open, scrollToBottom]);

  const callChatApi = useCallback(async (msgsIncludingUser) => {
    setErrorBanner(null);

    const { message, history } = buildBackendHistory(msgsIncludingUser);

    const response = await fetchWithAuth('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || 'AI Assistant is temporarily unavailable.');
    }

    return data.reply;
  }, []);

  const runConversationTurn = useCallback(
    async (userText) => {
      const trimmed = userText.trim();
      if (!trimmed || isLoading) return;

      const userMsg = { id: `u-${Date.now()}`, role: 'user', text: trimmed };
      const nextMsgs = [...messagesRef.current, userMsg];
      messagesRef.current = nextMsgs;
      setMessages(nextMsgs);
      setInput('');
      setIsLoading(true);

      // Handle Guest State
      if (!isAuthenticated) {
        setTimeout(() => {
          const guestMsg = {
            id: `g-${Date.now()}`,
            role: 'assistant',
            text: "I'd love to help, but I need you to sign in first! ✨\n\nThat way I can save your travel preferences and give you personalized advice.",
            isGuestNotice: true,
          };
          const withGuestNotice = [...nextMsgs, guestMsg];
          messagesRef.current = withGuestNotice;
          setMessages(withGuestNotice);
          setIsLoading(false);
        }, 600);
        return;
      }

      try {
        const reply = await callChatApi(nextMsgs);
        const withAssistant = [...nextMsgs, { id: `a-${Date.now()}`, role: 'assistant', text: reply }];
        messagesRef.current = withAssistant;
        setMessages(withAssistant);
      } catch (e) {
        console.error('Chat API error:', e);
        const text = e.message.includes('logged in') 
          ? "It looks like your session expired. Please sign in again to continue chatting!"
          : "Oops! Yavi is having trouble connecting to the server. Please try again in a moment.";
        
        const withErr = [
          ...nextMsgs,
          {
            id: `e-${Date.now()}`,
            role: 'assistant',
            text,
            isError: true,
          },
        ];
        messagesRef.current = withErr;
        setMessages(withErr);
      } finally {
        setIsLoading(false);
      }
    },
    [callChatApi, isLoading, isAuthenticated]
  );



  const handleSend = () => runConversationTurn(input);

  const showQuickChips = messages.length === 1 && messages[0]?.isWelcome;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close chat overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[104] bg-black/50 backdrop-blur-[2px] md:bg-black/40"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="yavi-ai-drawer-title"
            initial={{ opacity: 0, y: 48, x: 16 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 48, x: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed bottom-0 right-0 z-[105] flex max-h-[min(92dvh,720px)] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#0c0c10] shadow-[0_-24px_80px_rgba(83,74,183,0.35)] sm:bottom-6 sm:right-6 sm:max-h-[min(88vh,680px)] sm:rounded-3xl"
          >
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#12121a] px-4 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#534AB7] to-[#43389a] shadow-lg shadow-[#534AB7]/30">
                  <Compass className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 id="yavi-ai-drawer-title" className="truncate text-base font-bold text-white">
                    Yavi AI
                  </h2>
                  <p className="text-[11px] font-medium text-[#1D9E75]">Travel companion</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {errorBanner && (
              <div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-center text-xs font-medium text-amber-200">
                {errorBanner}
              </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id}>
                    {msg.role === 'assistant' && !msg.isWelcome && !msg.isError && (
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#534AB7]/90">Yavi AI</p>
                    )}
                    <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[88%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'bg-[#534AB7] text-white shadow-md shadow-[#534AB7]/25'
                            : msg.isError
                              ? 'border border-red-500/30 bg-red-500/10 text-red-100'
                              : 'border border-white/10 bg-[#1a1a2e] text-zinc-100'
                        }`}
                        style={{
                          borderRadius:
                            msg.role === 'user' ? '18px 18px 4px 18px' : msg.isError ? '18px' : '18px 18px 18px 4px',
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1 rounded-[18px] border border-white/10 bg-[#1a1a2e] px-4 py-3">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-2 w-2 rounded-full bg-[#1D9E75]"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </div>

            {showQuickChips && (
              <div className="shrink-0 border-t border-white/5 px-3 pb-2 pt-2">
                <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Try asking</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      disabled={isLoading}
                      onClick={() => runConversationTurn(chip.text)}
                      className="rounded-full border border-[#534AB7]/30 bg-[#534AB7]/15 px-3 py-1.5 text-left text-xs font-medium text-violet-100 transition hover:border-[#1D9E75]/40 hover:bg-[#1D9E75]/10 disabled:opacity-50"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="shrink-0 border-t border-white/10 bg-[#12121a] p-3">
              <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 focus-within:border-[#534AB7]/40">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask Yavi about travel…"
                  className="max-h-28 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-zinc-500"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#534AB7] text-white shadow-lg transition hover:brightness-110 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
