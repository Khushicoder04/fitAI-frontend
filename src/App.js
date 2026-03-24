import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth }       from './context/AuthContext';
import { ThemeProvider }               from './context/ThemeContext';
import { RecommendProvider }           from './context/RecommendContext';
import Navbar        from './components/layout/Navbar';
import Footer        from './components/layout/Footer';
import Chatbot       from './components/common/Chatbot';
import Landing       from './pages/Landing';
import Dashboard     from './pages/Dashboard';
import DietPlan      from './pages/DietPlan';
import WorkoutPlan   from './pages/WorkoutPlan';
import GoalPlan      from './pages/GoalPlan';
import Profile       from './pages/Profile';
import Pricing       from './pages/Pricing';
import Login         from './pages/Login';
import Signup        from './pages/Signup';
import PaymentSuccess from './pages/PaymentSuccess';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <div style={{ width:36,height:36,border:'2px solid var(--border)',borderTopColor:'var(--accent)',borderRadius:'50%',animation:'spin .7s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"                element={<Landing />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/signup"          element={<Signup />} />
        <Route path="/pricing"         element={<Pricing />} />
        <Route path="/dashboard"       element={<Dashboard />} />
        <Route path="/diet"            element={<ProtectedRoute><DietPlan /></ProtectedRoute>} />
        <Route path="/workout"         element={<ProtectedRoute><WorkoutPlan /></ProtectedRoute>} />
        <Route path="/goal"            element={<ProtectedRoute><GoalPlan /></ProtectedRoute>} />
        <Route path="/profile"         element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path="*"                element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      {user && <Chatbot />}
    </BrowserRouter>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RecommendProvider>
          <AppRoutes />
        </RecommendProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
