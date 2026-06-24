export default function StatCard({ label, value, color = '#D4FF00', icon: Icon, sublabel }) {
  return (
    <div className="card flex flex-col gap-2 rounded-xl border border-alx-lime/10 bg-alx-navy-lighter/40">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
        {Icon && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-alx-lime/10">
            <Icon size={16} style={{ color: '#D4FF00' }} />
          </div>
        )}
      </div>
      <p className="text-3xl font-display font-bold text-alx-lime">{value}</p>
      {sublabel && <p className="text-xs text-gray-400">{sublabel}</p>}
    </div>
  );
}
