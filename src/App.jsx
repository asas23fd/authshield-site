import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Docs from './pages/Docs';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/authshield-site/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/authshield-site/dashboard" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/authshield-site/dashboard');

  return (
    <>
      {!isDashboard && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/authshield-site" element={<Home />} />
          <Route path="/authshield-site/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/authshield-site/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/authshield-site/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/authshield-site/features" element={<Features />} />
          <Route path="/authshield-site/pricing" element={<Pricing />} />
          <Route path="/authshield-site/docs" element={<Docs />} />
          <Route path="*" element={<Navigate to="/authshield-site" replace />} />
        </Routes>
      </AnimatePresence>
      {!isDashboard && <Footer />}
    </>
  );
}
