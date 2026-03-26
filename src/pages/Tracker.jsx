import { useState, useEffect } from 'react';
import { Truck, CheckCircle, Clock, Plus, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, createTracking, getUserTrackings } from '../services/reportsService';
import Toast, { useToast } from '../components/Toast';

const SEED_ORDERS = [
  { id: 'o1', type: 'Organic Waste Collection', location: 'Trinity Avenue, Accra', status: 'In Progress', time: '10:30 AM', progress: 75 },
  { id: 'o2', type: 'Plastic Waste Collection', location: 'Kwame Nkrumah Avenue', status: 'Pickup Scheduled', time: '2:00 PM', progress: 25 },
];

export default function Tracker() {
  const { user, isLoading: authLoading } = useAuth();
  const [trackings, setTrackings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: '', quantity: '', weight: '', unit: 'kg', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const { toast, show: showToast, hide: hideToast } = useToast();

  useEffect(() => {
    if (!authLoading && user) {
      loadTrackings();
    }
  }, [user, authLoading]);

  const loadTrackings = async () => {
    setIsLoading(true);
    const result = await getUserTrackings(user.uid);
    if (result.success) {
      setTrackings(result.trackings);
    }
    setIsLoading(false);
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!form.category || !form.quantity) {
      showToast('Please fill in required fields', 'error');
      return;
    }
    
    setSubmitting(true);
    const result = await createTracking({
      category: form.category,
      quantity: parseInt(form.quantity),
      weight: form.weight ? parseFloat(form.weight) : 0,
      unit: form.unit,
      notes: form.notes,
    });

    setSubmitting(false);

    if (result.success) {
      showToast('Tracking entry created!', 'success');
      setForm({ category: '', quantity: '', weight: '', unit: 'kg', notes: '' });
      setShowForm(false);
      loadTrackings();
    } else {
      showToast(result.error || 'Failed to create tracking entry', 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 md:px-6 pb-16 pt-3 sm:pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 animate-fade-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">Tracker</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Log your waste collection efforts</p>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          className="btn-primary text-xs sm:text-sm py-2 sm:py-2.5 px-3 sm:px-4 flex items-center gap-1 justify-center"
        >
          <Plus size={14} className="sm:w-4 sm:h-4" /> Log Collection
        </button>
      </div>

      {/* Request form */}
      {showForm && (
        <div className="card mb-4 sm:mb-6 animate-fade-up border-eco-200 p-4 sm:p-6">
          <h3 className="font-display font-bold text-gray-800 text-base sm:text-lg mb-4">Log Waste Collection</h3>
          <form onSubmit={handleRequest} className="space-y-3 sm:space-y-4">
            <div>
              <label className="label text-sm">Waste Category *</label>
              <select className="input-field text-sm" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} required>
                <option value="">Select category…</option>
                {['Plastic Waste', 'Organic Waste', 'E-Waste', 'Hazardous Waste', 'Mixed Waste', 'Road Hazard'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label text-sm">Quantity (items) *</label>
              <input className="input-field text-sm" type="number" placeholder="Number of items…" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="col-span-2">
                <label className="label text-sm">Weight <span className="normal-case font-normal text-gray-400 text-xs">(optional)</span></label>
                <input className="input-field text-sm" type="number" placeholder="Enter weight…" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))} step="0.1" />
              </div>
              <div>
                <label className="label text-sm">Unit</label>
                <select className="input-field text-sm" value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}>
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                  <option value="g">g</option>
                  <option value="tons">tons</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label text-sm">Notes <span className="normal-case font-normal text-gray-400 text-xs">(optional)</span></label>
              <textarea className="input-field resize-none h-14 sm:h-16 text-sm" placeholder="Any special details…" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 btn-secondary text-xs sm:text-sm py-2 sm:py-2.5">Cancel</button>
              <button type="submit" disabled={submitting} className="flex-1 btn-primary text-xs sm:text-sm py-2 sm:py-2.5 flex items-center justify-center gap-1">
                {submitting ? <span className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>✓ Log</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Arrival banner */}
      <div className="card bg-eco-50 border-eco-100 !p-4 flex items-center gap-4 mb-6 stagger-1 animate-fade-up">
        <div className="w-12 h-12 bg-eco-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Truck size={22} className="text-eco-600" />
        </div>
        <div>
          <p className="font-display font-bold text-eco-700">Truck Arriving in 5 Minutes</p>
          <p className="text-eco-600/70 text-xs mt-0.5">Trinity Avenue · Organic Waste Collection</p>
        </div>
      </div>

      {/* Toast */}
      <Toast toast={toast} hide={hideToast} />

      {/* Active orders */}
      <div className="mb-6 stagger-2 animate-fade-up">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Sample Active Collection</h2>
        <div className="space-y-3">
          {SEED_ORDERS.map(order => (
            <div key={order.id} className="card !p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">{order.type}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} /> {order.location}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                  order.status === 'In Progress' ? 'bg-eco-50 text-eco-600' : 'bg-orange-50 text-orange-500'
                }`}>{order.status}</span>
              </div>
              <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                <Clock size={11} /> Scheduled {order.time}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-eco-500 rounded-full transition-all duration-700"
                    style={{ width: `${order.progress}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-eco-600 w-8 text-right">{order.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your tracking entries */}
      <div className="stagger-3 animate-fade-up">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Your Waste Tracking</h2>
        {isLoading ? (
          <div className="text-center py-8 text-gray-400">Loading tracking entries...</div>
        ) : trackings.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No tracking entries yet</p>
            <p className="text-xs mt-1">Start logging your waste collections above!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {trackings.map(tracking => (
              <div key={tracking.id} className="card !p-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-700 text-sm">{tracking.category}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{tracking.quantity} items · {tracking.weight} {tracking.unit}</p>
                  {tracking.notes && <p className="text-xs text-gray-500 mt-1 italic">"{tracking.notes}"</p>}
                </div>
                <div className="text-right text-xs text-gray-400">
                  {formatDate(tracking.date)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
