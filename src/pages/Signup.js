import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const rules = [
  { test: v => v.length >= 8,        label:'At least 8 characters' },
  { test: v => /[A-Z]/.test(v),      label:'One uppercase letter' },
  { test: v => /[a-z]/.test(v),      label:'One lowercase letter' },
  { test: v => /[0-9]/.test(v),      label:'One number' },
  { test: v => /[^A-Za-z0-9]/.test(v),label:'One special character (!@#$…)' },
];

export default function Signup() {
  const [form,  setForm]  = useState({ name:'', email:'', password:'', confirm:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { signup } = useAuth();
  const navigate   = useNavigate();

  const pwdStrength = rules.filter(r => r.test(form.password)).length;
  const strengthColor = ['var(--red)','var(--red)','var(--yellow)','var(--yellow)','var(--green)'][pwdStrength] || 'var(--border)';

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (pwdStrength < 5) { setError('Please meet all password requirements.'); return; }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Signup failed.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'6rem 1rem 2rem' }}>
      <motion.div initial={{ opacity:0,y:24 }} animate={{ opacity:1,y:0 }} style={{ width:'100%', maxWidth:460 }}>
        <div className="card" style={{ padding:'2.25rem', boxShadow:'var(--shadow-lg)' }}>
          <div style={{ textAlign:'center', marginBottom:'1.75rem' }}>
            <div style={{ fontSize:'2rem', marginBottom:'0.65rem' }}>🚀</div>
            <h1 style={{ fontSize:'1.5rem', fontWeight:700, letterSpacing:'-0.03em', marginBottom:'0.35rem' }}>Create account</h1>
            <p style={{ color:'var(--text2)', fontSize:'0.88rem' }}>Start your fitness journey — free forever</p>
          </div>

          {error && <div style={{ padding:'0.65rem 0.9rem', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'var(--radius)', color:'var(--red)', fontSize:'0.85rem', marginBottom:'1.1rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div><label>Full Name</label><input placeholder="John Doe" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required /></div>
            <div><label>Email</label><input type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required /></div>
            <div>
              <label>Password</label>
              <div style={{ position:'relative' }}>
                <input type={showPwd?'text':'password'} placeholder="Min 8 chars, upper, lower, number, symbol"
                  value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required
                  style={{ paddingRight:'2.5rem' }} />
                <button type="button" onClick={()=>setShowPwd(s=>!s)}
                  style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text3)', fontSize:'0.9rem' }}>
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
              {/* Strength bar */}
              <div style={{ display:'flex', gap:4, marginTop:'0.5rem' }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{ flex:1, height:3, borderRadius:99, background:i<=pwdStrength?strengthColor:'var(--surface3)', transition:'background 0.2s' }} />
                ))}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.2rem', marginTop:'0.5rem' }}>
                {rules.map(r => (
                  <div key={r.label} style={{ fontSize:'0.73rem', color:r.test(form.password)?'var(--green)':'var(--text3)', display:'flex', gap:'0.3rem', alignItems:'center' }}>
                    <span>{r.test(form.password)?'✓':'○'}</span>{r.label}
                  </div>
                ))}
              </div>
            </div>
            <div><label>Confirm Password</label><input type="password" placeholder="Repeat password" value={form.confirm} onChange={e=>setForm(f=>({...f,confirm:e.target.value}))} required /></div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding:'0.75rem', fontSize:'0.95rem', marginTop:'0.25rem' }}>
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>
          <p style={{ textAlign:'center', marginTop:'1.25rem', color:'var(--text2)', fontSize:'0.88rem' }}>
            Already have an account? <Link to="/login" style={{ color:'var(--accent)', fontWeight:600 }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
