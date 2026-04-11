import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import MyTrips from './pages/MyTrips';
import ProfileVault from './pages/ProfileVault';
import Profile from './pages/Profile';
import Currency from './pages/Currency';
import Explorer from './pages/Explorer';
import SOSButton from './components/SOSButton';
import Chatbot from './components/Chatbot';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <Home />
            </motion.div>
          } 
        />
        <Route 
          path="/auth" 
          element={
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.4 }}>
              <AuthPage />
            </motion.div>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }}>
                <Dashboard />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/booking" 
          element={
            <ProtectedRoute>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }}>
                <Booking />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-trips" 
          element={
            <ProtectedRoute>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45 }}>
                <MyTrips />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/vault" 
          element={
            <ProtectedRoute>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }}>
                <ProfileVault />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/currency" 
          element={
            <ProtectedRoute>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                <Currency />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/explorer" 
          element={
            <ProtectedRoute>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                <Explorer />
              </motion.div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                <Profile />
              </motion.div>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
};

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(15, 15, 20, 0.9)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
          },
        }}
      />
      {!isAuthPage && <Navbar />}
      <main className={isAuthPage ? "" : "container mx-auto px-4 pt-32 pb-12"}>
        <AnimatedRoutes />
      </main>
      {!isAuthPage && (
        <>
          <SOSButton />
          <Chatbot />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
