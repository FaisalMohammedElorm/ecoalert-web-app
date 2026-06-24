import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ecoAlertLogo from '../assets/EcoAlert.png';

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf8] dark:bg-alx-navy">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-14 h-14 bg-alx-lime rounded-2xl flex items-center justify-center shadow-lg shadow-alx-lime/30 animate-pulse">
            <img src={ecoAlertLogo} alt="EcoAlert logo" className="w-10 h-10 object-contain" />
          </div>
          <div className="w-24 h-1 bg-alx-lime/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-alx-lime/50 to-alx-lime rounded-full animate-[shimmer_0.8s_ease_infinite]" />
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">Connecting…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  return children;
}
