import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth }      from '../context/AuthContext';
import { useRecommend } from '../context/RecommendContext';
import api         from '../utils/api';
import Loader      from '../components/common/Loader';
import ProBadge    from '../components/common/ProBadge';
import ExerciseCard from '../components/common/ExerciseCard';

const intensityColor = { High:'var(--red)', Medium:'var(--yellow)', Low:'var(--green)', None:'var(--text3)' };

export default function WorkoutPlan() {
  const { user }  = useAuth();
  const { result: ctxResult, form: ctxForm } = useRecommend();
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const [viewMode,  setViewMode]  = useState('grid');
  const [error,     setError]     = useState('');
  const [customForm, setCustomForm] = useState({ bodyType:'average', experienceLevel:'beginner', injuries:'' });
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    if (ctxResult) { setResult(ctxResult); return; }
    if (user?.profile?.weight && user?.profile?.height) fetchPlan();
  }, []);

  const fetchPlan = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/recommend', {
        age:            user?.profile?.age    || ctxForm?.age    || 25,
        weight:         user?.profile?.weight || ctxForm?.weight,
        height:         user?.profile?.height || ctxForm?.height,
        activityLevel:  user?.profile?.activityLevel || ctxForm?.activityLevel || 'moderate',
        goal:           user?.fitnessGoal    || ctxForm?.goal    || '',
        gender:         user?.profile?.gender || ctxForm?.gender || 'male',
        experienceLevel: customForm.experienceLevel,
        bodyType:        customForm.bodyType,
        injuries:        customForm.injuries ? customForm.injuries.split(',').map(s=>s.trim()).filter(Boolean) : [],
      });
      setResult(data.data);
    } catch {
      setError('Could not load workout plan. Please complete your profile on the Dashboard first.');
    } finally { setLoading(false); }
  };

  if (loading) return <div style={{ paddingTop:100 }}><Loader text="Building your custom workout plan…" /></div>;

  return (
    <div style={{ paddingTop:80, minHeight:'100vh', padding:'5.5rem 0 4rem' }}>
      <div className="container">
        <motion.div initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} style={{ marginBottom:'2rem' }}>
          <h1 style={{ fontSize:'clamp(1.6rem,4vw,2.4rem)', fontWeight:700, letterSpacing:'-0.03em', marginBottom:'0.4rem' }}>
            💪 <span className="gradient-text">Workout Plan</span>
          </h1>
          <p style={{ color:'var(--text2)', fontSize:'0.95rem' }}>Filtered by body type, experience level, and any injuries.</p>
        </motion.div>

        {/* Custom options */}
        <div className="card" style={{ marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }} onClick={()=>setShowCustom(s=>!s)}>
            <div>
              <div style={{ fontWeight:700, fontSize:'0.92rem' }}>🎯 Customise Plan</div>
              <div style={{ fontSize:'0.82rem', color:'var(--text2)', marginTop:'0.15rem' }}>
                Level: <strong style={{ color:'var(--accent)' }}>{customForm.experienceLevel}</strong> · Body: <strong style={{ color:'var(--accent)' }}>{customForm.bodyType}</strong>
                {customForm.injuries && ` · Injuries: ${customForm.injuries}`}
              </div>
            </div>
            <span style={{ color:'var(--accent)' }}>{showCustom?'▲':'▼'}</span>
          </div>
          {showCustom && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ marginTop:'1rem', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'0.85rem' }}>
              <div>
                <label>Body Type</label>
                <select value={customForm.bodyType} onChange={e=>setCustomForm(f=>({...f,bodyType:e.target.value}))}>
                  <option value="ectomorph">Ectomorph (Slim)</option>
                  <option value="mesomorph">Mesomorph (Athletic)</option>
                  <option value="endomorph">Endomorph (Stocky)</option>
                  <option value="average">Average / Not sure</option>
                </select>
              </div>
              <div>
                <label>Experience Level</label>
                <select value={customForm.experienceLevel} onChange={e=>setCustomForm(f=>({...f,experienceLevel:e.target.value}))}>
                  <option value="beginner">Beginner (0–6 months)</option>
                  <option value="intermediate">Intermediate (6m–2y)</option>
                  <option value="advanced">Advanced (2+ years)</option>
                </select>
              </div>
              <div>
                <label>Injuries / Limitations</label>
                <input placeholder="e.g. knee, back" value={customForm.injuries} onChange={e=>setCustomForm(f=>({...f,injuries:e.target.value}))} />
              </div>
              <div style={{ display:'flex', alignItems:'flex-end' }}>
                <button onClick={fetchPlan} className="btn btn-primary" style={{ width:'100%' }}>🔄 Update Plan</button>
              </div>
            </motion.div>
          )}
        </div>

        {error && (
          <div style={{ padding:'0.75rem 1rem', background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:'var(--radius)', marginBottom:'1.5rem', color:'var(--yellow)', fontSize:'0.88rem' }}>
            {error} <a href="/dashboard" style={{ color:'var(--accent)', fontWeight:600 }}>→ Dashboard</a>
          </div>
        )}

        {result && (
          <>
            {/* Basic plan */}
            <div className="card" style={{ marginBottom:'1.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.1rem', flexWrap:'wrap', gap:'0.75rem' }}>
                <div>
                  <h2 style={{ fontWeight:700, fontSize:'0.95rem', marginBottom:'0.3rem' }}>{result.workout.title}</h2>
                  <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
                    <span className="badge badge-blue">{result.workout.frequency}</span>
                    <span className="badge badge-purple">{result.workout.focus}</span>
                    <span className="badge badge-green">{customForm.experienceLevel}</span>
                  </div>
                </div>
                <div style={{ display:'flex', gap:'0.4rem' }}>
                  {['grid','list'].map(m=>(
                    <button key={m} onClick={()=>setViewMode(m)}
                      className={`btn ${viewMode===m?'btn-primary':'btn-outline'}`}
                      style={{ padding:'0.35rem 0.75rem', fontSize:'0.8rem' }}>
                      {m==='grid'?'⊞ Grid':'☰ List'}
                    </button>
                  ))}
                </div>
              </div>

              {viewMode === 'grid' ? (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1rem' }}>
                  {result.workout.exercises.map((ex,i) => <ExerciseCard key={i} exercise={ex} isPro={user?.isPro} />)}
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                  {result.workout.exercises.map((ex,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.65rem 0.85rem', background:'var(--surface2)', borderRadius:'var(--radius)', borderLeft:'3px solid var(--accent)' }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:600, fontSize:'0.88rem' }}>{ex.name}</div>
                        <div style={{ fontSize:'0.78rem', color:'var(--text2)' }}>
                          {ex.sets && `${ex.sets}×`}{ex.reps}{ex.duration && ex.duration}
                          {' '}<span className={`badge badge-${ex.difficulty==='Easy'?'green':ex.difficulty==='Hard'?'red':'yellow'}`} style={{ fontSize:'0.65rem' }}>{ex.difficulty}</span>
                        </div>
                      </div>
                      {user?.isPro && (
                        <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name+' exercise tutorial')}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{ padding:'0.3rem 0.65rem', borderRadius:'var(--radius-sm)', background:'rgba(255,0,0,0.08)', color:'#ef4444', border:'1px solid rgba(255,0,0,0.2)', fontSize:'0.75rem', fontWeight:600, whiteSpace:'nowrap' }}>
                          ▶ Watch
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pro weekly plan */}
            {user?.isPro && result.weeklyWorkoutPlan ? (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'1.25rem' }}>
                  <h2 style={{ fontWeight:700, fontSize:'0.95rem' }}>Weekly Schedule</h2>
                  <span className="badge badge-purple">⚡ Pro</span>
                </div>
                <div style={{ display:'flex', gap:'0.4rem', marginBottom:'1.25rem', overflowX:'auto', paddingBottom:'0.4rem' }}>
                  {result.weeklyWorkoutPlan.map((day,i) => (
                    <button key={day.day} onClick={()=>setActiveDay(i)}
                      style={{ padding:'0.4rem 0.75rem', borderRadius:'var(--radius-sm)', border:'1px solid', flexShrink:0, cursor:'pointer', fontSize:'0.8rem', fontWeight:600, transition:'all 0.15s',
                        borderColor:activeDay===i?'var(--accent)':'var(--border)',
                        background:activeDay===i?'var(--glow)':'transparent',
                        color:activeDay===i?'var(--accent)':'var(--text3)' }}>
                      {day.day.slice(0,3).toUpperCase()}
                      {day.calories_burned > 0 && <span style={{ display:'block', fontSize:'0.65rem' }}>🔥{day.calories_burned}</span>}
                    </button>
                  ))}
                </div>
                {result.weeklyWorkoutPlan[activeDay] && (() => {
                  const d = result.weeklyWorkoutPlan[activeDay];
                  const isRest = d.calories_burned === 0;
                  return (
                    <motion.div key={activeDay} initial={{ opacity:0,x:12 }} animate={{ opacity:1,x:0 }}>
                      <div className="card">
                        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem', flexWrap:'wrap' }}>
                          <h3 style={{ fontWeight:700, fontSize:'0.95rem' }}>{d.day} — {d.focus}</h3>
                          {!isRest && <><span className="badge badge-blue">⏱ {d.duration}</span><span className="badge badge-yellow">🔥 {d.calories_burned} cal</span></>}
                        </div>
                        {isRest ? (
                          <div style={{ textAlign:'center', padding:'2rem', color:'var(--text3)' }}>
                            <div style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>😴</div>
                            <p style={{ fontSize:'0.88rem' }}>{d.workout[0]?.exercise}</p>
                          </div>
                        ) : (
                          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                            {d.workout.map((ex,i) => (
                              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.6rem 0.85rem', background:'var(--surface2)', borderRadius:'var(--radius)' }}>
                                <span style={{ fontWeight:600, fontSize:'0.88rem' }}>{ex.exercise}</span>
                                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                                  <span style={{ fontSize:'0.82rem', color:'var(--accent)', fontWeight:600 }}>
                                    {ex.sets&&`${ex.sets}×${ex.reps||''}`}{ex.duration&&ex.duration}
                                  </span>
                                  <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.exercise+' tutorial')}`}
                                    target="_blank" rel="noopener noreferrer"
                                    style={{ fontSize:'0.72rem', color:'#ef4444', fontWeight:600 }}>▶</a>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })()}
              </motion.div>
            ) : !user?.isPro ? (
              <ProBadge message="Upgrade to Pro for the full 7-day weekly workout schedule with YouTube tutorial links." />
            ) : null}
          </>
        )}

        {!result && !loading && !error && (
          <div className="card" style={{ textAlign:'center', padding:'3rem' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'0.85rem' }}>💪</div>
            <h3 style={{ fontWeight:700, marginBottom:'0.4rem' }}>No plan yet</h3>
            <p style={{ color:'var(--text2)', marginBottom:'1.25rem', fontSize:'0.9rem' }}>Complete your assessment on the Dashboard first.</p>
            <a href="/dashboard" className="btn btn-primary">Go to Dashboard →</a>
          </div>
        )}
      </div>
    </div>
  );
}
