import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ecoAlertLogo from '../assets/EcoAlert.png';

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf8]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-eco-500 rounded-2xl flex items-center justify-center shadow-lg shadow-eco-500/30 animate-pulse">
            <img src={ecoAlertLogo} alt="EcoAlert logo" className="w-10 h-10 object-contain" />
          </div>
          <div className="w-8 h-1 bg-eco-200 rounded-full overflow-hidden">
            <div className="h-full bg-eco-500 rounded-full animate-[slide-in_1s_ease_infinite]" />
          </div>
          <p className="text-gray-400 text-sm font-medium">Loading EcoAlert…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  return children;
}
