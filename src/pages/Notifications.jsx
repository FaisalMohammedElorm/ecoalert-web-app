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
    <div className="max-w-2xl mx-auto px-3 sm:px-4 md:px-6 pb-16 pt-3 sm:pt-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-6 mb-4 sm:mb-6 animate-fade-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">Notifications</h1>
          {unread > 0 && <p className="text-alx-lime text-xs sm:text-sm mt-0.5 font-medium">{unread} unread</p>}
        </div>
        {items.length > 0 && (
          <div className="flex gap-1.5 sm:gap-2">
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs bg-alx-lime/10 text-alx-lime font-semibold hover:bg-alx-lime/20 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors">
                Mark all read
              </button>
            )}
            <button onClick={clearAll} className="text-xs bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 font-semibold hover:text-red-600 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 transition-colors">
              <Trash2 size={10} className="sm:w-3 sm:h-3" /> Clear
            </button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card flex flex-col items-center py-16 sm:py-20 text-center animate-fade-up">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-alx-navy-light rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
            <Bell size={28} className="sm:w-8 sm:h-8 text-gray-300 dark:text-alx-lime/40" />
          </div>
          <p className="font-display font-bold text-gray-500 dark:text-gray-300 text-base sm:text-lg">No notifications</p>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1 sm:mt-2">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-1.5 sm:space-y-2">
          {items.map(({ id, title, description, time, icon: Icon, iconColor, status, read }) => {
            const colors = STATUS_COLORS[status] || STATUS_COLORS.info;
            return (
              <div
                key={id}
                onClick={() => markRead(id)}
                className={`card !p-3 sm:!p-5 flex items-start gap-2.5 sm:gap-4 cursor-pointer hover:shadow-md transition-all duration-200 ${!read ? 'ring-1 ring-alx-lime/20' : ''}`}
              >
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${iconColor}18` }}
                >
                  <Icon size={18} className="sm:w-5 sm:h-5" style={{ color: iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                    <p className={`text-sm sm:text-base font-semibold ${!read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'} truncate`}>{title}</p>
                    {!read && <span className="w-2 h-2 bg-alx-lime rounded-full flex-shrink-0" />}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-1.5 sm:mb-2 line-clamp-2">{description}</p>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span
                      className="inline-flex items-center gap-0.5 text-xs sm:text-sm font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full"
                      style={{ backgroundColor: colors.bg, color: colors.dot }}
                    >
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" style={{ backgroundColor: colors.dot }} />
                      {status}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-300 hidden sm:inline">{time}</span>
                    <span className="text-xs text-gray-300 sm:hidden">{time}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); remove(id); }}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors flex-shrink-0"
                >
                  <X size={12} className="sm:w-4 sm:h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
