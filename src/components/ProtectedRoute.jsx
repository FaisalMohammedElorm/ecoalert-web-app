import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ecoAlertLogo from '../assets/EcoAlert.png';

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf8]">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-14 h-14 bg-eco-500 rounded-2xl flex items-center justify-center shadow-lg shadow-eco-500/30 animate-pulse">
            <img src={ecoAlertLogo} alt="EcoAlert logo" className="w-10 h-10 object-contain" />
          </div>
          <div className="w-24 h-1 bg-eco-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-eco-400 to-eco-600 rounded-full animate-[shimmer_0.8s_ease_infinite]" />
          </div>
          <p className="text-gray-400 text-xs font-medium">Connecting…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  return children;
}
