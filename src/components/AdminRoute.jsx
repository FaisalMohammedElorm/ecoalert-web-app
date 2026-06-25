import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ecoAlertLogo from '../assets/EcoAlert.png';

export default function AdminRoute({ children }) {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf8] dark:bg-alx-navy">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-14 h-14 bg-alx-lime rounded-2xl flex items-center justify-center shadow-lg shadow-alx-lime/30 animate-pulse">
            <img src={ecoAlertLogo} alt="EcoAlert logo" className="w-10 h-10 object-contain" />
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">Verifying access…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/home" replace />;
  return children;
}
