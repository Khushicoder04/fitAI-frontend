import React, { useEffect, useState } from 'react';

const CATEGORIES = [
  { label:'Underweight', max:18.5, color:'#3b82f6' },
  { label:'Normal',      max:25,   color:'#22c55e' },
  { label:'Overweight',  max:30,   color:'#f59e0b' },
  { label:'Obese',       max:45,   color:'#ef4444' },
];

const getColor = (bmi) => {
  if (bmi < 18.5) return '#3b82f6';
  if (bmi < 25)   return '#22c55e';
  if (bmi < 30)   return '#f59e0b';
  return '#ef4444';
};

export default function BMIGauge({ bmi, category }) {
  const [animated, setAnimated] = useState(0);
  const clampedBmi = Math.min(Math.max(bmi || 0, 10), 45);
  const pct = ((clampedBmi - 10) / 35) * 100;
  const color = getColor(bmi);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(pct), 150);
    return () => clearTimeout(timer);
  }, [pct]);

  return (
    <div style={{ padding:'0.5rem 0' }}>
      {/* Track */}
      <div style={{ position:'relative', height:10, background:'var(--surface3)', borderRadius:99, overflow:'visible', marginBottom:'0.5rem' }}>
        {/* Gradient fill */}
        <div style={{ position:'absolute', inset:0, borderRadius:99, background:'linear-gradient(to right, #3b82f6 0%, #22c55e 37%, #f59e0b 63%, #ef4444 100%)' }} />
        {/* Indicator */}
        <div style={{
          position:'absolute', top:'50%', left:`${animated}%`,
          transform:'translate(-50%,-50%)',
          width:20, height:20, borderRadius:'50%',
          background:color,
          border:'3px solid var(--surface)',
          boxShadow:`0 0 0 2px ${color}, 0 2px 8px rgba(0,0,0,0.4)`,
          transition:'left 0.8s cubic-bezier(.34,1.56,.64,1)',
          zIndex:2,
        }} />
      </div>

      {/* Scale labels */}
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'var(--text3)', marginBottom:'1rem' }}>
        <span>10</span><span>18.5</span><span>25</span><span>30</span><span>45</span>
      </div>

      {/* Category chips */}
      <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'1rem' }}>
        {CATEGORIES.map(c => (
          <div key={c.label} style={{
            padding:'0.2rem 0.65rem', borderRadius:99, fontSize:'0.72rem', fontWeight:600,
            background: category === c.label ? `${c.color}22` : 'var(--surface2)',
            color:      category === c.label ? c.color         : 'var(--text3)',
            border:     category === c.label ? `1px solid ${c.color}44` : '1px solid var(--border)',
            transition:'all 0.2s',
          }}>
            {c.label}
          </div>
        ))}
      </div>

      {/* BMI value */}
      <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
        <div>
          <div style={{ fontWeight:800, fontSize:'2.2rem', color, letterSpacing:'-0.04em', lineHeight:1 }}>{bmi}</div>
          <div style={{ fontSize:'0.75rem', color:'var(--text3)', marginTop:'0.2rem' }}>BMI score</div>
        </div>
        <div style={{ flex:1, height:1, background:'var(--border)' }} />
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:'0.78rem', color:'var(--text3)' }}>Category</div>
          <div style={{ fontWeight:700, color, fontSize:'0.95rem' }}>{category}</div>
        </div>
      </div>
    </div>
  );
}
