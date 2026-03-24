import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Reliable exercise images by name keyword
const EXERCISE_IMAGES = {
  'squat':    ['https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80','https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400&q=80'],
  'push':     ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80','https://images.unsplash.com/photo-1616279969965-72b7a5e3a4d1?w=400&q=80'],
  'deadlift': ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80','https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80'],
  'bench':    ['https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80','https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80'],
  'plank':    ['https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&q=80','https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=400&q=80'],
  'lunge':    ['https://images.unsplash.com/photo-1534368420009-621bfab424a8?w=400&q=80','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80'],
  'run':      ['https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&q=80','https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&q=80'],
  'walk':     ['https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&q=80','https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&q=80'],
  'row':      ['https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80','https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80'],
  'pull':     ['https://images.unsplash.com/photo-1598971639058-fab3c3109a54?w=400&q=80','https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80'],
  'press':    ['https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80','https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80'],
  'curl':     ['https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80','https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80'],
  'burpee':   ['https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400&q=80','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80'],
  'hiit':     ['https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&q=80','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80'],
  'swim':     ['https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80','https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&q=80'],
  'cycl':     ['https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400&q=80','https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&q=80'],
  'yoga':     ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80'],
  'default':  ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80'],
};

const getImages = (name='') => {
  const n = name.toLowerCase();
  const key = Object.keys(EXERCISE_IMAGES).find(k => k !== 'default' && n.includes(k));
  return EXERCISE_IMAGES[key] || EXERCISE_IMAGES['default'];
};

const diffColor = { Easy:'var(--green)', Medium:'var(--yellow)', Hard:'var(--red)' };

export default function ExerciseCard({ exercise, isPro=false }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [imgErr, setImgErr] = useState(false);
  const { name='', sets, reps, duration, type='', musclesWorked=[], difficulty='Medium', caloriesPerMin } = exercise;
  const images = getImages(name);
  const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(name+' exercise tutorial')}`;

  return (
    <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} whileHover={{ y:-3 }}
      style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', overflow:'hidden', boxShadow:'var(--shadow-sm)', transition:'box-shadow 0.2s' }}
      onMouseEnter={e=>e.currentTarget.style.boxShadow='var(--shadow)'}
      onMouseLeave={e=>e.currentTarget.style.boxShadow='var(--shadow-sm)'}>

      {/* Image */}
      <div style={{ position:'relative', height:160, overflow:'hidden', background:'var(--surface2)' }}>
        {!imgErr ? (
          <img src={images[imgIdx]} alt={name}
            onError={()=>imgIdx < images.length-1 ? setImgIdx(i=>i+1) : setImgErr(true)}
            style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.3s' }}
            onMouseEnter={e=>e.target.style.transform='scale(1.04)'}
            onMouseLeave={e=>e.target.style.transform='scale(1)'}
          />
        ) : (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', fontSize:'2.5rem' }}>💪</div>
        )}
        {/* Difficulty badge */}
        <div style={{ position:'absolute', top:8, left:8, background:`${diffColor[difficulty]||'var(--accent)'}22`, color:diffColor[difficulty]||'var(--accent)', padding:'0.18rem 0.55rem', borderRadius:6, fontSize:'0.7rem', fontWeight:700, border:`1px solid ${diffColor[difficulty]||'var(--accent)'}44`, backdropFilter:'blur(4px)' }}>
          {difficulty}
        </div>
        {/* Image dots */}
        {images.length > 1 && !imgErr && (
          <div style={{ position:'absolute', bottom:6, left:'50%', transform:'translateX(-50%)', display:'flex', gap:4 }}>
            {images.map((_,i) => (
              <button key={i} onClick={()=>setImgIdx(i)}
                style={{ width:5, height:5, borderRadius:'50%', background:i===imgIdx?'white':'rgba(255,255,255,0.4)', border:'none', cursor:'pointer', padding:0 }} />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding:'0.9rem' }}>
        <div style={{ fontWeight:700, fontSize:'0.9rem', marginBottom:'0.3rem', letterSpacing:'-0.01em' }}>{name}</div>
        <div style={{ fontSize:'0.82rem', color:'var(--accent)', fontWeight:600, marginBottom:'0.45rem' }}>
          {sets && `${sets} sets`}{reps && ` × ${reps}`}{duration && ` · ${duration}`}
          {caloriesPerMin && <span style={{ color:'var(--yellow)', marginLeft:6 }}>🔥{caloriesPerMin}/min</span>}
        </div>
        <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap', marginBottom:'0.6rem' }}>
          <span className="badge badge-purple" style={{ fontSize:'0.68rem' }}>{type}</span>
          {(musclesWorked||[]).slice(0,2).map(m=><span key={m} className="badge badge-blue" style={{ fontSize:'0.68rem' }}>{m}</span>)}
        </div>
        {/* YouTube search — Pro only, opens search results not embed */}
        {isPro ? (
          <a href={ytSearchUrl} target="_blank" rel="noopener noreferrer"
            style={{ display:'flex', alignItems:'center', gap:'0.35rem', padding:'0.38rem 0.7rem', borderRadius:'var(--radius-sm)', background:'rgba(255,0,0,0.08)', border:'1px solid rgba(255,0,0,0.2)', color:'#ef4444', fontSize:'0.75rem', fontWeight:600, textDecoration:'none' }}>
            ▶ Search tutorials on YouTube
          </a>
        ) : (
          <div style={{ fontSize:'0.73rem', color:'var(--text3)' }}>
            ⚡ <span style={{ color:'var(--accent)' }}>Pro</span> — YouTube tutorials
          </div>
        )}
      </div>
    </motion.div>
  );
}
