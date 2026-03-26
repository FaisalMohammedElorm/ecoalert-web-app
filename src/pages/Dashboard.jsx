import { useState, useEffect } from 'react';
import { BarChart2, Recycle, Award, TrendingUp, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWaste } from '../contexts/WasteContext';
import { getReports } from '../services/reportsService';
import StatCard from '../components/StatCard';

const MONTHLY = [
  { month: 'Jan', value: 65 }, { month: 'Feb', value: 45 }, { month: 'Mar', value: 85 },
  { month: 'Apr', value: 75 }, { month: 'May', value: 95 }, { month: 'Jun', value: 55 },
  { month: 'Jul', value: 80 }, { month: 'Aug', value: 90 },
];
const MAX = Math.max(...MONTHLY.map(m => m.value));

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { pickupRequests } = useWaste();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMonth, setActiveMonth] = useState(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadReports();
    }
  }, [user, authLoading]);

  const loadReports = async () => {
    setIsLoading(true);
    const result = await getReports();
    if (result.success) {
      setReports(result.reports);
    }
    setIsLoading(false);
  };

  const total = reports.length;
  const pending = reports.filter(r => r.status === 'pending').length;
  const verified = reports.filter(r => r.status === 'verified').length;
  const resolved = reports.filter(r => r.status === 'resolved').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const userReports = reports.filter(r => r.userId === user?.uid);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 pb-16 pt-3 sm:pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6 animate-fade-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-eco-400">Dashboard</h1>
          <p className="text-gray-500 dark:text-eco-400 text-xs sm:text-sm mt-1">Community impact overview</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-500 shadow-sm flex-shrink-0">
          <Calendar size={13} className="sm:w-4 sm:h-4 text-eco-500" />
          <span className="font-medium">2025</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6 stagger-1 animate-fade-up">
        <StatCard label="Total Reports" value={total} color="#4CAF50" icon={Recycle} />
        <StatCard label="Pending" value={pending} color="#FF9800" icon={Clock} />
        <StatCard label="Verified" value={verified} color="#2196F3" icon={Award} />
        <StatCard label="Resolved" value={resolved} color="#4CAF50" icon={CheckCircle} />
      </div>

      {/* Resolution rate */}
      <div className="card mb-4 sm:mb-6 stagger-2 animate-fade-up p-4 sm:p-6">
        <div className="flex items-start sm:items-center justify-between gap-4 sm:gap-0 mb-3 sm:mb-4 flex-col-reverse sm:flex-row">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Resolution Rate</p>
            <p className="text-3xl sm:text-4xl font-display font-black text-eco-500">{resolutionRate}%</p>
          </div>
          <TrendingUp size={32} className="sm:w-10 sm:h-10 text-eco-200 flex-shrink-0" />
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 sm:h-3 overflow-hidden">
          <div
            className="h-full bg-eco-500 rounded-full transition-all duration-1000"
            style={{ width: `${resolutionRate}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 sm:mt-3">{resolved} out of {total} reports resolved</p>
      </div>

      {/* Monthly Activity Bar Chart */}
      <div className="card mb-4 sm:mb-6 stagger-3 animate-fade-up p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Monthly Activity</p>
            <p className="font-display font-bold text-gray-800 dark:text-eco-400 text-base sm:text-lg">Reports Over Time</p>
          </div>
          <BarChart2 size={18} className="sm:w-5 sm:h-5 text-eco-400 flex-shrink-0" />
        </div>
        <div className="flex items-end gap-1.5 h-32 sm:h-36">
          {MONTHLY.map(({ month, value }) => {
            const pct = (value / MAX) * 100;
            const isActive = activeMonth === month;
            return (
              <div
                key={month}
                className="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
                onClick={() => setActiveMonth(isActive ? null : month)}
              >
                {isActive && (
                  <span className="text-xs font-bold text-eco-600">{value}</span>
                )}
                <div className="w-full relative" style={{ height: '120px' }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-500 group-hover:opacity-80"
                    style={{
                      height: `${pct}%`,
                      backgroundColor: isActive ? '#2E7D32' : '#4CAF50',
                    }}
                  />
                </div>
                <span className="text-xs text-gray-400 font-medium">{month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activities */}
      <div className="stagger-4 animate-fade-up">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Activities</h2>
        <div className="space-y-3">
          {[
            { title: 'Total Waste Reported', value: `${total} reports`, icon: Recycle, color: '#4CAF50' },
            { title: 'Verified Reports', value: `${verified} verified`, icon: Award, color: '#2196F3' },
            { title: 'Your Submissions', value: `${userReports.length} by you`, icon: AlertTriangle, color: '#FF6B6B' },
            { title: 'Pickup Requests', value: `${pickupRequests.length} scheduled`, icon: Calendar, color: '#9C27B0' },
          ].map(({ title, value, icon: Icon, color }) => (
            <div key={title} className="card !p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{value}</p>
              </div>
              <TrendingUp size={18} className="text-eco-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
