import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Loader from '../components/common/Loader';

const intensityColor = { High:'var(--red)', Medium:'var(--yellow)', Low:'var(--green)', None:'var(--text3)' };
const directionMeta  = {
  loss:     { emoji:'📉', label:'Weight Loss',    color:'var(--blue)',   bg:'rgba(59,130,246,0.08)'  },
  gain:     { emoji:'📈', label:'Weight Gain',    color:'var(--green)',  bg:'rgba(34,197,94,0.08)'   },
  maintain: { emoji:'⚖️', label:'Maintenance',    color:'var(--accent)', bg:'rgba(99,102,241,0.08)'  },
};

export default function GoalPlan() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    targetWeight: '',
    timeframeWeeks: 12,
    goalText: '',
    experienceLevel: 'beginner',
  });
  const [plan, setPlan]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [activeWeek, setActiveWeek] = useState(0);
  const [activeTab, setActiveTab]   = useState('overview');

  const currentWeight = user?.profile?.weight;
  const hasProfile    = currentWeight && user?.profile?.height && user?.profile?.age;

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/goal/plan', form);
      setPlan(data.data);
      setActiveWeek(0);
      setActiveTab('overview');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate plan.');
    } finally { setLoading(false); }
  };

  const chartData = plan?.weeklySummary?.map(w => ({
    week: `W${w.week}`,
    weight: w.projectedWeight,
    calories: w.dailyCalories,
    milestone: w.milestone ? w.milestone.emoji : null,
  })) || [];

  const meta = plan?.meta;
  const dm   = meta ? directionMeta[meta.direction] : null;
  const selectedWeek = plan?.weeklySummary?.[activeWeek];

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', padding: '5.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: 900 }}>

        {/* ── Header ── */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:'2rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.5rem' }}>
            <span style={{ fontSize:'1.5rem' }}>🎯</span>
            <h1 style={{ fontSize:'clamp(1.6rem,4vw,2.4rem)', fontWeight:700, letterSpacing:'-0.03em' }}>
              Goal-Based <span className="gradient-text">Adaptive Plan</span>
            </h1>
          </div>
          <p style={{ color:'var(--text2)', fontSize:'0.95rem' }}>
            Set a real target, get a week-by-week roadmap — calories, workouts & diet all adaptive.
          </p>
        </motion.div>

        {/* ── Form ── */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}
          className="card" style={{ marginBottom:'1.75rem', boxShadow:'var(--shadow)' }}>

          {!hasProfile && (
            <div style={{ padding:'0.75rem 1rem', background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:'var(--radius)', marginBottom:'1.25rem', fontSize:'0.88rem', color:'var(--yellow)' }}>
              ⚠️ Complete your profile (weight, height, age) on the{' '}
              <a href="/dashboard" style={{ color:'var(--accent)', fontWeight:600 }}>Dashboard</a> first.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', marginBottom:'1rem' }}>
              <div>
                <label>Current Weight</label>
                <input value={currentWeight ? `${currentWeight} kg` : '—'} disabled
                  style={{ opacity:0.55, cursor:'not-allowed' }} />
              </div>
              <div>
                <label>Target Weight (kg)</label>
                <input type="number" step="0.1" placeholder={currentWeight ? `e.g. ${Math.round(currentWeight*0.9)}` : 'e.g. 65'}
                  value={form.targetWeight} onChange={e => setForm(f=>({...f, targetWeight:e.target.value}))} required />
              </div>
              <div>
                <label>Timeframe (weeks)</label>
                <select value={form.timeframeWeeks} onChange={e => setForm(f=>({...f, timeframeWeeks:Number(e.target.value)}))}>
                  {[4,6,8,12,16,20,24,36,48,52].map(w =>
                    <option key={w} value={w}>{w} weeks ({Math.round(w/4.3)} months)</option>
                  )}
                </select>
              </div>
              <div>
                <label>Experience Level</label>
                <select value={form.experienceLevel} onChange={e => setForm(f=>({...f, experienceLevel:e.target.value}))}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom:'1.25rem' }}>
              <label>Describe your goal (optional)</label>
              <input placeholder='e.g. "I want to lose 10kg before my wedding in 3 months"'
                value={form.goalText} onChange={e => setForm(f=>({...f, goalText:e.target.value}))} />
            </div>
            {error && (
              <div style={{ padding:'0.7rem 0.9rem', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'var(--radius)', color:'var(--red)', fontSize:'0.88rem', marginBottom:'1rem' }}>{error}</div>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading || !hasProfile}
              style={{ padding:'0.7rem 2rem', fontSize:'0.95rem' }}>
              {loading ? 'Building your plan…' : '✦ Generate Adaptive Plan'}
            </button>
          </form>
        </motion.div>

        {/* ── Loading ── */}
        {loading && <Loader text="Calculating your personalised roadmap…" />}

        {/* ── Results ── */}
        <AnimatePresence>
          {plan && !loading && (
            <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>

              {/* Summary banner */}
              <div style={{ background: dm.bg, border:`1px solid ${dm.color}22`, borderRadius:'var(--radius-lg)', padding:'1.25rem 1.5rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap', boxShadow:'var(--shadow-sm)' }}>
                <span style={{ fontSize:'2.2rem' }}>{dm.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:'1.05rem', marginBottom:'0.2rem' }}>
                    {dm.label} Plan — {meta.totalKg} kg in {meta.adjustedWeeks} weeks
                  </div>
                  <div style={{ fontSize:'0.85rem', color:'var(--text2)' }}>
                    {meta.currentWeight} kg → <strong style={{ color:dm.color }}>{meta.targetWeight} kg</strong>
                    {' '}·{' '}{meta.weeklyTarget} kg/week
                    {' '}· Est. completion: <strong>{meta.estimatedCompletion}</strong>
                  </div>
                </div>
                {!meta.isSafe && (
                  <div style={{ padding:'0.45rem 0.85rem', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.25)', borderRadius:'var(--radius)', fontSize:'0.8rem', color:'var(--yellow)', maxWidth:240 }}>
                    ⚠️ Original timeline adjusted for safe progress ({meta.weeklyTarget} kg/week max)
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div style={{ display:'flex', gap:'0.4rem', marginBottom:'1.5rem', borderBottom:'1px solid var(--border)', paddingBottom:'0' }}>
                {[['overview','Overview'],['weekly','Weekly Breakdown'],['milestones','Milestones']].map(([id,label]) => (
                  <button key={id} onClick={() => setActiveTab(id)}
                    style={{ padding:'0.55rem 1.1rem', borderRadius:'var(--radius) var(--radius) 0 0', border:'none', cursor:'pointer', fontWeight:600, fontSize:'0.88rem', background: activeTab===id ? 'var(--surface)' : 'transparent', color: activeTab===id ? 'var(--accent)' : 'var(--text2)', borderBottom: activeTab===id ? '2px solid var(--accent)' : '2px solid transparent', transition:'all 0.15s' }}>
                    {label}
                  </button>
                ))}
              </div>

              {/* ── OVERVIEW TAB ── */}
              {activeTab === 'overview' && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
                  {/* Stat strip */}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem', marginBottom:'1.5rem' }}>
                    {[
                      { label:'Daily Calories', value: plan.weeklySummary[0]?.dailyCalories + ' kcal', sub:'Week 1 target' },
                      { label:'Weekly Target',  value: `${meta.weeklyTarget} kg`, sub: meta.direction === 'loss' ? 'to lose' : 'to gain' },
                      { label:'TDEE',           value: meta.tdee + ' kcal', sub:'maintenance level' },
                      { label:'BMI Change',     value: `${meta.bmi} → ${meta.targetBmi}`, sub:'current → target' },
                    ].map(s => (
                      <div key={s.label} className="card" style={{ padding:'1rem', textAlign:'center', boxShadow:'var(--shadow-sm)' }}>
                        <div style={{ fontSize:'0.72rem', color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.3rem' }}>{s.label}</div>
                        <div style={{ fontWeight:700, fontSize:'1.15rem', letterSpacing:'-0.02em' }}>{s.value}</div>
                        <div style={{ fontSize:'0.75rem', color:'var(--text3)', marginTop:'0.15rem' }}>{s.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Weight projection chart */}
                  <div className="card" style={{ marginBottom:'1.5rem', boxShadow:'var(--shadow)' }}>
                    <div style={{ fontWeight:700, marginBottom:'1.25rem', fontSize:'0.95rem' }}>
                      📊 Weight Projection
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={chartData} margin={{ top:5, right:10, bottom:0, left:-10 }}>
                        <defs>
                          <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor={dm.color} stopOpacity={0.25}/>
                            <stop offset="95%" stopColor={dm.color} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="week" tick={{ fill:'var(--text3)', fontSize:11 }} />
                        <YAxis domain={['auto','auto']} tick={{ fill:'var(--text3)', fontSize:11 }} />
                        <Tooltip contentStyle={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, fontSize:12, boxShadow:'var(--shadow)' }} />
                        <ReferenceLine y={meta.targetWeight} stroke={dm.color} strokeDasharray="4 2" label={{ value:'Target', fill:dm.color, fontSize:11 }} />
                        <Area type="monotone" dataKey="weight" stroke={dm.color} fill="url(#wGrad)" strokeWidth={2} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Week 1 preview */}
                  <div className="card" style={{ boxShadow:'var(--shadow-sm)' }}>
                    <div style={{ fontWeight:700, marginBottom:'1rem', fontSize:'0.95rem' }}>🗓 Week 1 — Getting Started</div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'1rem' }}>
                      <div>
                        <div style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:'0.6rem' }}>Diet Tips</div>
                        {plan.weeklySummary[0]?.dietAdjustment?.tips?.map(tip => (
                          <div key={tip} style={{ display:'flex', gap:'0.5rem', alignItems:'flex-start', marginBottom:'0.4rem', fontSize:'0.88rem', color:'var(--text2)' }}>
                            <span style={{ color:'var(--green)', flexShrink:0, marginTop:2 }}>✓</span>{tip}
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:'0.6rem' }}>Workout Schedule</div>
                        {plan.weeklySummary[0]?.workoutSchedule?.map(d => (
                          <div key={d.day} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.35rem 0', borderBottom:'1px solid var(--border)', fontSize:'0.85rem' }}>
                            <span style={{ fontWeight:600, width:95, color:'var(--text2)' }}>{d.day}</span>
                            <span style={{ flex:1 }}>{d.type}</span>
                            {d.duration > 0
                              ? <span style={{ color: intensityColor[d.intensity], fontWeight:600, fontSize:'0.8rem' }}>{d.duration}min</span>
                              : <span style={{ color:'var(--text3)', fontSize:'0.8rem' }}>Rest</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── WEEKLY BREAKDOWN TAB ── */}
              {activeTab === 'weekly' && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
                  {/* Week scroller */}
                  <div style={{ display:'flex', gap:'0.4rem', marginBottom:'1.25rem', overflowX:'auto', paddingBottom:'0.4rem' }}>
                    {plan.weeklySummary.map((w, i) => (
                      <button key={i} onClick={() => setActiveWeek(i)}
                        style={{ padding:'0.4rem 0.8rem', borderRadius:'var(--radius)', border:'1px solid', flexShrink:0, cursor:'pointer', fontSize:'0.8rem', fontWeight:600, transition:'all 0.15s',
                          borderColor: activeWeek===i ? 'var(--accent)' : 'var(--border)',
                          background:  activeWeek===i ? 'var(--glow)' : 'transparent',
                          color:       activeWeek===i ? 'var(--accent)' : 'var(--text3)',
                        }}>
                        W{w.week}
                        {w.milestone && <span style={{ marginLeft:4 }}>{w.milestone.emoji}</span>}
                      </button>
                    ))}
                  </div>

                  {selectedWeek && (
                    <motion.div key={activeWeek} initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }}>
                      {/* Week header */}
                      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
                        <div>
                          <h3 style={{ fontWeight:700, fontSize:'1.1rem', letterSpacing:'-0.02em' }}>
                            Week {selectedWeek.week}
                            {selectedWeek.milestone && <span style={{ marginLeft:'0.5rem' }}>{selectedWeek.milestone.emoji} {selectedWeek.milestone.label}</span>}
                          </h3>
                          <p style={{ fontSize:'0.83rem', color:'var(--text2)', marginTop:'0.15rem' }}>
                            Phase: <strong style={{ color:'var(--accent)' }}>{selectedWeek.dietAdjustment.phase}</strong>
                            {' '}· Projected: <strong>{selectedWeek.projectedWeight} kg</strong>
                          </p>
                        </div>
                        <div style={{ marginLeft:'auto', display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                          <span className="badge badge-yellow">{selectedWeek.dailyCalories} kcal/day</span>
                          <span className="badge badge-blue">{selectedWeek.dietAdjustment.proteinTarget}g protein</span>
                        </div>
                      </div>

                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1rem' }}>
                        {/* Workout */}
                        <div className="card" style={{ boxShadow:'var(--shadow-sm)' }}>
                          <div style={{ fontWeight:700, fontSize:'0.88rem', color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:'0.85rem' }}>💪 Workouts</div>
                          {selectedWeek.workoutSchedule.map(d => (
                            <div key={d.day} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.45rem 0', borderBottom:'1px solid var(--border)' }}>
                              <span style={{ fontSize:'0.8rem', fontWeight:600, width:85, color:'var(--text2)', flexShrink:0 }}>{d.day}</span>
                              <span style={{ flex:1, fontSize:'0.88rem' }}>{d.type}</span>
                              {d.duration > 0 ? (
                                <>
                                  <span style={{ fontSize:'0.8rem', color:'var(--text3)' }}>{d.duration}m</span>
                                  <span className="badge" style={{ fontSize:'0.68rem', background:`${intensityColor[d.intensity]}18`, color:intensityColor[d.intensity] }}>{d.intensity}</span>
                                </>
                              ) : <span style={{ fontSize:'0.78rem', color:'var(--text3)' }}>😴 Rest</span>}
                            </div>
                          ))}
                        </div>

                        {/* Diet */}
                        <div className="card" style={{ boxShadow:'var(--shadow-sm)' }}>
                          <div style={{ fontWeight:700, fontSize:'0.88rem', color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:'0.85rem' }}>🥗 Diet Adjustments</div>
                          {selectedWeek.dietAdjustment.tips.map(tip => (
                            <div key={tip} style={{ display:'flex', gap:'0.5rem', alignItems:'flex-start', marginBottom:'0.5rem', fontSize:'0.88rem', color:'var(--text2)' }}>
                              <span style={{ color:'var(--green)', flexShrink:0, marginTop:2 }}>✓</span>{tip}
                            </div>
                          ))}
                          <div style={{ marginTop:'1rem', padding:'0.6rem 0.8rem', background:'var(--surface2)', borderRadius:'var(--radius)', fontSize:'0.82rem', color:'var(--text2)' }}>
                            {selectedWeek.deficit > 0 && `🔥 Calorie deficit: ${selectedWeek.deficit} kcal/day`}
                            {selectedWeek.surplus > 0 && `⚡ Calorie surplus: ${selectedWeek.surplus} kcal/day`}
                            {selectedWeek.deficit === 0 && selectedWeek.surplus === 0 && '⚖️ Maintenance calories'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* ── MILESTONES TAB ── */}
              {activeTab === 'milestones' && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                    {plan.milestones.map((m, i) => (
                      <motion.div key={i} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.08 }}
                        className="card" style={{ display:'flex', alignItems:'center', gap:'1.25rem', boxShadow:'var(--shadow-sm)', padding:'1.25rem 1.5rem' }}>
                        <div style={{ width:52, height:52, borderRadius:'50%', background:'var(--surface2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', flexShrink:0, boxShadow:'var(--shadow-xs)' }}>
                          {m.emoji}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700, fontSize:'0.98rem', marginBottom:'0.15rem' }}>{m.label}</div>
                          <div style={{ fontSize:'0.85rem', color:'var(--text2)' }}>{m.desc}</div>
                        </div>
                        <div style={{ textAlign:'right', flexShrink:0 }}>
                          <div style={{ fontWeight:700, fontSize:'1rem', color:'var(--accent)' }}>Week {m.week}</div>
                          <div style={{ fontSize:'0.82rem', color:'var(--text2)' }}>{m.expectedWeight} kg</div>
                          <div style={{ fontSize:'0.78rem', color:'var(--text3)', marginTop:'0.15rem' }}>{m.kgProgress} kg progress</div>
                        </div>
                        <div style={{ width:4, height:52, borderRadius:2, background:`linear-gradient(to bottom, var(--accent), var(--pink))`, flexShrink:0 }} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="card" style={{ marginTop:'1.5rem', boxShadow:'var(--shadow-sm)' }}>
                    <div style={{ fontWeight:700, marginBottom:'1rem', fontSize:'0.95rem' }}>📈 Your Journey at a Glance</div>
                    <div style={{ position:'relative', height:8, background:'var(--surface3)', borderRadius:99, marginBottom:'0.75rem' }}>
                      <div style={{ position:'absolute', top:0, left:0, height:'100%', width:'0%', background:'linear-gradient(90deg,var(--accent),var(--pink))', borderRadius:99 }} />
                      {plan.milestones.map(m => (
                        <div key={m.week} style={{ position:'absolute', top:'50%', left:`${m.percentage}%`, transform:'translate(-50%,-50%)', width:14, height:14, borderRadius:'50%', background:'var(--surface)', border:'2px solid var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.6rem' }}>
                          {m.emoji}
                        </div>
                      ))}
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.78rem', color:'var(--text3)' }}>
                      <span>Start: {meta.currentWeight} kg</span>
                      <span>Target: {meta.targetWeight} kg by week {meta.adjustedWeeks}</span>
                    </div>
                  </div>
                </motion.div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
