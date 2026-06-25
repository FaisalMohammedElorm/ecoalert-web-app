import { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard, FileText, Users, RefreshCw, Search, Trash2,
  CheckCircle, Clock, BadgeCheck, TrendingUp, AlertTriangle,
  ShieldCheck, MapPin, X, Inbox,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  getReports, getAllUsers, updateReportStatus, adminDeleteReport, setUserRole,
  getCategoryConfig, CATEGORIES, STATUS_CONFIG, formatDate,
} from '../services/reportsService';
import { isAdminUser, ADMIN_EMAILS } from '../config/admin';
import StatusBadge from '../components/StatusBadge';
import Toast, { useToast } from '../components/Toast';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'users', label: 'Users', icon: Users },
];

const STATUS_META = {
  pending: { label: 'Pending', color: '#FF9800', icon: Clock },
  verified: { label: 'Verified', color: '#2196F3', icon: BadgeCheck },
  resolved: { label: 'Resolved', color: '#02b75e', icon: CheckCircle },
};

function Kpi({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="card !p-3 sm:!p-4 flex flex-col gap-1.5 sm:gap-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18` }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-display font-black leading-none" style={{ color }}>{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export default function Admin() {
  const { user } = useAuth();
  const { toast, show: showToast, hide: hideToast } = useToast();

  const [tab, setTab] = useState('overview');
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [pendingDelete, setPendingDelete] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const loadData = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    const [rRes, uRes] = await Promise.all([getReports(), getAllUsers()]);
    if (rRes.success) setReports(rRes.reports);
    if (uRes.success) setUsers(uRes.users);
    if (!rRes.success && !uRes.success) showToast('Failed to load admin data.', 'error');
    isRefresh ? setRefreshing(false) : setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  // ─── Derived stats ───
  const total = reports.length;
  const pending = reports.filter(r => r.status === 'pending').length;
  const verified = reports.filter(r => r.status === 'verified').length;
  const resolved = reports.filter(r => r.status === 'resolved').length;
  const resolutionRate = total ? Math.round((resolved / total) * 100) : 0;

  const usersById = useMemo(
    () => Object.fromEntries(users.map(u => [u.id, u])),
    [users]
  );

  const categoryBreakdown = useMemo(() => CATEGORIES.map(c => ({
    ...c,
    count: reports.filter(r => getCategoryConfig(r.category).id === c.id).length,
  })).sort((a, b) => b.count - a.count), [reports]);

  const recentReports = useMemo(
    () => [...reports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    [reports]
  );

  const filteredReports = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reports.filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && getCategoryConfig(r.category).id !== categoryFilter) return false;
      if (q) {
        const hay = `${r.category || ''} ${r.location || ''} ${r.description || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [reports, search, statusFilter, categoryFilter]);

  // ─── Actions ───
  const handleStatus = async (report, status) => {
    if (report.status === status) return;
    const prev = report.status;
    setReports(rs => rs.map(r => r.id === report.id ? { ...r, status } : r));
    const res = await updateReportStatus(report.id, status);
    if (res.success) {
      showToast(`Marked as ${STATUS_META[status]?.label || status}.`, 'success');
    } else {
      setReports(rs => rs.map(r => r.id === report.id ? { ...r, status: prev } : r));
      showToast(res.error || 'Failed to update status.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setBusyId(id);
    const res = await adminDeleteReport(id);
    setBusyId(null);
    if (res.success) {
      setReports(rs => rs.filter(r => r.id !== id));
      showToast('Report deleted.', 'success');
    } else {
      showToast(res.error || 'Failed to delete report.', 'error');
    }
    setPendingDelete(null);
  };

  const handleToggleRole = async (u) => {
    if (u.id === user?.uid) { showToast("You can't change your own role.", 'error'); return; }
    if (u.email && ADMIN_EMAILS.map(e => e.toLowerCase()).includes(u.email.toLowerCase())) {
      showToast('This user is a configured owner and is always an admin.', 'error');
      return;
    }
    const nextRole = u.role === 'admin' ? 'user' : 'admin';
    setBusyId(u.id);
    const res = await setUserRole(u.id, nextRole);
    setBusyId(null);
    if (res.success) {
      setUsers(us => us.map(x => x.id === u.id ? { ...x, role: nextRole } : x));
      showToast(nextRole === 'admin' ? `${u.name || 'User'} is now an admin.` : `Admin access revoked.`, 'success');
    } else {
      showToast(res.error || 'Failed to update role.', 'error');
    }
  };

  const clearFilters = () => { setSearch(''); setStatusFilter('all'); setCategoryFilter('all'); };
  const hasFilters = search || statusFilter !== 'all' || categoryFilter !== 'all';

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pb-16 pt-3 sm:pt-4">
      <Toast toast={toast} hide={hideToast} />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4 sm:mb-6 animate-fade-up">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-electric-blue/10 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={22} className="text-electric-blue" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white leading-tight">Admin</h1>
            <p className="text-gray-500 dark:text-gray-300 text-xs sm:text-sm">Manage reports, users & community impact</p>
          </div>
        </div>
        <button
          onClick={() => loadData(true)}
          disabled={refreshing || loading}
          className="btn-icon flex-shrink-0 disabled:opacity-50"
          title="Refresh data"
          aria-label="Refresh data"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-xl mb-4 sm:mb-6 animate-fade-up stagger-1 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          const count = id === 'reports' ? reports.length : id === 'users' ? users.length : null;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-1 justify-center ${
                active
                  ? 'bg-white dark:bg-alx-navy text-electric-blue shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Icon size={16} />
              {label}
              {count !== null && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${active ? 'bg-electric-blue/10 text-electric-blue' : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card !p-4 h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* ═══ OVERVIEW ═══ */}
          {tab === 'overview' && (
            <div className="space-y-4 sm:space-y-6 animate-fade-up stagger-2">
              {/* KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                <Kpi icon={FileText} label="Total Reports" value={total} color="#0452f0" />
                <Kpi icon={Clock} label="Pending" value={pending} color="#FF9800" />
                <Kpi icon={BadgeCheck} label="Verified" value={verified} color="#2196F3" />
                <Kpi icon={CheckCircle} label="Resolved" value={resolved} color="#02b75e" />
                <Kpi icon={Users} label="Users" value={users.length} color="#9C27B0" />
                <Kpi icon={TrendingUp} label="Resolution Rate" value={`${resolutionRate}%`} color="#02b75e" sub={`${resolved} of ${total} resolved`} />
              </div>

              {/* Status distribution */}
              <div className="card p-4 sm:p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Status Distribution</h3>
                <div className="space-y-3">
                  {['pending', 'verified', 'resolved'].map(s => {
                    const count = reports.filter(r => r.status === s).length;
                    const pct = total ? Math.round((count / total) * 100) : 0;
                    const meta = STATUS_META[s];
                    return (
                      <div key={s}>
                        <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                          <span className="flex items-center gap-1.5 font-medium text-gray-600 dark:text-gray-300">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                            {meta.label}
                          </span>
                          <span className="text-gray-400 font-medium">{count} · {pct}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: meta.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Category breakdown */}
                <div className="card p-4 sm:p-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Reports by Category</h3>
                  <div className="space-y-3">
                    {categoryBreakdown.map(c => {
                      const Icon = c.icon;
                      const pct = total ? Math.round((c.count / total) * 100) : 0;
                      return (
                        <div key={c.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${c.color}18` }}>
                            <Icon size={15} style={{ color: c.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                              <span className="font-medium text-gray-700 dark:text-gray-200 truncate">{c.label}</span>
                              <span className="text-gray-400 font-medium flex-shrink-0 ml-2">{c.count}</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: c.color }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent reports */}
                <div className="card p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Recent Reports</h3>
                    {reports.length > 0 && (
                      <button onClick={() => setTab('reports')} className="text-xs font-semibold text-electric-blue hover:underline">View all</button>
                    )}
                  </div>
                  {recentReports.length === 0 ? (
                    <p className="text-sm text-gray-400 py-6 text-center">No reports yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {recentReports.map(r => {
                        const cat = getCategoryConfig(r.category);
                        const Icon = cat.icon;
                        return (
                          <div key={r.id} className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${cat.color}18` }}>
                              <Icon size={16} style={{ color: cat.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{r.category || 'Report'}</p>
                              <p className="text-xs text-gray-400 truncate">{r.location || 'Unknown location'}</p>
                            </div>
                            <StatusBadge status={r.status} />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══ REPORTS ═══ */}
          {tab === 'reports' && (
            <div className="space-y-3 sm:space-y-4 animate-fade-up stagger-2">
              {/* Toolbar */}
              <div className="card p-3 sm:p-4 space-y-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by category, location or description…"
                    className="input-field pl-9 text-sm"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {['all', 'pending', 'verified', 'resolved'].map(s => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                        statusFilter === s
                          ? 'bg-electric-blue text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="ml-auto bg-gray-100 dark:bg-white/10 border-0 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 px-3 py-1.5 outline-none focus:ring-2 focus:ring-electric-blue/30"
                  >
                    <option value="all">All categories</option>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                  {hasFilters && (
                    <button onClick={clearFilters} className="text-xs font-medium text-red-500 hover:text-red-600">Clear</button>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-400 px-1">
                Showing {filteredReports.length} of {reports.length} report{reports.length !== 1 ? 's' : ''}
              </p>

              {/* List */}
              {filteredReports.length === 0 ? (
                <div className="card flex flex-col items-center py-12 sm:py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
                    <Inbox size={26} className="text-gray-300 dark:text-gray-500" />
                  </div>
                  <p className="font-display font-bold text-gray-500 dark:text-gray-300">No reports found</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {reports.length === 0 ? 'Reports submitted by users will appear here.' : 'Try adjusting your filters.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredReports.map(r => {
                    const cat = getCategoryConfig(r.category);
                    const Icon = cat.icon;
                    const reporter = usersById[r.userId];
                    return (
                      <div key={r.id} className="card !p-3 sm:!p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${cat.color}18` }}>
                            <Icon size={18} style={{ color: cat.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-gray-800 dark:text-white">{r.category || 'Report'}</p>
                              <StatusBadge status={r.status} />
                            </div>
                            {r.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{r.description}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-gray-400 mt-1.5 flex-wrap">
                              <span className="flex items-center gap-1 min-w-0"><MapPin size={11} className="flex-shrink-0" /><span className="truncate max-w-[160px]">{r.location || 'Unknown'}</span></span>
                              <span className="flex items-center gap-1"><Clock size={11} />{formatDate(r.createdAt)}</span>
                              <span className="truncate">by {reporter?.name || reporter?.email || (r.userId ? `${r.userId.slice(0, 6)}…` : 'Unknown')}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setPendingDelete(r)}
                            disabled={busyId === r.id}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex-shrink-0 disabled:opacity-40"
                            title="Delete report"
                            aria-label="Delete report"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {/* Status actions */}
                        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-white/10">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mr-1">Set status</span>
                          {Object.entries(STATUS_META).map(([key, meta]) => {
                            const StatusIcon = meta.icon;
                            const active = r.status === key;
                            return (
                              <button
                                key={key}
                                onClick={() => handleStatus(r, key)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border"
                                style={active
                                  ? { backgroundColor: meta.color, borderColor: meta.color, color: '#fff' }
                                  : { borderColor: `${meta.color}40`, color: meta.color }}
                              >
                                <StatusIcon size={12} /> {meta.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═══ USERS ═══ */}
          {tab === 'users' && (
            <div className="space-y-2 animate-fade-up stagger-2">
              {users.length === 0 ? (
                <div className="card flex flex-col items-center py-12 sm:py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
                    <Users size={26} className="text-gray-300 dark:text-gray-500" />
                  </div>
                  <p className="font-display font-bold text-gray-500 dark:text-gray-300">No users found</p>
                  <p className="text-xs text-gray-400 mt-1">Registered users will appear here.</p>
                </div>
              ) : (
                users.map(u => {
                  const admin = isAdminUser(u);
                  const isOwner = u.email && ADMIN_EMAILS.map(e => e.toLowerCase()).includes(u.email.toLowerCase());
                  const isSelf = u.id === user?.uid;
                  return (
                    <div key={u.id} className="card !p-3 sm:!p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-electric-blue/10 flex items-center justify-center flex-shrink-0">
                        <span className="font-display font-bold text-electric-blue">{(u.name || u.email || 'U')[0].toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{u.name || 'Unnamed user'}</p>
                          {admin && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-electric-blue/10 text-electric-blue">
                              <ShieldCheck size={10} /> {isOwner ? 'Owner' : 'Admin'}
                            </span>
                          )}
                          {isSelf && <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">You</span>}
                        </div>
                        <p className="text-xs text-gray-400 truncate">{u.email || '—'}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 flex-wrap">
                          <span>{u.reportsCount ?? 0} reports</span>
                          <span>{u.verifiedReportsCount ?? 0} verified</span>
                          {u.createdAt && <span>joined {formatDate(u.createdAt)}</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleRole(u)}
                        disabled={busyId === u.id || isOwner || isSelf}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${
                          u.role === 'admin'
                            ? 'bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20'
                            : 'bg-electric-blue/10 text-electric-blue hover:bg-electric-blue/20'
                        }`}
                        title={isOwner ? 'Configured owner — always admin' : isSelf ? "You can't change your own role" : ''}
                      >
                        {u.role === 'admin' ? 'Revoke' : 'Make admin'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </>
      )}

      {/* Delete confirmation modal */}
      {pendingDelete && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4" onClick={() => setPendingDelete(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
          <div className="relative card max-w-sm w-full animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/15 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white">Delete report?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  This permanently removes the <span className="font-semibold">{pendingDelete.category || 'report'}</span> report. This can't be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPendingDelete(null)} className="flex-1 btn-secondary text-sm py-2.5">Cancel</button>
              <button
                onClick={handleDelete}
                disabled={busyId === pendingDelete.id}
                className="flex-1 bg-red-500 text-white font-semibold py-2.5 rounded-xl hover:bg-red-600 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {busyId === pendingDelete.id
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Trash2 size={15} /> Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
