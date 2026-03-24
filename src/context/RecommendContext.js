import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';

const RecommendContext = createContext(null);

export const RecommendProvider = ({ children }) => {
  const [result,  setResult]  = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('fitai_result') || 'null'); } catch { return null; }
  });
  const [form,    setForm]    = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('fitai_form') || 'null') || { age:'', weight:'', height:'', activityLevel:'moderate', goal:'', gender:'male', bodyType:'average', experienceLevel:'beginner', injuries:'', preferences:{ diet:'both' } }; } catch { return { age:'', weight:'', height:'', activityLevel:'moderate', goal:'', gender:'male', bodyType:'average', experienceLevel:'beginner', injuries:'', preferences:{ diet:'both' } }; }
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const fetchRecommendation = useCallback(async (formData) => {
    setLoading(true); setError('');
    try {
      const payload = {
        ...formData,
        injuries: formData.injuries ? formData.injuries.split(',').map(s=>s.trim()).filter(Boolean) : [],
      };
      const { data } = await api.post('/recommend', payload);
      setResult(data.data);
      setForm(formData);
      sessionStorage.setItem('fitai_result', JSON.stringify(data.data));
      sessionStorage.setItem('fitai_form',   JSON.stringify(formData));
      return data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get recommendations.');
      return null;
    } finally { setLoading(false); }
  }, []);

  const clearResult = () => {
    setResult(null);
    sessionStorage.removeItem('fitai_result');
    sessionStorage.removeItem('fitai_form');
  };

  return (
    <RecommendContext.Provider value={{ result, form, setForm, loading, error, fetchRecommendation, clearResult }}>
      {children}
    </RecommendContext.Provider>
  );
};

export const useRecommend = () => {
  const ctx = useContext(RecommendContext);
  if (!ctx) throw new Error('useRecommend must be used within RecommendProvider');
  return ctx;
};
