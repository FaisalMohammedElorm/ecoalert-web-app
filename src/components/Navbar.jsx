import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Map, Home, AlertTriangle, BarChart2, Bell, User, Menu, X, LogOut, Moon, Sun, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
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
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = isAdmin
    ? [...NAV_LINKS, { to: '/admin', label: 'Admin', icon: ShieldCheck }]
    : NAV_LINKS;

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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full overflow-x-hidden ${
        scrolled 
          ? 'bg-alx-navy/95 dark:bg-alx-navy/98 backdrop-blur-xl shadow-lg border-b border-alx-lime/10' 
          : 'bg-alx-navy/90 dark:bg-alx-navy/95 backdrop-blur-md border-b border-alx-lime/5'
      }`}>
        <div className="w-full max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-1.5 sm:gap-2 group">
              <img
                src={ecoAlertLogo}
                alt="EcoAlert"
                className="h-7 sm:h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
              />
              <span className="hidden sm:inline text-xs sm:text-sm font-display font-bold text-alx-lime group-hover:text-alx-lime-light transition-colors">EcoAlert</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map(({ to, label, icon: Icon }) => {
                const active = pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative flex items-center gap-1.5 px-2 md:px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 group ${
                      active
                        ? 'text-alx-lime'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="hidden lg:inline">{label}</span>
                    
                    {active && (
                      <div className="absolute bottom-0 left-2 right-2 h-1 bg-alx-lime rounded-t-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <Link
                to="/report"
                className="hidden sm:inline-flex items-center justify-center gap-1 sm:gap-1.5 bg-alx-lime text-alx-navy font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm hover:bg-alx-lime-light active:scale-95 transition-all duration-200 shadow-lg shadow-alx-lime/30 hover:shadow-alx-lime/50"
              >
                <AlertTriangle size={13} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Report</span>
              </Link>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button 
                  onClick={toggleDarkMode}
                  className="p-2 sm:p-2.5 rounded-lg bg-alx-navy-light text-alx-lime hover:bg-alx-navy-lighter hover:text-alx-lime-light transition-all duration-200"
                  title={isDark ? 'Light mode' : 'Dark mode'}
                >
                  {isDark ? <Sun size={16} className="sm:w-4.5 sm:h-4.5" /> : <Moon size={16} className="sm:w-4.5 sm:h-4.5" />}
                </button>

                <Link 
                  to="/notifications" 
                  className="hidden md:inline-flex p-2 sm:p-2 rounded-lg text-gray-300 hover:text-alx-lime hover:bg-alx-navy-light transition-all duration-200 relative"
                  aria-label="Notifications"
                >
                  <Bell size={16} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </Link>

                <Link 
                  to="/profile" 
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-alx-lime/10 flex items-center justify-center hover:bg-alx-lime/20 transition-all duration-200 group"
                  aria-label="Profile"
                >
                  <User size={14} className="sm:w-4 sm:h-4 text-alx-lime group-hover:text-alx-lime-light" />
                </Link>

                <button 
                  onClick={handleLogout} 
                  className="hidden md:inline-flex p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors duration-200"
                  title="Logout"
                >
                  <LogOut size={14} />
                </button>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(m => !m)}
                className="md:hidden p-2 rounded-lg text-alx-lime hover:bg-alx-navy-light transition-colors duration-200"
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
          <div className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm animate-fade-in" />
          <div
            className="absolute top-16 left-0 right-0 bg-alx-navy-light/95 backdrop-blur-md border-b border-alx-lime/10 shadow-2xl p-4 space-y-1 animate-slide-down"
            onClick={e => e.stopPropagation()}
          >
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active 
                      ? 'bg-alx-lime/10 text-alx-lime' 
                      : 'text-gray-300 hover:text-alx-lime hover:bg-alx-navy-lighter'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
            <div className="pt-3 mt-3 border-t border-alx-lime/10 space-y-2">
              <button
                onClick={() => { navigate('/report'); setMenuOpen(false); }}
                className="w-full bg-alx-lime text-alx-navy font-semibold py-2.5 text-sm rounded-xl hover:bg-alx-lime-light transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <AlertTriangle size={15} /> Report Issue
              </button>
              <div className="flex gap-2">
                <Link 
                  to="/profile" 
                  onClick={() => setMenuOpen(false)} 
                  className="flex-1 bg-alx-navy-lighter text-alx-lime font-semibold py-2.5 rounded-xl text-sm hover:bg-alx-navy text-center flex items-center justify-center transition-colors duration-200"
                >
                  <User size={14} />
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex-1 bg-red-500/10 text-red-400 border-2 border-red-500/20 font-semibold py-2.5 rounded-xl text-sm hover:bg-red-500/20 transition-colors duration-200"
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
