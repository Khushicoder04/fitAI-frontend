import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', padding:'3rem 0 2rem' }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'2rem', marginBottom:'2.5rem' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.75rem' }}>
              <div style={{ width:28, height:28, borderRadius:7, background:'linear-gradient(135deg,var(--accent),var(--pink))', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'white', fontSize:'0.85rem', boxShadow:'0 2px 8px rgba(99,102,241,0.4)' }}>F</div>
              <span style={{ fontWeight:700, fontSize:'0.95rem', letterSpacing:'-0.02em' }}>Fit<span style={{ color:'var(--accent)' }}>AI</span></span>
            </div>
            <p style={{ color:'var(--text3)', fontSize:'0.85rem', lineHeight:1.7, maxWidth:200 }}>
              AI-powered fitness & diet recommendations built around your goals.
            </p>
          </div>

          <div>
            <div style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--text3)', marginBottom:'0.85rem' }}>Product</div>
            {[['/', 'Home'], ['/dashboard', 'Dashboard'], ['/goal', 'Goal Planner'], ['/pricing', 'Pricing']].map(([to, label]) => (
              <Link key={to} to={to} style={{ display:'block', color:'var(--text2)', fontSize:'0.875rem', marginBottom:'0.4rem', transition:'color 0.15s' }}
                onMouseEnter={e => e.target.style.color='var(--text)'}
                onMouseLeave={e => e.target.style.color='var(--text2)'}>
                {label}
              </Link>
            ))}
          </div>

          <div>
            <div style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--text3)', marginBottom:'0.85rem' }}>Features</div>
            {['BMI Calculator', 'Diet Plans', 'Workout Plans', 'Goal Tracker', 'AI Coach', 'Progress Charts'].map(f => (
              <div key={f} style={{ color:'var(--text3)', fontSize:'0.875rem', marginBottom:'0.4rem' }}>{f}</div>
            ))}
          </div>
        </div>

        <div style={{ borderTop:'1px solid var(--border)', paddingTop:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'0.75rem' }}>
          <p style={{ color:'var(--text3)', fontSize:'0.82rem' }}>© {new Date().getFullYear()} FitAI. Made for your health.</p>
          <p style={{ color:'var(--text3)', fontSize:'0.78rem' }}>Payments by Stripe · Test mode</p>
        </div>
      </div>
    </footer>
  );
}
