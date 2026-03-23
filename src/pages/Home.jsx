import { useNavigate } from 'react-router-dom';
import {
  Camera, Truck, Map, BarChart2, MapPin,
  ArrowRight, Leaf, CheckCircle, AlertTriangle,
  Clock, TrendingUp, Users, Zap, Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWaste } from '../contexts/WasteContext';
import { formatDate, STATUS_CONFIG } from '../services/reportsService';
import Toast, { useToast } from '../components/Toast';
import HeroSection from '../components/HeroSection';
import GradientCard from '../components/GradientCard';
import AnimatedCounter from '../components/AnimatedCounter';
import SectionHeader from '../components/SectionHeader';

const QUICK_ACTIONS = [
  { id: 'report', title: 'Report Issue', icon: Camera, color: '#FF6B6B', bg: 'from-red-500 to-red-600', route: '/report', desc: 'Snap & report waste in seconds' },
  { id: 'pickup', title: 'Request Pickup', icon: Truck, color: '#4ECDC4', bg: 'from-teal-500 to-teal-600', route: '/tracker', desc: 'Schedule collection' },
  { id: 'map', title: 'View Map', icon: Map, color: '#45B7D1', bg: 'from-blue-500 to-blue-600', route: '/map', desc: 'Browse all issues' },
  { id: 'dashboard', title: 'Your Stats', icon: BarChart2, color: '#9C27B0', bg: 'from-purple-500 to-purple-600', route: '/dashboard', desc: 'Track impact' },
];

const STATS = [
  { label: 'Total Reports', icon: AlertTriangle, color: '#FF6B6B' },
  { label: 'Pending', icon: Clock, color: '#FF9800' },
  { label: 'Resolved', icon: CheckCircle, color: '#4CAF50' },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { reports, getPendingReports } = useWaste();
  const { toast, show: showToast, hide: hideToast } = useToast();

  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User';
  const pending = getPendingReports().length;
  const total = reports.length;
  const resolved = reports.filter(r => r.status === 'resolved').length;
  const recentReports = [...reports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => navigate(`/map?lat=${latitude}&lng=${longitude}`),
      () => showToast('Could not retrieve your location.')
    );
  };

  return (
    <div className="min-h-screen pb-20">
      <Toast toast={toast} hide={hideToast} />

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <HeroSection
          title={`Keep Ghana Clean, ${firstName}`}
          subtitle="Report environmental issues, track cleanup progress, and join thousands making a difference."
          badge="Environmental Platform"
          cta="Report an Issue"
          ctaAction={() => navigate('/report')}
          secondaryCta="View Interactive Map"
          secondaryCtaAction={() => navigate('/map')}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          STATS SECTION
          ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATS.map(({ label, icon: Icon, color }, idx) => {
            const values = [total, pending, resolved];
            return (
              <GradientCard
                key={label}
                icon={Icon}
                title={label}
                value={<AnimatedCounter end={values[idx]} duration={1200} />}
                subtitle="Community"
                color={color}
                gradient={
                  idx === 0 ? 'from-red-500 to-red-600' :
                  idx === 1 ? 'from-amber-500 to-amber-600' :
                  'from-green-500 to-green-600'
                }
              />
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          QUICK ACTIONS
          ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
        <SectionHeader
          title="Quick Actions"
          subtitle="Start making an impact right now"
          icon={Zap}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-2 animate-fade-up">
          {QUICK_ACTIONS.map(({ id, title, icon: Icon, color, route, desc }, idx) => (
            <button
              key={id}
              onClick={() => navigate(route)}
              className="group relative overflow-hidden card hover:shadow-xl hover:-translate-y-2 p-5 text-left"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Gradient background accent */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br opacity-5 rounded-full blur-2xl group-hover:opacity-15 transition-all duration-300" style={{ backgroundColor: color }} />

              <div className="relative z-10">
                <div className="mb-4 inline-flex p-3 rounded-xl group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${color}15` }}>
                  <Icon size={24} style={{ color }} />
                </div>
                <p className="font-display font-bold text-eco-600 dark:text-eco-400 text-sm group-hover:text-eco-700 dark:group-hover:text-eco-300 transition-colors leading-tight">{title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">{desc}</p>
              </div>

              <ArrowRight size={16} className="absolute bottom-4 right-4 text-gray-300 group-hover:text-eco-500 group-hover:translate-x-1 transition-all duration-300 opacity-0 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          LOCATION & INSIGHTS
          ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
        <div className="grid lg:grid-cols-2 gap-4 stagger-3 animate-fade-up">
          {/* Location Card */}
          <button
            onClick={handleDetectLocation}
            className="card hover:shadow-xl hover:-translate-y-1 p-6 flex items-center gap-4 text-left group"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-eco-100 to-eco-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <MapPin size={28} className="text-eco-600" />
            </div>
            <div>
              <p className="font-display font-bold text-lg text-eco-600 transition-colors">Find Issues Near Me</p>
              <p className="text-sm text-gray-500 mt-1">Auto-detect & browse nearby reports</p>
            </div>
          </button>

          {/* Activity Insights Card */}
          <div className="card hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-gray-900 dark:text-eco-400">Community Activity</h3>
              <TrendingUp size={18} className="text-eco-500" />
            </div>

            {/* Mini Chart */}
            <div className="flex items-end gap-1 h-16 mb-4">
              {[40, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-eco-500 to-eco-300 hover:from-eco-600 hover:to-eco-400 cursor-pointer transition-all duration-200 hover:scale-y-110 origin-bottom"
                  style={{ height: `${h}%`, opacity: 0.5 + i * 0.06 }}
                  title={`Day ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-600">
                <span className="font-display font-bold text-eco-600"><AnimatedCounter end={resolved} /></span> resolved this month
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-eco-600">
                <Users size={14} /> Accra
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          RECENT REPORTS
          ═══════════════════════════════════════════════════════════ */}
      {recentReports.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12 stagger-4 animate-fade-up">
          <SectionHeader
            title="Recent Reports"
            subtitle="Latest community contributions"
            icon={AlertTriangle}
            action={() => navigate('/map')}
            actionLabel="View All"
          />

          <div className="space-y-2">
            {recentReports.map((report, idx) => {
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
                  className="card p-4 flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group w-full text-left"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-eco-100 to-eco-50 flex items-center justify-center flex-shrink-0 text-xl group-hover:scale-110 transition-transform duration-300">
                    {emoji}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-display font-bold text-eco-600 transition-colors">
                      {report.category || 'Environmental Issue'}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                      <MapPin size={12} /> {report.location}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ color: statusCfg.color, backgroundColor: statusCfg.bg }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusCfg.dot }} />
                      {statusCfg.label}
                    </span>
                    <p className="text-xs text-gray-400 font-medium">{formatDate(report.createdAt)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          CTA BANNER
          ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 stagger-5 animate-fade-up">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-eco-500 via-eco-600 to-eco-700 p-6 sm:p-8 flex items-center justify-between gap-6">
          {/* Animated background elements */}
          <div className="absolute right-0 top-0 h-full w-96 bg-white/5 transform skew-x-12 translate-x-24 pointer-events-none animate-float" />
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse-soft" />

          <div className="relative z-10 flex-1">
            <h3 className="text-2xl sm:text-3xl font-display font-black text-white leading-tight">
              🌍 Ready to Make a Difference?
            </h3>
            <p className="text-eco-200/90 text-sm sm:text-base mt-2">
              Join thousands of Ghanaians keeping our communities clean. Report an issue today!
            </p>
          </div>

          <button
            onClick={() => navigate('/report')}
            className="relative z-10 bg-white text-eco-700 font-display font-bold px-6 py-3 rounded-xl text-sm sm:text-base hover:bg-eco-50 active:scale-95 transition-all duration-200 flex items-center gap-2 flex-shrink-0 shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            <Leaf size={16} /> Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
