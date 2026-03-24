import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled]  = useState(false);
  const [menuOpen, setMenuOpen]  = useState(false);
  const location   = useLocation();
  const navigate   = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const navLinks = user
    ? [
        { to:'/dashboard', label:'Dashboard' },
        { to:'/goal',      label:'Goal Plan' },
        { to:'/diet',      label:'Diet' },
        { to:'/workout',   label:'Workout' },
        { to:'/profile',   label:'Profile' },
      ]
    : [{ to:'/pricing', label:'Pricing' }];

  const isActive = (to) => location.pathname === to;

  return (
    <>
      <motion.nav
        initial={{ y:-64 }} animate={{ y:0 }}
        transition={{ type:'spring', stiffness:260, damping:28 }}
        style={{
          position:'fixed', top:0, left:0, right:0, zIndex:1000,
          background: scrolled ? 'rgba(9,9,11,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(1.4)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : 'none',
          boxShadow: scrolled ? '0 1px 24px rgba(0,0,0,0.5)' : 'none',
          transition: 'all 0.3s',
          padding: scrolled ? '0.65rem 0' : '1rem 0',
        }}
      >
        <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>

          {/* Logo */}
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:'0.6rem', flexShrink:0 }}>
            <div style={{
              width:32, height:32, borderRadius:9,
              background:'linear-gradient(135deg,#6366f1,#ec4899)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'1rem', fontWeight:800, color:'white',
              boxShadow:'0 2px 12px rgba(99,102,241,0.45)',
            }}>F</div>
            <span style={{ fontWeight:700, fontSize:'1.05rem', letterSpacing:'-0.03em' }}>
              Fit<span style={{ color:'var(--accent)' }}>AI</span>
            </span>
          </Link>

          {/* Desktop links */}
          <nav style={{ display:'flex', alignItems:'center', gap:'0.15rem' }} className="desk-nav">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} style={{
                padding:'0.42rem 0.85rem', borderRadius:'var(--radius-sm)',
                fontSize:'0.875rem', fontWeight:500,
                color: isActive(l.to) ? 'var(--text)' : 'var(--text2)',
                background: isActive(l.to) ? 'var(--surface2)' : 'transparent',
                transition:'all 0.15s',
              }}
                onMouseEnter={e => { if (!isActive(l.to)) e.currentTarget.style.color='var(--text)'; }}
                onMouseLeave={e => { if (!isActive(l.to)) e.currentTarget.style.color='var(--text2)'; }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <button onClick={toggle} className="btn btn-ghost"
              style={{ width:34, height:34, padding:0, borderRadius:'var(--radius-sm)', fontSize:'0.95rem', flexShrink:0 }}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {user ? (
              <>
                {user.isPro && (
                  <span className="badge badge-purple desk-nav" style={{ fontSize:'0.7rem' }}>⚡ Pro</span>
                )}
                <button onClick={() => { logout(); navigate('/'); }}
                  className="btn btn-outline" style={{ padding:'0.42rem 1rem', fontSize:'0.85rem' }}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost desk-nav"
                  style={{ padding:'0.42rem 0.85rem', fontSize:'0.875rem' }}>Sign in</Link>
                <Link to="/signup" className="btn btn-primary"
                  style={{ padding:'0.42rem 1rem', fontSize:'0.875rem' }}>Get started</Link>
              </>
            )}

            {/* Mobile burger */}
            <button onClick={() => setMenuOpen(o => !o)} className="btn btn-ghost mob-btn"
              style={{ width:34, height:34, padding:0, borderRadius:'var(--radius-sm)', fontSize:'1rem' }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity:0, y:-8 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-8 }}
            style={{
              position:'fixed', top:56, left:0, right:0, zIndex:999,
              background:'var(--surface)',
              borderBottom:'1px solid var(--border)',
              boxShadow:'var(--shadow-lg)',
              padding:'1rem',
            }}
          >
            <div style={{ display:'flex', flexDirection:'column', gap:'0.25rem' }}>
              {navLinks.map(l => (
                <Link key={l.to} to={l.to} style={{
                  padding:'0.65rem 0.9rem', borderRadius:'var(--radius)',
                  fontWeight:500, fontSize:'0.9rem',
                  color: isActive(l.to) ? 'var(--accent)' : 'var(--text)',
                  background: isActive(l.to) ? 'var(--glow)' : 'transparent',
                }}>{l.label}</Link>
              ))}
              <div style={{ height:1, background:'var(--border)', margin:'0.5rem 0' }} />
              {user
                ? <button onClick={() => { logout(); navigate('/'); }} className="btn btn-outline" style={{ textAlign:'left', justifyContent:'flex-start' }}>Sign out</button>
                : <>
                    <Link to="/login"  className="btn btn-outline" style={{ textAlign:'center', marginBottom:'0.25rem' }}>Sign in</Link>
                    <Link to="/signup" className="btn btn-primary" style={{ textAlign:'center' }}>Get started</Link>
                  </>
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width:769px) { .mob-btn{display:none!important} }
        @media (max-width:768px) { .desk-nav{display:none!important} }
        .light nav { background: ${scrolled ? 'rgba(250,250,250,0.92)' : 'transparent'} !important; }
      `}</style>
    </>
  );
}
