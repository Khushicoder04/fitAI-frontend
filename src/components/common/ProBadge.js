import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProBadge({ message = 'This feature requires a Pro subscription.' }) {
  return (
    <motion.div
      initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }}
      style={{
        background:'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(236,72,153,0.06))',
        border:'1px solid rgba(99,102,241,0.2)',
        borderRadius:'var(--radius-lg)',
        padding:'2rem',
        textAlign:'center',
        boxShadow:'var(--shadow-sm)',
      }}
    >
      <div style={{ fontSize:'2rem', marginBottom:'0.65rem' }}>⚡</div>
      <h3 style={{ fontWeight:700, marginBottom:'0.4rem', fontSize:'1rem', letterSpacing:'-0.02em' }}>Pro Feature</h3>
      <p style={{ color:'var(--text2)', marginBottom:'1.25rem', fontSize:'0.88rem', lineHeight:1.65 }}>{message}</p>
      <Link to="/pricing" className="btn btn-primary" style={{ padding:'0.6rem 1.75rem' }}>Upgrade to Pro →</Link>
    </motion.div>
  );
}
