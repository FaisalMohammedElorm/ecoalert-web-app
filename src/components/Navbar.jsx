import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Map, Home, AlertTriangle, BarChart2, Bell, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ecoAlertLogo from '../assets/EcoAlert.png';

const NAV_LINKS = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/report', label: 'Report', icon: AlertTriangle },
  { to: '/map', label: 'Map View', icon: Map },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart2 },
  { to: '/tracker', label: 'Tracker', icon: Bell },
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
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/home" className="flex items-center group">
              <img
                src={ecoAlertLogo}
                alt="EcoAlert logo"
                className="h-10 w-auto object-contain group-hover:scale-[1.03] transition-transform duration-200"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => {
                const active = pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-eco-50 text-eco-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={15} />
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/report"
                className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5"
              >
                <AlertTriangle size={14} />
                Report Issue
              </Link>
              <Link to="/profile" className="w-8 h-8 rounded-full bg-eco-100 flex items-center justify-center hover:bg-eco-200 transition-colors">
                <User size={16} className="text-eco-700" />
              </Link>
              <button onClick={handleLogout} className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors" title="Logout">
                <LogOut size={14} className="text-red-500" />
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(m => !m)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div
            className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-4 space-y-1"
            onClick={e => e.stopPropagation()}
          >
            {NAV_LINKS.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active ? 'bg-eco-50 text-eco-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-gray-100 flex gap-2">
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex-1 btn-secondary text-sm py-2.5 text-center flex items-center justify-center gap-2">
                <User size={15} /> Profile
              </Link>
              <button onClick={handleLogout} className="flex-1 bg-red-50 text-red-600 border-2 border-red-100 font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
                <LogOut size={15} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
