import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeUp = { hidden:{ opacity:0, y:28 }, show:{ opacity:1, y:0, transition:{ duration:0.5 } } };
const stagger = { show:{ transition:{ staggerChildren:0.1 } } };

const features = [
  { icon:'🧮', title:'Smart BMI Analysis',       desc:'Instant BMI calculation with health insights and ideal weight range.' },
  { icon:'🎯', title:'Goal-Based Adaptive Plan', desc:'Set a real target. Get week-by-week calorie, workout & diet breakdowns.' },
  { icon:'🥗', title:'Personalised Diet Plans',  desc:'AI meal plans tailored to your goal with food photos & grocery lists.' },
  { icon:'💪', title:'Custom Workout Programs',  desc:'Exercise routines matched to body type, experience & any injuries.' },
  { icon:'📈', title:'Progress Tracking',        desc:'Log weight, view trends over time with beautiful Recharts visuals.' },
  { icon:'🤖', title:'AI Coach (24/7)',          desc:'Chat with your personal AI fitness coach anytime. Pro feature.' },
];

const stats = [
  { value:'50K+', label:'Active Users' },
  { value:'1M+',  label:'Plans Generated' },
  { value:'95%',  label:'Goal Success' },
  { value:'4.9★', label:'Rating' },
];

export default function Landing() {
  return (
    <div style={{ paddingTop:80 }}>

      {/* ── Hero ── */}
      <section style={{ minHeight:'92vh', display:'flex', alignItems:'center', position:'relative', padding:'5rem 0 3rem' }}>
        {/* ambient blobs */}
        <div aria-hidden style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:'8%', left:'2%', width:560, height:560, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.13) 0%,transparent 70%)', filter:'blur(60px)' }}/>
          <div style={{ position:'absolute', bottom:'5%', right:'2%', width:420, height:420, borderRadius:'50%', background:'radial-gradient(circle,rgba(236,72,153,0.10) 0%,transparent 70%)', filter:'blur(60px)' }}/>
        </div>

        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'4rem', alignItems:'center' }}>

            <motion.div variants={stagger} initial="hidden" animate="show">
              <motion.div variants={fadeUp} style={{ marginBottom:'1.25rem' }}>
                <span className="badge badge-purple">✦ AI-Powered Health Platform</span>
              </motion.div>

              <motion.h1 variants={fadeUp} style={{ fontSize:'clamp(2.4rem,5.5vw,4rem)', fontWeight:700, letterSpacing:'-0.04em', lineHeight:1.12, marginBottom:'1.25rem' }}>
                Your personal<br/>
                <span className="gradient-text">fitness AI</span><br/>
                coach
              </motion.h1>

              <motion.p variants={fadeUp} style={{ fontSize:'1.05rem', color:'var(--text2)', lineHeight:1.7, marginBottom:'2rem', maxWidth:460 }}>
                Personalised diet plans, adaptive workout schedules, and goal-based roadmaps — all powered by AI and tailored to your body.
              </motion.p>

              <motion.div variants={fadeUp} style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', marginBottom:'2.5rem' }}>
                <Link to="/dashboard" className="btn btn-primary" style={{ padding:'0.75rem 1.75rem', fontSize:'0.95rem' }}>
                  Start free analysis →
                </Link>
                <Link to="/pricing" className="btn btn-outline" style={{ padding:'0.75rem 1.75rem', fontSize:'0.95rem' }}>
                  View plans
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} style={{ display:'flex', gap:'2rem', flexWrap:'wrap' }}>
                {stats.map(s => (
                  <div key={s.label}>
                    <div style={{ fontWeight:700, fontSize:'1.5rem', letterSpacing:'-0.03em', color:'var(--accent)' }}>{s.value}</div>
                    <div style={{ fontSize:'0.78rem', color:'var(--text3)', fontWeight:500, marginTop:2 }}>{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero card */}
            <motion.div initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3, duration:0.7, type:'spring', stiffness:90 }}
              style={{ display:'flex', justifyContent:'center' }}>
              <HeroCard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section" style={{ background:'var(--bg2)' }}>
        <div className="container">
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            style={{ textAlign:'center', marginBottom:'3rem' }}>
            <span className="badge badge-green" style={{ marginBottom:'0.85rem' }}>Everything you need</span>
            <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.6rem)', fontWeight:700, letterSpacing:'-0.03em', marginBottom:'0.85rem' }}>
              Complete health ecosystem
            </h2>
            <p style={{ color:'var(--text2)', fontSize:'1rem', maxWidth:480, margin:'0 auto' }}>
              From BMI to weekly meal planning — one intelligent platform, zero guesswork.
            </p>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1rem' }}>
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay:i*0.07 }} whileHover={{ y:-4 }}
                className="card card-hover" style={{ cursor:'default' }}>
                <div style={{ fontSize:'1.8rem', marginBottom:'0.85rem' }}>{f.icon}</div>
                <h3 style={{ fontWeight:600, fontSize:'0.98rem', letterSpacing:'-0.02em', marginBottom:'0.45rem' }}>{f.title}</h3>
                <p style={{ color:'var(--text2)', fontSize:'0.875rem', lineHeight:1.65 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section">
        <div className="container">
          <motion.div initial={{ opacity:0, scale:0.97 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
            style={{ background:'linear-gradient(135deg,var(--accent) 0%,var(--pink) 100%)', borderRadius:'var(--radius-xl)', padding:'clamp(2.5rem,5vw,4.5rem)', textAlign:'center', position:'relative', overflow:'hidden', boxShadow:'var(--shadow-xl)' }}>
            <div aria-hidden style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 25% 50%,rgba(255,255,255,0.08),transparent)', pointerEvents:'none' }}/>
            <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:700, color:'white', letterSpacing:'-0.03em', marginBottom:'0.85rem' }}>
              Ready to transform your health?
            </h2>
            <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'1rem', marginBottom:'2rem' }}>
              Join 50,000+ users hitting their fitness goals with FitAI.
            </p>
            <Link to="/signup" className="btn" style={{ background:'white', color:'var(--accent)', padding:'0.85rem 2.25rem', fontSize:'0.95rem', fontWeight:700, boxShadow:'0 4px 20px rgba(0,0,0,0.2)' }}>
              Get started free →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function HeroCard() {
  return (
    <div style={{ position:'relative', width:'100%', maxWidth:360 }}>
      <motion.div
        animate={{ y:[0,-10,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
        className="card" style={{ padding:'1.5rem', boxShadow:'var(--shadow-xl)' }}
      >
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.25rem' }}>
          <div style={{ width:40, height:40, borderRadius:10, background:'linear-gradient(135deg,var(--accent),var(--pink))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', boxShadow:'0 3px 12px rgba(99,102,241,0.4)' }}>🏋️</div>
          <div>
            <div style={{ fontWeight:700, fontSize:'0.9rem', letterSpacing:'-0.02em' }}>Alex's Plan</div>
            <div style={{ fontSize:'0.75rem', color:'var(--text3)' }}>Updated today</div>
          </div>
          <span className="badge badge-green" style={{ marginLeft:'auto' }}>On track</span>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.65rem', marginBottom:'1.25rem' }}>
          {[['BMI','23.4','badge-green','Normal'],['Goal','Maintain','badge-purple','Weight']].map(([k,v,cls,sub]) => (
            <div key={k} style={{ background:'var(--surface2)', borderRadius:'var(--radius)', padding:'0.85rem', boxShadow:'var(--shadow-xs)' }}>
              <div style={{ fontSize:'0.72rem', color:'var(--text3)', marginBottom:'0.2rem' }}>{k}</div>
              <div style={{ fontWeight:700, fontSize:'1.25rem', letterSpacing:'-0.03em' }}>{v}</div>
              <span className={`badge ${cls}`} style={{ fontSize:'0.68rem', marginTop:'0.25rem' }}>{sub}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize:'0.75rem', color:'var(--text3)', fontWeight:600, marginBottom:'0.4rem' }}>Today's Calories</div>
        <div style={{ height:6, background:'var(--surface3)', borderRadius:99, overflow:'hidden', marginBottom:'0.4rem' }}>
          <motion.div initial={{ width:0 }} animate={{ width:'68%' }} transition={{ duration:1.4, delay:0.5 }}
            style={{ height:'100%', background:'linear-gradient(90deg,var(--accent),var(--pink))', borderRadius:99 }}/>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.78rem' }}>
          <span style={{ color:'var(--accent)', fontWeight:600 }}>1,620 kcal</span>
          <span style={{ color:'var(--text3)' }}>2,400 target</span>
        </div>
      </motion.div>

      {/* Floating chips */}
      <motion.div animate={{ x:[0,7,0] }} transition={{ duration:3, repeat:Infinity }}
        style={{ position:'absolute', top:-18, right:-18, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'0.5rem 0.85rem', fontSize:'0.82rem', fontWeight:600, boxShadow:'var(--shadow)' }}>
        🥗 Diet plan ready
      </motion.div>
      <motion.div animate={{ x:[0,-6,0] }} transition={{ duration:3.5, repeat:Infinity, delay:0.5 }}
        style={{ position:'absolute', bottom:-14, left:-14, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'0.5rem 0.85rem', fontSize:'0.82rem', fontWeight:600, boxShadow:'var(--shadow)' }}>
        💪 Workout queued
      </motion.div>
    </div>
  );
}
