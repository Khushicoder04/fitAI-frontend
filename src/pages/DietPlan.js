import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth }      from '../context/AuthContext';
import { useRecommend } from '../context/RecommendContext';
import api         from '../utils/api';
import Loader      from '../components/common/Loader';
import ProBadge    from '../components/common/ProBadge';
import MealCard    from '../components/common/MealCard';

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

export default function DietPlan() {
  const { user }  = useAuth();
  const { result: ctxResult, form: ctxForm } = useRecommend();
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay]   = useState('monday');
  const [error,     setError]       = useState('');
  const [showGrocery, setShowGrocery] = useState(false);
  const [prefs, setPrefs] = useState({ diet:'both', allergies:'' });
  const [showPrefs, setShowPrefs] = useState(false);

  // Use context result if available, else fetch
  useEffect(() => {
    if (ctxResult) { setResult(ctxResult); return; }
    if (user?.profile?.weight && user?.profile?.height) fetchPlan();
  }, []);

  const fetchPlan = async (overridePrefs) => {
    setLoading(true); setError('');
    try {
      const p = overridePrefs || prefs;
      const { data } = await api.post('/recommend', {
        age:           user?.profile?.age    || ctxForm?.age    || 25,
        weight:        user?.profile?.weight || ctxForm?.weight,
        height:        user?.profile?.height || ctxForm?.height,
        activityLevel: user?.profile?.activityLevel || ctxForm?.activityLevel || 'moderate',
        goal:          user?.fitnessGoal    || ctxForm?.goal    || '',
        gender:        user?.profile?.gender || ctxForm?.gender || 'male',
        preferences:   { diet: p.diet, allergies: p.allergies ? p.allergies.split(',').map(s=>s.trim()) : [] },
      });
      setResult(data.data);
    } catch (err) {
      setError('Could not load diet plan. Please complete your profile on the Dashboard first.');
    } finally { setLoading(false); }
  };

  if (loading) return <div style={{ paddingTop:100 }}><Loader text="Building your personalised diet plan…" /></div>;

  const groceryList = result?.groceryList;
  const goal = result?.summary?.inferredGoal || 'maintain';

  return (
    <div style={{ paddingTop:80, minHeight:'100vh', padding:'5.5rem 0 4rem' }}>
      <div className="container">
        <motion.div initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} style={{ marginBottom:'2rem' }}>
          <h1 style={{ fontSize:'clamp(1.6rem,4vw,2.4rem)', fontWeight:700, letterSpacing:'-0.03em', marginBottom:'0.4rem' }}>
            🥗 <span className="gradient-text">Diet Plan</span>
          </h1>
          <p style={{ color:'var(--text2)', fontSize:'0.95rem' }}>Personalised nutrition with meal photos, macros, and grocery lists.</p>
        </motion.div>

        {/* Preferences */}
        <div className="card" style={{ marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }} onClick={()=>setShowPrefs(s=>!s)}>
            <div>
              <div style={{ fontWeight:700, fontSize:'0.92rem' }}>🍽️ Nutrition Preferences</div>
              <div style={{ fontSize:'0.82rem', color:'var(--text2)', marginTop:'0.15rem' }}>
                Diet: <strong style={{ color:'var(--accent)' }}>{prefs.diet}</strong>
                {prefs.allergies && ` · Avoid: ${prefs.allergies}`}
              </div>
            </div>
            <span style={{ color:'var(--accent)' }}>{showPrefs?'▲':'▼'}</span>
          </div>
          {showPrefs && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ marginTop:'1rem', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'0.85rem' }}>
              <div>
                <label>Diet Preference</label>
                <select value={prefs.diet} onChange={e=>setPrefs(p=>({...p,diet:e.target.value}))}>
                  <option value="both">No Preference</option>
                  <option value="veg">Vegetarian / Vegan</option>
                  <option value="non-veg">Non-Vegetarian</option>
                </select>
              </div>
              <div>
                <label>Allergies / Avoid</label>
                <input placeholder="e.g. gluten, dairy, nuts" value={prefs.allergies} onChange={e=>setPrefs(p=>({...p,allergies:e.target.value}))} />
              </div>
              <div style={{ display:'flex', alignItems:'flex-end' }}>
                <button onClick={()=>fetchPlan(prefs)} className="btn btn-primary" style={{ width:'100%' }}>🔄 Update Plan</button>
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
            {/* Macro strip */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:'0.85rem', marginBottom:'1.5rem' }}>
              {[
                { label:'Calories',  value:result.summary.calorieTarget+' kcal', icon:'🔥' },
                { label:'Protein',   value:result.diet.macros.protein,            icon:'🥩' },
                { label:'Carbs',     value:result.diet.macros.carbs,              icon:'🌾' },
                { label:'Fats',      value:result.diet.macros.fats,               icon:'🥑' },
                { label:'Water',     value:result.summary.hydrationGoal+'L',      icon:'💧' },
              ].map(s=>(
                <div key={s.label} className="card" style={{ textAlign:'center', padding:'0.85rem' }}>
                  <div style={{ fontSize:'1.3rem', marginBottom:'0.25rem' }}>{s.icon}</div>
                  <div style={{ fontWeight:700, fontSize:'0.95rem', letterSpacing:'-0.01em' }}>{s.value}</div>
                  <div style={{ fontSize:'0.72rem', color:'var(--text3)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Filtered meal list (always visible) */}
            <div className="card" style={{ marginBottom:'1.5rem' }}>
              <h2 style={{ fontWeight:700, fontSize:'0.95rem', marginBottom:'0.75rem' }}>{result.diet.title}</h2>
              <p style={{ color:'var(--text2)', fontSize:'0.88rem', marginBottom:'1rem' }}>{result.diet.description}</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'0.75rem' }}>
                {(result.diet.meals || []).map((meal,i) => (
                  <div key={i} style={{ display:'flex', gap:'0.75rem', padding:'0.75rem', background:'var(--surface2)', borderRadius:'var(--radius)', alignItems:'center' }}>
                    <img src={meal.image} alt={meal.name} style={{ width:52, height:52, borderRadius:'var(--radius-sm)', objectFit:'cover', flexShrink:0 }} onError={e=>e.target.style.display='none'} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:'0.88rem', marginBottom:'0.2rem' }}>{meal.name}</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--text3)' }}>{meal.calories} kcal · P:{meal.protein}g · C:{meal.carbs}g · F:{meal.fats}g</div>
                      {/* YouTube cooking search — Pro */}
                      {user?.isPro ? (
                        <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent('how to make '+meal.name)}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{ fontSize:'0.72rem', color:'#ef4444', fontWeight:600, display:'flex', alignItems:'center', gap:'0.25rem', marginTop:'0.3rem' }}>
                          ▶ Cooking tutorial
                        </a>
                      ) : (
                        <div style={{ fontSize:'0.72rem', color:'var(--text3)', marginTop:'0.25rem' }}>
                          <span className="badge badge-purple" style={{ fontSize:'0.65rem' }}>⚡ Pro</span> cooking tutorial
                        </div>
                      )}
                    </div>
                    <span className="badge badge-blue" style={{ fontSize:'0.68rem', flexShrink:0 }}>{meal.type}</span>
                  </div>
                ))}
              </div>
              <ul style={{ display:'flex', flexDirection:'column', gap:'0.35rem', marginTop:'1rem' }}>
                {result.diet.tips?.map(tip=>(
                  <li key={tip} style={{ display:'flex', gap:'0.4rem', fontSize:'0.85rem', color:'var(--text2)' }}>
                    <span style={{ color:'var(--green)' }}>✓</span>{tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro 7-day plan */}
            {user?.isPro && result.detailedMealPlan ? (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem', flexWrap:'wrap', gap:'0.5rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                    <h2 style={{ fontWeight:700, fontSize:'0.95rem' }}>7-Day Meal Plan</h2>
                    <span className="badge badge-purple">⚡ Pro</span>
                  </div>
                  {groceryList && (
                    <button onClick={()=>setShowGrocery(s=>!s)} className="btn btn-outline" style={{ padding:'0.35rem 0.8rem', fontSize:'0.8rem' }}>
                      🛒 {showGrocery?'Hide':'Show'} Grocery List
                    </button>
                  )}
                </div>

                {/* Grocery list */}
                {showGrocery && groceryList && (
                  <motion.div initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0 }}
                    className="card" style={{ marginBottom:'1.25rem', background:'rgba(34,197,94,0.05)', border:'1px solid rgba(34,197,94,0.15)' }}>
                    <h3 style={{ fontWeight:700, fontSize:'0.92rem', marginBottom:'0.85rem' }}>🛒 Weekly Grocery List</h3>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:'0.85rem' }}>
                      {Object.entries(groceryList).filter(([,v])=>v.length>0).map(([cat,items])=>(
                        <div key={cat}>
                          <div style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', color:'var(--text3)', marginBottom:'0.35rem' }}>{cat}</div>
                          {items.map(item=>(
                            <div key={item} style={{ fontSize:'0.85rem', color:'var(--text2)', display:'flex', gap:'0.3rem', marginBottom:'0.2rem' }}>
                              <span style={{ color:'var(--green)' }}>○</span>{item}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Day tabs */}
                <div style={{ display:'flex', gap:'0.4rem', marginBottom:'1.25rem', overflowX:'auto', paddingBottom:'0.4rem' }}>
                  {DAYS.map(day=>(
                    <button key={day} onClick={()=>setActiveDay(day)}
                      style={{ padding:'0.4rem 0.8rem', borderRadius:'var(--radius-sm)', border:'1px solid', flexShrink:0, cursor:'pointer', fontSize:'0.8rem', fontWeight:600, transition:'all 0.15s',
                        borderColor:activeDay===day?'var(--accent)':'var(--border)',
                        background:activeDay===day?'var(--glow)':'transparent',
                        color:activeDay===day?'var(--accent)':'var(--text3)' }}>
                      {day.slice(0,3).toUpperCase()}
                    </button>
                  ))}
                </div>

                {result.detailedMealPlan[activeDay] && (
                  <motion.div key={activeDay} initial={{ opacity:0,x:12 }} animate={{ opacity:1,x:0 }}>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', marginBottom:'0.85rem' }}>
                      {[['breakfast','🌅'],['lunch','☀️'],['dinner','🌙']].map(([type,icon])=>(
                        <MealCard key={type} mealType={type} meal={result.detailedMealPlan[activeDay][type]} icon={icon} isPro />
                      ))}
                      {result.detailedMealPlan[activeDay].snacks?.map((s,i)=>(
                        <MealCard key={i} mealType="snack" meal={s} icon="🍎" isPro />
                      ))}
                    </div>
                    {/* Day calorie total */}
                    {(() => {
                      const d = result.detailedMealPlan[activeDay];
                      const total = (d.breakfast?.calories||0)+(d.lunch?.calories||0)+(d.dinner?.calories||0)+(d.snacks?.reduce((a,s)=>a+(s.calories||0),0)||0);
                      return total > 0 ? (
                        <div style={{ textAlign:'center', padding:'0.65rem', background:'var(--surface2)', borderRadius:'var(--radius)', fontSize:'0.85rem' }}>
                          <span style={{ color:'var(--text2)' }}>Total: </span>
                          <strong style={{ color:'var(--accent)' }}>{total} kcal</strong>
                          <span style={{ color:'var(--text3)', marginLeft:'0.75rem' }}>Target: {result.summary.calorieTarget} kcal</span>
                        </div>
                      ) : null;
                    })()}
                  </motion.div>
                )}
              </motion.div>
            ) : !user?.isPro ? (
              <ProBadge message="Upgrade to Pro for the full 7-day meal plan with food photos, calorie breakdowns, grocery lists, and YouTube cooking tutorials." />
            ) : null}
          </>
        )}

        {!result && !loading && !error && (
          <div className="card" style={{ textAlign:'center', padding:'3rem' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'0.85rem' }}>🥗</div>
            <h3 style={{ fontWeight:700, marginBottom:'0.4rem' }}>No plan generated yet</h3>
            <p style={{ color:'var(--text2)', marginBottom:'1.25rem', fontSize:'0.9rem' }}>Complete your assessment on the Dashboard first.</p>
            <a href="/dashboard" className="btn btn-primary">Go to Dashboard →</a>
          </div>
        )}
      </div>
    </div>
  );
}
