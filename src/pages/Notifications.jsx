import { useState } from 'react';
import { Camera, Truck, CheckCircle, Bell, X, Trash2 } from 'lucide-react';

const INITIAL = [
  { id: 1, type: 'waste_reported', title: 'Waste Reported', description: 'Your waste report has been submitted successfully', time: '2 hours ago', icon: Camera, iconColor: '#4CAF50', status: 'completed', read: false },
  { id: 2, type: 'pickup_scheduled', title: 'Pickup Scheduled', description: 'Waste pickup has been scheduled for tomorrow at 10:00 AM', time: 'Yesterday', icon: Truck, iconColor: '#FF9800', status: 'pending', read: false },
  { id: 3, type: 'pickup_completed', title: 'Pickup Completed', description: 'Your waste collection in Osu has been completed successfully', time: '3 days ago', icon: CheckCircle, iconColor: '#2196F3', status: 'completed', read: true },
  { id: 4, type: 'reminder', title: 'Pickup Reminder', description: "Don't forget to put out your waste bins by 8:00 AM tomorrow.", time: '1 week ago', icon: Bell, iconColor: '#FF6B6B', status: 'info', read: true },
];

const STATUS_COLORS = {
  completed: { dot: '#4CAF50', bg: '#E8F5E9' },
  pending: { dot: '#FF9800', bg: '#FFF3E0' },
  info: { dot: '#2196F3', bg: '#E3F2FD' },
};

export default function Notifications() {
  const [items, setItems] = useState(INITIAL);

  const markRead = (id) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const remove = (id) => setItems(prev => prev.filter(n => n.id !== id));
  const clearAll = () => setItems([]);
  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));

  const unread = items.filter(n => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-16 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 animate-fade-up">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-eco-400">Notifications</h1>
          {unread > 0 && <p className="text-eco-600 dark:text-eco-400 text-sm mt-0.5 font-medium">{unread} unread</p>}
        </div>
        {items.length > 0 && (
          <div className="flex gap-2">
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-eco-600 font-semibold hover:text-eco-700 bg-eco-50 px-3 py-1.5 rounded-lg">
                Mark all read
              </button>
            )}
            <button onClick={clearAll} className="text-xs text-red-500 font-semibold hover:text-red-600 bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
              <Trash2 size={11} /> Clear all
            </button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center animate-fade-up">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <Bell size={28} className="text-gray-300" />
          </div>
          <p className="font-display font-bold text-gray-500">No notifications</p>
          <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(({ id, title, description, time, icon: Icon, iconColor, status, read }) => {
            const colors = STATUS_COLORS[status] || STATUS_COLORS.info;
            return (
              <div
                key={id}
                onClick={() => markRead(id)}
                className={`card !p-4 flex items-start gap-3 cursor-pointer hover:shadow-md transition-all duration-200 ${!read ? 'ring-1 ring-eco-100' : ''}`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${iconColor}18` }}
                >
                  <Icon size={18} style={{ color: iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-semibold ${!read ? 'text-gray-900' : 'text-gray-600'} dark:text-eco-400`}>{title}</p>
                    {!read && <span className="w-2 h-2 rounded-full bg-eco-500 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-white leading-relaxed mb-1.5">{description}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: colors.bg, color: colors.dot }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.dot }} />
                      {status}
                    </span>
                    <span className="text-xs text-gray-300">{time}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); remove(id); }}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors flex-shrink-0"
                >
                  <X size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
