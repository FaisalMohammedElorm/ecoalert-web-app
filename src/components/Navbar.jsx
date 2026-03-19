import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Map, Home, AlertTriangle, BarChart2, Bell, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ecoAlertLogo from '../assets/EcoAlert.png';

const NAV_LINKS = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/report', label: 'Report', icon: AlertTriangle },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart2 },
  { to: '/notifications', label: 'Alerts', icon: Bell },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100/50' 
          : 'bg-white/60 backdrop-blur-md border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-2 group">
              <img
                src={ecoAlertLogo}
                alt="EcoAlert"
                className="h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
              />
              <span className="hidden sm:inline text-sm font-display font-bold bg-gradient-to-r from-eco-600 to-eco-500 bg-clip-text text-transparent">EcoAlert</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => {
                const active = pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      active
                        ? 'text-eco-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="hidden lg:inline">{label}</span>
                    
                    {active && (
                      <div className="absolute bottom-0 left-2 right-2 h-1 bg-gradient-to-r from-eco-500 to-eco-400 rounded-t-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Link
                to="/report"
                className="hidden sm:inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-eco-500 to-eco-600 text-white font-semibold px-4 py-2 rounded-xl text-sm hover:from-eco-600 hover:to-eco-700 active:scale-95 transition-all duration-200 shadow-lg shadow-eco-500/30 hover:shadow-eco-600/40"
              >
                <AlertTriangle size={14} />
                Report
              </Link>

              <div className="flex items-center gap-2">
                <Link 
                  to="/notifications" 
                  className="hidden md:inline-flex p-2 rounded-lg text-gray-600 hover:text-eco-600 hover:bg-eco-50 transition-all duration-200 relative"
                >
                  <Bell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </Link>

                <Link 
                  to="/profile" 
                  className="w-9 h-9 rounded-lg bg-gradient-to-br from-eco-100 to-eco-50 flex items-center justify-center hover:shadow-md transition-all duration-200 group"
                >
                  <User size={16} className="text-eco-700 group-hover:text-eco-800" />
                </Link>

                <button 
                  onClick={handleLogout} 
                  className="hidden md:inline-flex p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(m => !m)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in" />
          <div
            className="absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xl p-4 space-y-1 animate-slide-down"
            onClick={e => e.stopPropagation()}
          >
            {NAV_LINKS.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active 
                      ? 'bg-gradient-to-r from-eco-50 to-eco-100 text-eco-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
            <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
              <button
                onClick={() => { navigate('/report'); setMenuOpen(false); }}
                className="w-full btn-primary py-2.5 text-sm justify-center"
              >
                <AlertTriangle size={15} /> Report Issue
              </button>
              <div className="flex gap-2">
                <Link 
                  to="/profile" 
                  onClick={() => setMenuOpen(false)} 
                  className="flex-1 btn-secondary text-sm py-2.5 text-center"
                >
                  <User size={14} />
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex-1 bg-red-50 text-red-600 border-2 border-red-100 font-semibold py-2.5 rounded-xl text-sm hover:bg-red-100 transition-colors duration-200"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
