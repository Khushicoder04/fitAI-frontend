import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const FREE_FEATURES = ['BMI Calculator', 'Basic health summary', 'Basic diet tips', 'Basic workout overview', 'Guest access (no login required)'];
const PRO_FEATURES = ['Everything in Free', '7-day detailed meal plans', 'Weekly workout schedules', 'Full progress tracking', 'Interactive progress charts', 'Voice coach tips', 'Advanced health recommendations', 'Supplement suggestions', 'Progress milestone tracking', 'Priority support'];

export default function Pricing() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    if (!user) { navigate('/signup'); return; }
    if (user.isPro) return;
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/payment/create-checkout-session');
      window.location.href = data.url;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', padding: '6rem 0 4rem' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-purple" style={{ marginBottom: '1rem' }}>Simple Pricing</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Choose your <span className="gradient-text">plan</span>
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '1.1rem', maxWidth: 520, margin: '0 auto' }}>
            Start free and upgrade anytime to unlock your full AI-powered health experience.
          </p>
        </motion.div>

        {error && (
          <div style={{ maxWidth: 600, margin: '0 auto 1.5rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: 'var(--red)', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', maxWidth: 760, margin: '0 auto' }}>
          {/* Free */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="card" style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Free</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2.5rem' }}>$0<span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text2)' }}>/mo</span></div>
              <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Forever free. No credit card needed.</p>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.75rem' }}>
              {FREE_FEATURES.map(f => (
                <li key={f} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text2)' }}>
                  <span style={{ color: 'var(--green)', flexShrink: 0 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            {user ? (
              <Link to="/dashboard" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>
                {user.isPro ? 'Current Plan (Downgraded)' : '✓ Your Current Plan'}
              </Link>
            ) : (
              <Link to="/signup" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>Get Started Free</Link>
            )}
          </motion.div>

          {/* Pro */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ position: 'relative', background: 'var(--surface)', border: '2px solid var(--accent)', borderRadius: 'var(--radius)', padding: '2rem', boxShadow: '0 0 40px var(--glow)' }}>
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, var(--accent), var(--pink))', color: 'white', padding: '0.3rem 1.25rem', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
              ⚡ Most Popular
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Pro</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2.5rem' }}>$9.99<span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text2)' }}>/mo</span></div>
              <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Cancel anytime. Billed monthly.</p>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.75rem' }}>
              {PRO_FEATURES.map(f => (
                <li key={f} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}>⚡</span> {f}
                </li>
              ))}
            </ul>
            {user?.isPro ? (
              <div className="btn" style={{ width: '100%', textAlign: 'center', background: 'var(--green)', color: 'white', cursor: 'default' }}>
                ✓ You're a Pro Member!
              </div>
            ) : (
              <button onClick={handleUpgrade} className="btn btn-primary" disabled={loading}
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}>
                {loading ? 'Redirecting to checkout...' : user ? 'Upgrade to Pro →' : 'Sign Up & Go Pro →'}
              </button>
            )}
            <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text2)' }}>
              🔒 Secure payment via Stripe · Test mode active
            </p>
          </motion.div>
        </div>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ maxWidth: 680, margin: '4rem auto 0', textAlign: 'center' }}>
          <h2 style={{ fontWeight: 800, marginBottom: '2rem', fontSize: '1.5rem' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            {[
              ['Is the free plan actually free?', 'Yes — 100% free, no credit card required. You get BMI analysis, basic diet tips, and a basic workout overview instantly.'],
              ['How do I test the Pro payment?', 'Use Stripe test card: 4242 4242 4242 4242, any future expiry, any CVC. This is test mode — no real charges.'],
              ['Can I cancel my Pro subscription?', 'Yes, you can cancel anytime from your account. Your Pro access continues until the end of the billing period.'],
              ['Is my data secure?', 'All passwords are hashed with bcrypt. JWTs are used for secure session management. Payments are processed entirely by Stripe.'],
            ].map(([q, a]) => (
              <div key={q} className="card" style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Q: {q}</div>
                <div style={{ color: 'var(--text2)', fontSize: '0.9rem', lineHeight: 1.6 }}>{a}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
