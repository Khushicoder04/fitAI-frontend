import React from 'react';

export default function Loader({ size = 36, text = '' }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.85rem', padding:'2.5rem' }}>
      <div style={{
        width:size, height:size,
        border:'2.5px solid var(--border)',
        borderTopColor:'var(--accent)',
        borderRadius:'50%',
        animation:'spin 0.65s linear infinite',
      }} />
      {text && <p style={{ color:'var(--text2)', fontSize:'0.88rem', textAlign:'center' }}>{text}</p>}
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}
