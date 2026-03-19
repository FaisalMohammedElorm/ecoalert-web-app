import { useNavigate } from 'react-router-dom';
import {
  Camera, Truck, Map, BarChart2, MapPin,
  ArrowRight, Leaf, CheckCircle, AlertTriangle,
  Clock, TrendingUp, Users
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWaste } from '../contexts/WasteContext';
import { formatDate, STATUS_CONFIG } from '../services/reportsService';
import Toast, { useToast } from '../components/Toast';

const QUICK_ACTIONS = [
  { id: 'report', title: 'Report Waste', subtitle: 'Snap & Submit', icon: Camera, color: '#FF6B6B', route: '/report', desc: 'Report illegal dumping or pollution in your area.' },
  { id: 'pickup', title: 'Request Pickup', subtitle: 'Schedule collection', icon: Truck, color: '#4ECDC4', route: '/tracker', desc: 'Schedule a waste collection at your location.' },
  { id: 'map', title: 'View Map', subtitle: 'Browse issues', icon: Map, color: '#45B7D1', route: '/map', desc: 'Explore all reported issues on an interactive map.' },
  { id: 'dashboard', title: 'Dashboard', subtitle: 'Your stats', icon: BarChart2, color: '#9C27B0', route: '/dashboard', desc: 'Track your impact and community progress.' },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { reports, getPendingReports } = useWaste();
  const { toast, show: showToast, hide: hideToast } = useToast();

  const firstName = user?.name?.split(' ')[0] || 'User';
  const pending = getPendingReports().length;
  const total = reports.length;
  const resolved = reports.filter(r => r.status === 'resolved').length;
  const recentReports = [...reports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => navigate(`/map?lat=${latitude}&lng=${longitude}`),
      () => showToast('Could not retrieve your location. Please allow location access and try again.')
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
      <Toast toast={toast} hide={hideToast} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-eco-600 p-6 sm:p-8 mb-6 mt-2 animate-fade-up">
        <div className="absolute top-0 right-0 w-64 h-64 bg-eco-500/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-eco-700/30 rounded-full blur-2xl translate-y-1/3 pointer-events-none" />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-eco-300 text-xs font-mono tracking-widest uppercase mb-1">Welcome back</p>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-white leading-tight mb-2">
              Hi, {firstName}! 👋
            </h1>
            <p className="text-eco-200/80 text-sm max-w-xs leading-relaxed">
              Let's keep Ghana clean today. Every report you make matters.
            </p>
            <button
              onClick={() => navigate('/report')}
              className="mt-5 inline-flex items-center gap-2 bg-white text-eco-700 font-display font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-eco-50 active:scale-95 transition-all duration-200 shadow-lg"
            >
              <Camera size={15} /> Report an Issue <ArrowRight size={14} />
            </button>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center hover:bg-white/25 active:scale-95 transition-all flex-shrink-0 shadow-lg backdrop-blur-sm"
          >
            <span className="text-white font-display font-black text-2xl">{firstName[0]}</span>
          </button>
        </div>
      </div>

      {/* ── Stats strip ──────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-6 stagger-1 animate-fade-up">
        {[
          { label: 'Total Reports', value: total, icon: AlertTriangle, color: '#FF6B6B' },
          { label: 'Pending', value: pending, icon: Clock, color: '#FF9800' },
          { label: 'Resolved', value: resolved, icon: CheckCircle, color: '#4CAF50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card !p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-200">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `${color}18` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <p className="text-2xl font-display font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 leading-tight mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ────────────────────────────────────── */}
      <div className="mb-6 stagger-2 animate-fade-up">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ id, title, subtitle, icon: Icon, color, route, desc }) => (
            <button
              key={id}
              onClick={() => navigate(route)}
              className="card !p-5 flex flex-col items-start hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all duration-200 group text-left border border-gray-100 hover:border-gray-200"
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon size={22} style={{ color }} />
              </div>
              <p className="font-display font-bold text-gray-800 text-sm group-hover:text-eco-600 transition-colors leading-tight">{title}</p>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed hidden sm:block">{desc}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold" style={{ color }}>
                {subtitle} <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Location + Mini-chart row ─────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6 stagger-3 animate-fade-up">
        <button
          onClick={handleDetectLocation}
          className="card !p-5 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 group text-left w-full"
        >
          <div className="w-14 h-14 bg-eco-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-eco-100 group-hover:scale-105 transition-all duration-200">
            <MapPin size={24} className="text-eco-500" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-display font-bold text-gray-900 group-hover:text-eco-600 transition-colors">Auto-Detect My Location</p>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">Find issues near you on the interactive map.</p>
          </div>
          <ArrowRight size={15} className="text-gray-300 group-hover:text-eco-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </button>

        <div className="card !p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Community Activity</p>
            <TrendingUp size={16} className="text-eco-400" />
          </div>
          <div className="flex items-end gap-1 h-14 mb-3">
            {[40, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm bg-eco-500 transition-all hover:bg-eco-600 cursor-pointer"
                style={{ height: `${h}%`, opacity: 0.45 + i * 0.07 }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              <span className="font-display font-bold text-eco-600 text-base">{resolved}</span> resolved this year
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Users size={11} /> Accra
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Reports ────────────────────────────────────── */}
      {recentReports.length > 0 && (
        <div className="stagger-4 animate-fade-up">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Recent Reports</h2>
            <button
              onClick={() => navigate('/map')}
              className="text-eco-600 text-xs font-semibold hover:text-eco-700 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {recentReports.map(report => {
              const statusCfg = STATUS_CONFIG[report.status] || STATUS_CONFIG.pending;
              const emoji =
                report.category === 'Plastic Waste' ? '♻️' :
                report.category === 'Organic Waste' ? '🌿' :
                report.category === 'Hazardous Waste' ? '☠️' :
                report.category === 'Road Hazard' ? '🚧' :
                report.category === 'E-Waste' ? '💻' : '🗑️';
              return (
                <button
                  key={report.id}
                  onClick={() => navigate('/map')}
                  className="card !p-4 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group w-full text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-eco-50 flex items-center justify-center flex-shrink-0 text-lg">
                    {emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 truncate group-hover:text-eco-600 transition-colors">
                      {report.category || 'Environmental Issue'}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5 flex items-center gap-1">
                      <MapPin size={10} /> {report.location}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ color: statusCfg.color, backgroundColor: statusCfg.bg }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusCfg.dot }} />
                      {statusCfg.label}
                    </span>
                    <p className="text-xs text-gray-300">{formatDate(report.createdAt)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <div className="mt-6 stagger-5 animate-fade-up">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-eco-500 to-eco-600 p-6 flex items-center justify-between gap-4">
          <div className="absolute right-0 top-0 h-full w-40 bg-white/5 transform skew-x-12 translate-x-16 pointer-events-none" />
          <div className="relative z-10">
            <p className="text-white font-display font-bold text-lg leading-tight">Ready to make a difference?</p>
            <p className="text-eco-200/80 text-sm mt-0.5">Every report counts for a cleaner Ghana.</p>
          </div>
          <button
            onClick={() => navigate('/report')}
            className="relative z-10 bg-white text-eco-700 font-display font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-eco-50 active:scale-95 transition-all flex items-center gap-1.5 flex-shrink-0 shadow-lg whitespace-nowrap"
          >
            <Leaf size={14} /> Report Now
          </button>
        </div>
      </div>
    </div>
  );
}
