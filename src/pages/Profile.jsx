import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Recycle, Award, LogOut, Edit3, Bell, Shield, HelpCircle, Settings, ChevronRight, Leaf } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWaste } from '../contexts/WasteContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { reports } = useWaste();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const userReports = reports.filter(r => r.userId === user?.uid);
  const resolved = userReports.filter(r => r.status === 'resolved').length;

  const stats = [
    { label: 'Reports', value: userReports.length, color: '#4CAF50', icon: Recycle },
    { label: 'Resolved', value: resolved, color: '#2196F3', icon: Award },
    { label: 'Eco Points', value: userReports.length * 20, color: '#FF9800', icon: Leaf },
    { label: 'Rank', value: '#12', color: '#9C27B0', icon: Award },
  ];

  const OPTIONS = [
    { icon: Edit3, label: 'Edit Profile', sub: 'Update your personal info', color: '#4CAF50' },
    { icon: Bell, label: 'Notifications', sub: 'Manage alert preferences', color: '#FF9800', action: () => navigate('/notifications') },
    { icon: Shield, label: 'Privacy & Security', sub: 'Manage your privacy', color: '#2196F3' },
    { icon: HelpCircle, label: 'Help & Support', sub: 'Get help or contact us', color: '#9C27B0' },
    { icon: Settings, label: 'App Settings', sub: 'Customize your experience', color: '#607D8B' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 md:px-6 pb-16 pt-3 sm:pt-4">
      {/* Profile header */}
      <div className="card mb-3 sm:mb-4 flex flex-col items-center py-6 sm:py-8 animate-fade-up relative p-4 sm:p-6">
        <div className="relative mb-3 sm:mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-2xl bg-eco-100 border-4 border-eco-200 flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-display font-bold text-eco-600">{user?.name?.[0] || 'U'}</span>
          </div>
          <button className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-eco-500 flex items-center justify-center border-2 border-white shadow">
            <Edit3 size={11} className="sm:w-3.5 sm:h-3.5 text-white" />
          </button>
        </div>
        <h2 className="text-lg sm:text-xl font-display font-bold text-gray-900">{user?.name || 'User Name'}</h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{user?.email}</p>
        <span className="mt-2 sm:mt-3 inline-flex items-center gap-1.5 bg-eco-50 text-eco-600 text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-eco-100">
          <Leaf size={10} className="sm:w-3 sm:h-3" /> EcoAlert Member
        </span>
      </div>

      {/* Impact stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4 stagger-1 animate-fade-up">
        {stats.map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="card !p-2.5 sm:!p-3 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-1.5" style={{ backgroundColor: `${color}18` }}>
              <Icon size={14} className="sm:w-4 sm:h-4" style={{ color }} />
            </div>
            <p className="font-display font-bold text-gray-900 dark:text-eco-400 text-base sm:text-lg leading-none">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Contact info */}
      <div className="card mb-3 sm:mb-4 stagger-2 animate-fade-up p-4 sm:p-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Contact Information</h3>
        <div className="space-y-2 sm:space-y-3">
          {[
            { icon: Mail, label: 'Email', value: user?.email || 'user@example.com' },
            { icon: Phone, label: 'Phone', value: user?.phone || '+233 24 000 0000' },
            { icon: MapPin, label: 'Location', value: user?.location || 'Accra, Ghana' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Icon size={13} className="sm:w-4 sm:h-4 text-gray-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-700 truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account options */}
      <div className="card mb-4 sm:mb-6 stagger-3 animate-fade-up p-4 sm:p-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 sm:mb-3">Account Settings</h3>
        <div className="space-y-0.5">
          {OPTIONS.map(({ icon: Icon, label, sub, color, action }) => (
            <button
              key={label}
              onClick={action || (() => alert(`${label} — coming soon!`))}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group text-left"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      {!showLogoutConfirm ? (
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center gap-2 bg-red-50 border-2 border-red-100 text-red-600 font-semibold py-3.5 rounded-2xl hover:bg-red-100 active:scale-95 transition-all stagger-4 animate-fade-up"
        >
          <LogOut size={16} /> Sign Out
        </button>
      ) : (
        <div className="card border-red-100 text-center stagger-4 animate-fade-up">
          <p className="font-semibold text-gray-800 mb-1">Are you sure?</p>
          <p className="text-sm text-gray-400 mb-4">You'll need to sign in again to access EcoAlert.</p>
          <div className="flex gap-2">
            <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 btn-secondary text-sm py-2.5">Cancel</button>
            <button onClick={handleLogout} className="flex-1 bg-red-500 text-white font-semibold py-2.5 rounded-xl hover:bg-red-600 active:scale-95 transition-all text-sm">Sign Out</button>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-gray-300 mt-6">EcoAlert v1.0.0 · Made with 🌿 for Ghana</p>
    </div>
  );
}
