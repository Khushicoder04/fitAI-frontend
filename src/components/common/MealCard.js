import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FALLBACKS = {
  breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f10a081a?w=400&q=80',
  lunch:     'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
  dinner:    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80',
  snack:     'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
};

const ICONS = { breakfast:'🌅', lunch:'☀️', dinner:'🌙', snack:'🍎' };

export default function MealCard({ mealType = 'lunch', meal, isPro = false }) {
  const [imgError, setImgError] = useState(false);
  const icon = ICONS[mealType] || '🍽️';

  // meal can be either { meal, calories, protein } or { name, calories, protein, carbs, fats, image }
  const mealName  = meal?.meal  || meal?.name  || '—';
  const calories  = meal?.calories || null;
  const protein   = meal?.protein  || null;
  const imgSrc    = (!imgError && meal?.image) ? meal.image : FALLBACKS[mealType];

  const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent('how to make '+mealName+' healthy recipe')}`;

  return (
    <motion.div
      initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} whileHover={{ y:-3 }}
      style={{
        background:'var(--surface)', border:'1px solid var(--border)',
        borderRadius:'var(--radius-lg)', overflow:'hidden',
        boxShadow:'var(--shadow-sm)', transition:'box-shadow 0.2s',
      }}
      onMouseEnter={e=>e.currentTarget.style.boxShadow='var(--shadow)'}
      onMouseLeave={e=>e.currentTarget.style.boxShadow='var(--shadow-sm)'}
    >
      {/* Image */}
      <div style={{ height:130, overflow:'hidden', position:'relative' }}>
        <img src={imgSrc} alt={mealName}
          onError={() => setImgError(true)}
          style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.3s' }}
          onMouseEnter={e=>e.target.style.transform='scale(1.05)'}
          onMouseLeave={e=>e.target.style.transform='scale(1)'}
        />
        <div style={{
          position:'absolute', top:7, left:7,
          background:'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)',
          padding:'0.18rem 0.55rem', borderRadius:7,
          fontSize:'0.75rem', fontWeight:700, color:'white',
        }}>
          {icon} {mealType.charAt(0).toUpperCase()+mealType.slice(1)}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:'0.85rem' }}>
        <p style={{ fontSize:'0.85rem', fontWeight:600, lineHeight:1.5, marginBottom:'0.5rem' }}>{mealName}</p>
        <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap', marginBottom:'0.5rem' }}>
          {calories && <span className="badge badge-yellow">{calories} kcal</span>}
          {protein  && <span className="badge badge-blue">{protein} protein</span>}
          {meal?.carbs && <span className="badge badge-green">{meal.carbs}g carbs</span>}
        </div>
        {/* YouTube cooking link — Pro only */}
        {isPro ? (
          <a href={ytUrl} target="_blank" rel="noopener noreferrer"
            style={{ display:'flex', alignItems:'center', gap:'0.3rem', fontSize:'0.73rem', color:'#ef4444', fontWeight:600, textDecoration:'none' }}>
            ▶ Cooking tutorial
          </a>
        ) : (
          <div style={{ fontSize:'0.72rem', color:'var(--text3)' }}>
            ⚡ <span style={{ color:'var(--accent)' }}>Pro</span> cooking tutorials
          </div>
        )}
      </div>
    </motion.div>
  );
}
