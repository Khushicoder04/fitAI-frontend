import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Link } from 'react-router-dom';

const SUGGESTIONS = [
  'How much protein do I need?',
  'Best exercises for fat loss',
  'How important is sleep?',
  'Give me motivation!',
  'How much water per day?',
];

export default function Chatbot() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hey ${user?.name?.split(' ')[0] || 'there'}! 💪 I'm your FitAI Coach — ask me anything about fitness, diet, workouts, or nutrition!`,
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    const userMsg = { role: 'user', content: msg, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      const { data } = await api.post('/chat', { message: msg, history });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply,
        time: new Date()
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I couldn't respond right now. Please try again! 🙏",
        time: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // Format message with basic markdown (bold, line breaks)
  const formatMsg = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  if (!user?.isPro) {
    return (
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 999 }}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/pricing" title="Upgrade to Pro for AI Coach"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), var(--pink))',
              boxShadow: '0 8px 24px var(--glow)', cursor: 'pointer',
              fontSize: '1.5rem', textDecoration: 'none'
            }}>
            🤖
          </Link>
        </motion.div>
        <div style={{ position: 'absolute', bottom: '110%', right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.5rem 0.75rem', fontSize: '0.8rem', whiteSpace: 'nowrap', color: 'var(--text2)' }}>
          ⚡ Pro — AI Coach
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 999 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            style={{
              position: 'absolute', bottom: '4.5rem', right: 0,
              width: 360, height: 520,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 20,
              boxShadow: 'var(--shadow-lg)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1rem 1.25rem',
              background: 'linear-gradient(135deg, var(--accent), var(--pink))',
              display: 'flex', alignItems: 'center', gap: '0.75rem'
            }}>
              <div style={{ fontSize: '1.8rem' }}>🤖</div>
              <div>
                <div style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>FitAI Coach</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                  Online 24/7
                </div>
              </div>
              <span className="badge" style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.7rem' }}>⚡ Pro</span>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '82%',
                    padding: '0.65rem 0.9rem',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, var(--accent), var(--pink))'
                      : 'var(--surface2)',
                    color: msg.role === 'user' ? 'white' : 'var(--text)',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none'
                  }}
                    dangerouslySetInnerHTML={{ __html: formatMsg(msg.content) }}
                  />
                </motion.div>
              ))}
              {loading && (
                <div style={{ display: 'flex', gap: '4px', padding: '0.65rem 0.9rem', background: 'var(--surface2)', borderRadius: '16px 16px 16px 4px', width: 'fit-content', border: '1px solid var(--border)' }}>
                  {[0,1,2].map(i => (
                    <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div style={{ padding: '0 1rem 0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => sendMessage(s)}
                    style={{ padding: '0.3rem 0.65rem', borderRadius: 999, background: 'var(--surface2)', border: '1px solid var(--border)', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--text2)' }}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask your coach anything..."
                style={{ flex: 1, padding: '0.6rem 0.9rem', borderRadius: 12, fontSize: '0.88rem' }}
              />
              <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
                style={{
                  padding: '0.6rem 1rem', borderRadius: 12,
                  background: input.trim() ? 'var(--accent)' : 'var(--surface2)',
                  color: input.trim() ? 'white' : 'var(--text2)',
                  border: 'none', cursor: 'pointer', fontSize: '1rem',
                  transition: 'all 0.2s'
                }}>
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        style={{
          width: 56, height: 56, borderRadius: '50%',
          background: open ? 'var(--surface)' : 'linear-gradient(135deg, var(--accent), var(--pink))',
          border: open ? '2px solid var(--accent)' : 'none',
          boxShadow: '0 8px 24px var(--glow)',
          cursor: 'pointer', fontSize: '1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: open ? 'var(--accent)' : 'white'
        }}
      >
        {open ? '✕' : '🤖'}
      </motion.button>
    </div>
  );
}
