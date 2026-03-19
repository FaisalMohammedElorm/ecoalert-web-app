export default function StatCard({ label, value, color = '#4CAF50', icon: Icon, sublabel }) {
  return (
    <div className="card flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
        {Icon && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
            <Icon size={16} style={{ color }} />
          </div>
        )}
      </div>
      <p className="text-3xl font-display font-bold" style={{ color }}>{value}</p>
      {sublabel && <p className="text-xs text-gray-400">{sublabel}</p>}
    </div>
  );
}
