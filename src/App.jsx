import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { WasteProvider } from './contexts/WasteContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Onboarding from './pages/Onboarding';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Report from './pages/Report';
import MapView from './pages/MapView';
import Dashboard from './pages/Dashboard';
import Tracker from './pages/Tracker';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WasteProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/onboarding" replace />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/auth" element={<Auth />} />

            {/* Protected routes with navbar */}
            <Route path="/home" element={
              <ProtectedRoute>
                <AppLayout><Home /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/report" element={
              <ProtectedRoute>
                <AppLayout><Report /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/map" element={
              <ProtectedRoute>
                <AppLayout><MapView /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout><Dashboard /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/tracker" element={
              <ProtectedRoute>
                <AppLayout><Tracker /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <AppLayout><Profile /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <AppLayout><Notifications /></AppLayout>
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </Routes>
        </WasteProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
