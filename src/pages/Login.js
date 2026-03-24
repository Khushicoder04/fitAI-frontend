import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form,  setForm]  = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(form.email, form.password); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Invalid email or password.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'6rem 1rem 2rem' }}>
      <motion.div initial={{ opacity:0,y:24 }} animate={{ opacity:1,y:0 }} style={{ width:'100%', maxWidth:420 }}>
        <div className="card" style={{ padding:'2.25rem', boxShadow:'var(--shadow-lg)' }}>
          <div style={{ textAlign:'center', marginBottom:'1.75rem' }}>
            <div style={{ fontSize:'2rem', marginBottom:'0.65rem' }}>👋</div>
            <h1 style={{ fontSize:'1.5rem', fontWeight:700, letterSpacing:'-0.03em', marginBottom:'0.35rem' }}>Welcome back</h1>
            <p style={{ color:'var(--text2)', fontSize:'0.88rem' }}>Sign in to your FitAI account</p>
          </div>

          {error && <div style={{ padding:'0.65rem 0.9rem', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'var(--radius)', color:'var(--red)', fontSize:'0.85rem', marginBottom:'1.1rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div><label>Email</label><input type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required /></div>
            <div>
              <label>Password</label>
              <div style={{ position:'relative' }}>
                <input type={showPwd?'text':'password'} placeholder="Your password"
                  value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required style={{ paddingRight:'2.5rem' }} />
                <button type="button" onClick={()=>setShowPwd(s=>!s)}
                  style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text3)', fontSize:'0.9rem' }}>
                  {showPwd?'🙈':'👁️'}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding:'0.75rem', fontSize:'0.95rem', marginTop:'0.25rem' }}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
          <p style={{ textAlign:'center', marginTop:'1.25rem', color:'var(--text2)', fontSize:'0.88rem' }}>
            Don't have an account? <Link to="/signup" style={{ color:'var(--accent)', fontWeight:600 }}>Sign up free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
