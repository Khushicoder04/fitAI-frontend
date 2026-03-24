import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Loader from '../components/common/Loader';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying | success | error

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) { setStatus('error'); return; }
    api.post('/payment/verify-session', { sessionId })
      .then(() => { refreshUser(); setStatus('success'); })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1rem 2rem' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center', maxWidth: 480 }}>
        {status === 'verifying' && <Loader text="Verifying your payment..." />}
        {status === 'success' && (
          <div className="card" style={{ padding: '3rem' }}>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6 }} style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</motion.div>
            <h1 style={{ fontWeight: 800, fontSize: '2rem', marginBottom: '0.75rem' }}>Welcome to <span className="gradient-text">Pro!</span></h1>
            <p style={{ color: 'var(--text2)', marginBottom: '2rem', lineHeight: 1.7 }}>
              Your account has been upgraded. You now have access to full 7-day meal plans, weekly workout schedules, progress charts, and voice coaching.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard →</Link>
              <Link to="/diet" className="btn btn-outline">View Diet Plan</Link>
            </div>
          </div>
        )}
        {status === 'error' && (
          <div className="card" style={{ padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ fontWeight: 800, marginBottom: '0.75rem' }}>Verification Issue</h2>
            <p style={{ color: 'var(--text2)', marginBottom: '2rem' }}>
              We couldn't verify your payment. If you were charged, please contact support. Otherwise, try upgrading again.
            </p>
            <Link to="/pricing" className="btn btn-primary">Back to Pricing</Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
