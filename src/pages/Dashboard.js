import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRecommend } from '../context/RecommendContext';
import BMIGauge from '../components/common/BMIGauge';
import Loader   from '../components/common/Loader';

const feedbackColors = { success:'var(--green)', warning:'var(--yellow)', danger:'var(--red)', info:'var(--blue)' };
const feedbackBg     = { success:'rgba(34,197,94,0.08)', warning:'rgba(245,158,11,0.08)', danger:'rgba(239,68,68,0.08)', info:'rgba(59,130,246,0.08)' };
const feedbackBorder = { success:'rgba(34,197,94,0.2)',  warning:'rgba(245,158,11,0.2)',  danger:'rgba(239,68,68,0.2)',  info:'rgba(59,130,246,0.2)'  };

export default function Dashboard() {
  const { user }  = useAuth();
  const { result, form, setForm, loading, error, fetchRecommendation } = useRecommend();
  const resultRef = React.useRef(null);

  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceField,  setVoiceField]  = useState(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handlePrefChange = e => setForm(f => ({ ...f, preferences: { ...f.preferences, diet: e.target.value } }));

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetchRecommendation(form);
    if (res) setTimeout(() => resultRef.current?.scrollIntoView({ behavior:'smooth', block:'start' }), 100);
  };

  const startVoice = (fieldName) => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input not supported in this browser. Try Chrome.'); return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'en-US'; recognition.interimResults = false;
    setVoiceActive(true); setVoiceField(fieldName);
    recognition.onresult = e => {
      const t = e.results[0][0].transcript.replace(/[^0-9.]/g, '');
      setForm(f => ({ ...f, [fieldName]: t }));
      setVoiceActive(false); setVoiceField(null);
    };
    recognition.onerror = recognition.onend = () => { setVoiceActive(false); setVoiceField(null); };
    recognition.start();
  };

  const speakTip = text => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95; window.speechSynthesis.speak(u);
    }
  };

  const inputRow = (label, name, placeholder, min, max, step='1') => (
    <div>
      <label>{label}</label>
      <div style={{ display:'flex', gap:'0.4rem' }}>
        <input type="number" name={name} placeholder={placeholder}
          value={form[name] || ''} onChange={handleChange}
          min={min} max={max} step={step} required />
        <button type="button" onClick={() => startVoice(name)} title="Voice input"
          style={{ flexShrink:0, width:38, height:38, border:'1px solid var(--border2)', borderRadius:'var(--radius-sm)', background: voiceField===name && voiceActive ? 'rgba(239,68,68,0.15)' : 'var(--surface2)', cursor:'pointer', fontSize:'1rem' }}>
          {voiceField===name && voiceActive ? '🔴' : '🎙️'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop:80, minHeight:'100vh', padding:'5.5rem 0 4rem' }}>
      <div className="container">
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:'2rem' }}>
          <h1 style={{ fontSize:'clamp(1.6rem,4vw,2.4rem)', fontWeight:700, letterSpacing:'-0.03em', marginBottom:'0.4rem' }}>
            {user ? `Hey ${user.name.split(' ')[0]}, ` : ''}<span className="gradient-text">Get Your Plan</span>
          </h1>
          <p style={{ color:'var(--text2)', fontSize:'0.95rem' }}>Fill in your details for instant AI-powered recommendations.</p>
          {!user && (
            <div style={{ marginTop:'0.75rem', padding:'0.65rem 1rem', background:'var(--glow)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:'var(--radius)', fontSize:'0.85rem', color:'var(--accent)' }}>
              💡 <Link to="/signup" style={{ color:'var(--accent)', fontWeight:600 }}>Sign up</Link> to save results and unlock Pro features.
            </div>
          )}
        </motion.div>

        {/* Form */}
        <motion.form initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}
          onSubmit={handleSubmit}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1rem', marginBottom:'1rem' }}>
            <div className="card" style={{ padding:'1rem' }}>{inputRow('Age (years)','age','e.g. 28',10,120)}</div>
            <div className="card" style={{ padding:'1rem' }}>{inputRow('Weight (kg)','weight','e.g. 70',20,500,'0.1')}</div>
            <div className="card" style={{ padding:'1rem' }}>{inputRow('Height (cm)','height','e.g. 175',50,280,'0.1')}</div>
            <div className="card" style={{ padding:'1rem' }}>
              <label>Gender</label>
              <select name="gender" value={form.gender||'male'} onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="card" style={{ padding:'1rem' }}>
              <label>Activity Level</label>
              <select name="activityLevel" value={form.activityLevel||'moderate'} onChange={handleChange}>
                <option value="sedentary">Sedentary — little/no exercise</option>
                <option value="light">Light — 1–3 days/week</option>
                <option value="moderate">Moderate — 3–5 days/week</option>
                <option value="active">Active — 6–7 days/week</option>
                <option value="very_active">Very Active — twice daily</option>
              </select>
            </div>
            <div className="card" style={{ padding:'1rem' }}>
              <label>Fitness Goal</label>
              <select name="goal" value={form.goal||''} onChange={handleChange}>
                <option value="">🤖 Auto-detect from BMI</option>
                <option value="weight_loss">📉 Lose Weight</option>
                <option value="weight_gain">📈 Gain Weight</option>
                <option value="maintain">⚖️ Maintain Weight</option>
              </select>
            </div>
            <div className="card" style={{ padding:'1rem' }}>
              <label>Experience Level</label>
              <select name="experienceLevel" value={form.experienceLevel||'beginner'} onChange={handleChange}>
                <option value="beginner">Beginner (0–6 months)</option>
                <option value="intermediate">Intermediate (6m–2 years)</option>
                <option value="advanced">Advanced (2+ years)</option>
              </select>
            </div>
            <div className="card" style={{ padding:'1rem' }}>
              <label>Diet Preference</label>
              <select value={form.preferences?.diet||'both'} onChange={handlePrefChange}>
                <option value="both">No Preference</option>
                <option value="veg">Vegetarian / Vegan</option>
                <option value="non-veg">Non-Vegetarian</option>
              </select>
            </div>
            <div className="card" style={{ padding:'1rem' }}>
              <label>Injuries (optional)</label>
              <input name="injuries" placeholder="e.g. knee, back" value={form.injuries||''} onChange={handleChange} />
            </div>
          </div>

          {voiceActive && (
            <div style={{ padding:'0.65rem 1rem', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'var(--radius)', marginBottom:'1rem', fontSize:'0.85rem', color:'var(--red)', display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <span>🔴</span> Listening for {voiceField}… speak now.
            </div>
          )}
          {error && (
            <div style={{ padding:'0.65rem 1rem', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'var(--radius)', marginBottom:'1rem', fontSize:'0.85rem', color:'var(--red)' }}>{error}</div>
          )}

          <motion.button type="submit" className="btn btn-primary" disabled={loading}
            whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }}
            style={{ padding:'0.75rem 2rem', fontSize:'0.95rem' }}>
            {loading ? 'Analysing…' : '🧠 Generate My Recommendations →'}
          </motion.button>
        </motion.form>

        {/* Loading */}
        {loading && <div style={{ marginTop:'2rem' }}><Loader text="Building your personalised plan…" /></div>}

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div ref={resultRef} initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} style={{ marginTop:'2.5rem' }}>

              {/* Summary strip */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:'0.85rem', marginBottom:'1.5rem' }}>
                {[
                  { label:'BMI',           value:result.summary.bmi,                   sub:result.summary.bmiCategory },
                  { label:'Daily Calories',value:result.summary.calorieTarget+' kcal', sub:'target' },
                  { label:'BMR',           value:result.summary.bmr+' kcal',           sub:'base metabolic rate' },
                  { label:'TDEE',          value:result.summary.tdee+' kcal',          sub:'maintenance' },
                  { label:'Hydration',     value:result.summary.hydrationGoal+'L',     sub:'daily water' },
                  { label:'Ideal Weight',  value:`${result.summary.idealWeightRange.min}–${result.summary.idealWeightRange.max}kg`, sub:'healthy range' },
                ].map(s => (
                  <div key={s.label} className="card" style={{ textAlign:'center', padding:'0.9rem' }}>
                    <div style={{ fontSize:'0.7rem', color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.25rem' }}>{s.label}</div>
                    <div style={{ fontWeight:700, fontSize:'1.05rem', letterSpacing:'-0.02em' }}>{s.value}</div>
                    <div style={{ fontSize:'0.72rem', color:'var(--text3)', marginTop:'0.15rem' }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* BMI gauge */}
              <div className="card" style={{ marginBottom:'1.5rem' }}>
                <h3 style={{ fontWeight:700, fontSize:'0.95rem', marginBottom:'0.4rem' }}>BMI Analysis</h3>
                <p style={{ color:'var(--text2)', fontSize:'0.85rem', marginBottom:'0.75rem' }}>
                  Goal: <strong style={{ color:'var(--accent)' }}>{result.summary.inferredGoal.replace('_',' ').toUpperCase()}</strong>
                </p>
                <BMIGauge bmi={result.summary.bmi} category={result.summary.bmiCategory} />
              </div>

              {/* Diet preview */}
              <div className="card" style={{ marginBottom:'1.25rem' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem', flexWrap:'wrap', gap:'0.5rem' }}>
                  <h3 style={{ fontWeight:700, fontSize:'0.95rem' }}>🥗 {result.diet.title}</h3>
                  <Link to="/diet" className="btn btn-outline" style={{ padding:'0.35rem 0.85rem', fontSize:'0.82rem' }}>Full Plan →</Link>
                </div>
                <p style={{ color:'var(--text2)', fontSize:'0.88rem', marginBottom:'1rem' }}>{result.diet.description}</p>
                <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1rem', flexWrap:'wrap' }}>
                  {Object.entries(result.diet.macros).map(([k,v]) => (
                    <div key={k} style={{ background:'var(--surface2)', borderRadius:'var(--radius-sm)', padding:'0.4rem 0.8rem', textAlign:'center' }}>
                      <div style={{ fontSize:'0.7rem', color:'var(--text3)', textTransform:'capitalize' }}>{k}</div>
                      <div style={{ fontWeight:700, fontSize:'0.9rem', color:'var(--accent)' }}>{v}</div>
                    </div>
                  ))}
                </div>
                {/* Meal cards */}
                {result.diet.meals?.slice(0,3).map((meal,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.6rem 0', borderBottom:'1px solid var(--border)' }}>
                    <img src={meal.image} alt={meal.name} style={{ width:44, height:44, borderRadius:8, objectFit:'cover', flexShrink:0 }} onError={e=>e.target.style.display='none'} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:'0.88rem' }}>{meal.name}</div>
                      <div style={{ fontSize:'0.78rem', color:'var(--text3)' }}>{meal.calories} kcal · P:{meal.protein}g · C:{meal.carbs}g · F:{meal.fats}g</div>
                    </div>
                    <span className="badge badge-blue" style={{ fontSize:'0.7rem' }}>{meal.type}</span>
                  </div>
                ))}
                {result.diet.tips?.map(tip => (
                  <div key={tip} style={{ display:'flex', gap:'0.4rem', fontSize:'0.85rem', color:'var(--text2)', marginTop:'0.5rem' }}>
                    <span style={{ color:'var(--green)' }}>✓</span>{tip}
                  </div>
                ))}
              </div>

              {/* Workout preview */}
              <div className="card" style={{ marginBottom:'1.25rem' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem', flexWrap:'wrap', gap:'0.5rem' }}>
                  <h3 style={{ fontWeight:700, fontSize:'0.95rem' }}>💪 {result.workout.title}</h3>
                  <Link to="/workout" className="btn btn-outline" style={{ padding:'0.35rem 0.85rem', fontSize:'0.82rem' }}>Full Plan →</Link>
                </div>
                <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1rem', flexWrap:'wrap' }}>
                  <span className="badge badge-blue">{result.workout.frequency}</span>
                  <span className="badge badge-purple">{result.workout.focus}</span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'0.65rem' }}>
                  {result.workout.exercises.slice(0,6).map((ex,i) => (
                    <div key={i} style={{ background:'var(--surface2)', borderRadius:'var(--radius)', padding:'0.75rem' }}>
                      <div style={{ fontWeight:600, fontSize:'0.88rem', marginBottom:'0.2rem' }}>{ex.name}</div>
                      <div style={{ fontSize:'0.78rem', color:'var(--text2)' }}>
                        {ex.sets && `${ex.sets}×`}{ex.reps}{ex.duration && ex.duration}
                      </div>
                      <div style={{ display:'flex', gap:'0.3rem', marginTop:'0.3rem', flexWrap:'wrap' }}>
                        <span className="badge badge-purple" style={{ fontSize:'0.68rem' }}>{ex.type}</span>
                        <span className={`badge badge-${ex.difficulty==='Easy'?'green':ex.difficulty==='Hard'?'red':'yellow'}`} style={{ fontSize:'0.68rem' }}>{ex.difficulty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voice coach — Pro */}
              {result.voiceCoachTip && (
                <div className="card" style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(236,72,153,0.06))', border:'1px solid rgba(99,102,241,0.2)', marginBottom:'1.25rem' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.6rem' }}>
                        <span>🎙️</span><span style={{ fontWeight:700, fontSize:'0.9rem' }}>Voice Coach</span>
                        <span className="badge badge-purple">Pro</span>
                      </div>
                      <p style={{ color:'var(--text2)', fontSize:'0.88rem', lineHeight:1.65 }}>{result.voiceCoachTip}</p>
                    </div>
                    <button onClick={() => speakTip(result.voiceCoachTip)} className="btn btn-primary" style={{ padding:'0.5rem 1rem', fontSize:'0.85rem', flexShrink:0 }}>▶ Play</button>
                  </div>
                </div>
              )}

              {/* Upgrade CTA */}
              {!user?.isPro && (
                <div style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(236,72,153,0.06))', border:'1px solid rgba(99,102,241,0.2)', borderRadius:'var(--radius-lg)', padding:'1.5rem', textAlign:'center' }}>
                  <div style={{ fontSize:'1.75rem', marginBottom:'0.5rem' }}>⚡</div>
                  <h3 style={{ fontWeight:700, marginBottom:'0.4rem', fontSize:'1rem' }}>Unlock the Full Pro Plan</h3>
                  <p style={{ color:'var(--text2)', marginBottom:'1rem', fontSize:'0.88rem' }}>7-day meal plans with photos, weekly workout schedules, progress charts & AI coach.</p>
                  <Link to="/pricing" className="btn btn-primary" style={{ padding:'0.65rem 1.75rem' }}>See Pro Plans →</Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
