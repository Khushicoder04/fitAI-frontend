import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Loader   from '../components/common/Loader';
import ProBadge from '../components/common/ProBadge';

const feedbackStyle = {
  success: { bg:'rgba(34,197,94,0.08)',  border:'rgba(34,197,94,0.2)',  color:'var(--green)'  },
  warning: { bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.2)', color:'var(--yellow)' },
  danger:  { bg:'rgba(239,68,68,0.08)',  border:'rgba(239,68,68,0.2)',  color:'var(--red)'    },
  info:    { bg:'rgba(59,130,246,0.08)', border:'rgba(59,130,246,0.2)', color:'var(--blue)'   },
};

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [progress,  setProgress]  = useState([]);
  const [feedback,  setFeedback]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [logForm,   setLogForm]   = useState({ weight:'', notes:'', metrics:{ workoutDone:false, waterIntake:'', sleepHours:'', caloriesConsumed:'' } });
  const [logging,   setLogging]   = useState(false);
  const [logMsg,    setLogMsg]    = useState('');
  const [editMode,  setEditMode]  = useState(false);
  const [profileForm, setProfileForm] = useState({ name:user?.name||'', profile:{ age:user?.profile?.age||'', weight:user?.profile?.weight||'', height:user?.profile?.height||'', activityLevel:user?.profile?.activityLevel||'', gender:user?.profile?.gender||'' } });
  const [saving,    setSaving]    = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const loadProgress = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/progress');
      setProgress([...data.data].reverse());
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { loadProgress(); }, [loadProgress]);

  const handleLog = async e => {
    e.preventDefault();
    setLogging(true); setLogMsg('');
    try {
      const { data } = await api.post('/progress', {
        weight: logForm.weight,
        notes:  logForm.notes,
        metrics:{ ...logForm.metrics, waterIntake:Number(logForm.metrics.waterIntake)||null, sleepHours:Number(logForm.metrics.sleepHours)||null, caloriesConsumed:Number(logForm.metrics.caloriesConsumed)||null },
      });
      setFeedback(data.feedback || []);
      setLogMsg('✅ Progress saved!');
      setLogForm({ weight:'', notes:'', metrics:{ workoutDone:false, waterIntake:'', sleepHours:'', caloriesConsumed:'' } });
      await loadProgress();
      await refreshUser();
    } catch (err) {
      setLogMsg('❌ '+(err.response?.data?.message||'Failed to save.'));
    } finally { setLogging(false); }
  };

  const handleSaveProfile = async e => {
    e.preventDefault(); setSaving(true);
    try { await api.put('/user/profile', profileForm); await refreshUser(); setEditMode(false); }
    catch {} finally { setSaving(false); }
  };

  const chartData = progress.map(p => ({
    date:   new Date(p.date).toLocaleDateString('en-US',{ month:'short', day:'numeric' }),
    weight: p.weight,
    bmi:    p.bmi,
    sleep:  p.metrics?.sleepHours || null,
    calories: p.metrics?.caloriesConsumed || null,
  }));

  const latest       = progress.length ? progress[progress.length-1] : null;
  const startWeight  = progress.length ? progress[0].weight : null;
  const weightChange = latest && startWeight ? (latest.weight - startWeight).toFixed(1) : null;

  return (
    <div style={{ paddingTop:80, minHeight:'100vh', padding:'5.5rem 0 4rem' }}>
      <div className="container">
        <motion.div initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} style={{ marginBottom:'2rem' }}>
          <h1 style={{ fontSize:'clamp(1.6rem,4vw,2.4rem)', fontWeight:700, letterSpacing:'-0.03em', marginBottom:'0.4rem' }}>
            👤 <span className="gradient-text">Your Profile</span>
          </h1>
          <p style={{ color:'var(--text2)', fontSize:'0.95rem' }}>Track progress, log your daily metrics, and see AI health feedback.</p>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1.25rem', marginBottom:'1.5rem' }}>
          {/* Profile card */}
          <div className="card">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
              <h2 style={{ fontWeight:700, fontSize:'0.95rem' }}>Account</h2>
              <button onClick={() => setEditMode(e => !e)} className="btn btn-outline" style={{ padding:'0.35rem 0.75rem', fontSize:'0.8rem' }}>
                {editMode ? 'Cancel' : '✏️ Edit'}
              </button>
            </div>
            {editMode ? (
              <form onSubmit={handleSaveProfile} style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
                <div><label>Name</label><input value={profileForm.name} onChange={e=>setProfileForm(f=>({...f,name:e.target.value}))} /></div>
                <div><label>Age</label><input type="number" value={profileForm.profile.age} onChange={e=>setProfileForm(f=>({...f,profile:{...f.profile,age:e.target.value}}))} /></div>
                <div><label>Weight (kg)</label><input type="number" step="0.1" value={profileForm.profile.weight} onChange={e=>setProfileForm(f=>({...f,profile:{...f.profile,weight:e.target.value}}))} /></div>
                <div><label>Height (cm)</label><input type="number" step="0.1" value={profileForm.profile.height} onChange={e=>setProfileForm(f=>({...f,profile:{...f.profile,height:e.target.value}}))} /></div>
                <div><label>Activity Level</label>
                  <select value={profileForm.profile.activityLevel} onChange={e=>setProfileForm(f=>({...f,profile:{...f.profile,activityLevel:e.target.value}}))}>
                    <option value="">Select…</option>
                    {['sedentary','light','moderate','active','very_active'].map(v=><option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving…':'Save Changes'}</button>
              </form>
            ) : (
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.85rem', marginBottom:'1rem' }}>
                  <div style={{ width:48,height:48,borderRadius:'50%',background:'linear-gradient(135deg,var(--accent),var(--pink))',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'white',fontSize:'1.3rem',boxShadow:'0 3px 12px rgba(99,102,241,0.35)' }}>
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight:700 }}>{user?.name}</div>
                    <div style={{ fontSize:'0.8rem', color:'var(--text3)' }}>{user?.email}</div>
                  </div>
                  {user?.isPro && <span className="badge badge-purple" style={{ marginLeft:'auto' }}>⚡ Pro</span>}
                </div>
                {[['Age',user?.profile?.age?`${user.profile.age}y`:'—'],['Weight',user?.profile?.weight?`${user.profile.weight}kg`:'—'],['Height',user?.profile?.height?`${user.profile.height}cm`:'—'],['Activity',user?.profile?.activityLevel||'—'],['Goal',user?.fitnessGoal?.replace('_',' ')||'—']].map(([k,v])=>(
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'0.45rem 0', borderBottom:'1px solid var(--border)', fontSize:'0.88rem' }}>
                    <span style={{ color:'var(--text3)', fontWeight:600 }}>{k}</span>
                    <span style={{ textTransform:'capitalize' }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {[
              { label:'Entries Logged', value:progress.length,    icon:'📊', color:'var(--accent)' },
              { label:'Current Weight', value:latest?`${latest.weight}kg`:'—', icon:'⚖️', color:'var(--blue)' },
              { label:'Weight Change',  value:weightChange!=null?`${weightChange>0?'+':''}${weightChange}kg`:'—', icon:weightChange>0?'📈':'📉', color:weightChange>0?'var(--green)':'var(--red)' },
              { label:'Plan',           value:user?.isPro?'Pro ⚡':'Free', icon:'🏅', color:user?.isPro?'var(--accent)':'var(--text3)' },
            ].map(s=>(
              <div key={s.label} className="card" style={{ display:'flex',alignItems:'center',gap:'0.85rem',padding:'0.9rem 1.1rem' }}>
                <span style={{ fontSize:'1.6rem' }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize:'0.72rem',color:'var(--text3)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.04em' }}>{s.label}</div>
                  <div style={{ fontWeight:700,fontSize:'1.1rem',color:s.color,letterSpacing:'-0.02em' }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Log form */}
        <div className="card" style={{ marginBottom:'1.5rem' }}>
          <h2 style={{ fontWeight:700, fontSize:'0.95rem', marginBottom:'1rem' }}>📝 Log Today</h2>
          <form onSubmit={handleLog}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:'0.85rem', marginBottom:'0.85rem' }}>
              <div><label>Weight (kg) *</label><input type="number" step="0.1" placeholder="72.5" value={logForm.weight} onChange={e=>setLogForm(f=>({...f,weight:e.target.value}))} required /></div>
              <div><label>Sleep (hours)</label><input type="number" step="0.5" placeholder="7.5" value={logForm.metrics.sleepHours} onChange={e=>setLogForm(f=>({...f,metrics:{...f.metrics,sleepHours:e.target.value}}))} /></div>
              <div><label>Calories consumed</label><input type="number" placeholder="1800" value={logForm.metrics.caloriesConsumed} onChange={e=>setLogForm(f=>({...f,metrics:{...f.metrics,caloriesConsumed:e.target.value}}))} /></div>
              <div><label>Water (L)</label><input type="number" step="0.1" placeholder="2.5" value={logForm.metrics.waterIntake} onChange={e=>setLogForm(f=>({...f,metrics:{...f.metrics,waterIntake:e.target.value}}))} /></div>
            </div>
            <div style={{ marginBottom:'0.85rem' }}><label>Notes</label><input placeholder="How are you feeling today?" value={logForm.notes} onChange={e=>setLogForm(f=>({...f,notes:e.target.value}))} /></div>
            <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
              <label style={{ display:'flex',alignItems:'center',gap:'0.4rem',cursor:'pointer',textTransform:'none',fontWeight:500,fontSize:'0.88rem',color:'var(--text2)' }}>
                <input type="checkbox" style={{ width:'auto' }} checked={logForm.metrics.workoutDone} onChange={e=>setLogForm(f=>({...f,metrics:{...f.metrics,workoutDone:e.target.checked}}))} />
                Workout done today
              </label>
              <button type="submit" className="btn btn-primary" disabled={logging} style={{ padding:'0.55rem 1.25rem', fontSize:'0.88rem' }}>
                {logging ? 'Saving…' : '✓ Log Progress'}
              </button>
              {logMsg && <span style={{ fontSize:'0.85rem', color:logMsg.startsWith('✅')?'var(--green)':'var(--red)' }}>{logMsg}</span>}
            </div>
          </form>
        </div>

        {/* AI Health Feedback */}
        <AnimatePresence>
          {feedback.length > 0 && (
            <motion.div initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }} style={{ marginBottom:'1.5rem' }}>
              <h2 style={{ fontWeight:700, fontSize:'0.95rem', marginBottom:'0.85rem' }}>🤖 AI Health Feedback</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.65rem' }}>
                {feedback.map((fb,i) => {
                  const s = feedbackStyle[fb.type] || feedbackStyle.info;
                  return (
                    <motion.div key={i} initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.07 }}
                      style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:'var(--radius)', padding:'0.85rem 1rem', display:'flex', gap:'0.75rem', alignItems:'flex-start' }}>
                      <span style={{ fontSize:'1.2rem', flexShrink:0 }}>{fb.icon}</span>
                      <div>
                        <div style={{ fontWeight:700, fontSize:'0.85rem', color:s.color, marginBottom:'0.2rem' }}>{fb.area}</div>
                        <div style={{ fontSize:'0.85rem', color:'var(--text2)', lineHeight:1.65 }}>{fb.message}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entry history */}
        <div className="card" style={{ marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: showHistory ? '1rem' : 0 }}>
            <h2 style={{ fontWeight:700, fontSize:'0.95rem' }}>📋 Entry History <span style={{ color:'var(--text3)', fontWeight:400 }}>({progress.length} entries)</span></h2>
            <button onClick={() => setShowHistory(s=>!s)} className="btn btn-outline" style={{ padding:'0.35rem 0.8rem', fontSize:'0.8rem' }}>
              {showHistory ? 'Hide' : 'View History'}
            </button>
          </div>
          <AnimatePresence>
            {showHistory && (
              <motion.div initial={{ opacity:0,height:0 }} animate={{ opacity:1,height:'auto' }} exit={{ opacity:0,height:0 }}>
                {loading ? <Loader /> : progress.length === 0 ? (
                  <p style={{ color:'var(--text3)', fontSize:'0.88rem', textAlign:'center', padding:'1rem' }}>No entries yet. Log your first progress above!</p>
                ) : (
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom:'1px solid var(--border)' }}>
                          {['Date','Weight','BMI','Sleep','Calories','Water','Workout','Notes'].map(h => (
                            <th key={h} style={{ padding:'0.5rem 0.75rem', textAlign:'left', color:'var(--text3)', fontWeight:600, fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.04em', whiteSpace:'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[...progress].reverse().map((p,i) => (
                          <tr key={p._id||i} style={{ borderBottom:'1px solid var(--border)' }}>
                            <td style={{ padding:'0.55rem 0.75rem', whiteSpace:'nowrap', color:'var(--text2)' }}>{new Date(p.date).toLocaleDateString('en-GB',{ day:'2-digit', month:'short', year:'numeric' })}</td>
                            <td style={{ padding:'0.55rem 0.75rem', fontWeight:600 }}>{p.weight}kg</td>
                            <td style={{ padding:'0.55rem 0.75rem' }}>{p.bmi}</td>
                            <td style={{ padding:'0.55rem 0.75rem' }}>{p.metrics?.sleepHours ? `${p.metrics.sleepHours}h` : '—'}</td>
                            <td style={{ padding:'0.55rem 0.75rem' }}>{p.metrics?.caloriesConsumed ? `${p.metrics.caloriesConsumed} kcal` : '—'}</td>
                            <td style={{ padding:'0.55rem 0.75rem' }}>{p.metrics?.waterIntake ? `${p.metrics.waterIntake}L` : '—'}</td>
                            <td style={{ padding:'0.55rem 0.75rem' }}>{p.metrics?.workoutDone ? '✅' : '—'}</td>
                            <td style={{ padding:'0.55rem 0.75rem', color:'var(--text3)', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.notes||'—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!user?.isPro && (
                      <p style={{ fontSize:'0.78rem', color:'var(--text3)', marginTop:'0.75rem', textAlign:'center' }}>Showing last 10 entries. <a href="/pricing" style={{ color:'var(--accent)' }}>Upgrade to Pro</a> for 30 entries.</p>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Charts — Pro only */}
        {user?.isPro ? (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.65rem', marginBottom:'1.25rem' }}>
              <h2 style={{ fontWeight:700, fontSize:'0.95rem' }}>Progress Charts</h2>
              <span className="badge badge-purple">⚡ Pro</span>
            </div>
            {chartData.length < 2 ? (
              <div className="card" style={{ textAlign:'center', padding:'2rem', color:'var(--text3)', fontSize:'0.88rem' }}>Log at least 2 entries to see charts.</div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1.25rem' }}>
                <div className="card">
                  <div style={{ fontWeight:700, fontSize:'0.88rem', marginBottom:'1rem' }}>⚖️ Weight Trend</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={chartData}>
                      <defs><linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="date" tick={{ fill:'var(--text3)', fontSize:10 }} />
                      <YAxis domain={['auto','auto']} tick={{ fill:'var(--text3)', fontSize:10 }} />
                      <Tooltip contentStyle={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, fontSize:12, boxShadow:'var(--shadow)' }} />
                      <Area type="monotone" dataKey="weight" stroke="#6366f1" fill="url(#wGrad)" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="card">
                  <div style={{ fontWeight:700, fontSize:'0.88rem', marginBottom:'1rem' }}>😴 Sleep Trend</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="date" tick={{ fill:'var(--text3)', fontSize:10 }} />
                      <YAxis domain={[0,12]} tick={{ fill:'var(--text3)', fontSize:10 }} />
                      <Tooltip contentStyle={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, fontSize:12, boxShadow:'var(--shadow)' }} />
                      <Line type="monotone" dataKey="sleep" stroke="#22c55e" strokeWidth={2} dot={{ fill:'#22c55e', r:3 }} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="card">
                  <div style={{ fontWeight:700, fontSize:'0.88rem', marginBottom:'1rem' }}>🔥 Calorie Trend</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={chartData}>
                      <defs><linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="date" tick={{ fill:'var(--text3)', fontSize:10 }} />
                      <YAxis domain={['auto','auto']} tick={{ fill:'var(--text3)', fontSize:10 }} />
                      <Tooltip contentStyle={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, fontSize:12, boxShadow:'var(--shadow)' }} />
                      <Area type="monotone" dataKey="calories" stroke="#f59e0b" fill="url(#cGrad)" strokeWidth={2} dot={false} connectNulls />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <ProBadge message="Upgrade to Pro for weight, sleep and calorie charts with unlimited progress history." />
        )}
      </div>
    </div>
  );
}
