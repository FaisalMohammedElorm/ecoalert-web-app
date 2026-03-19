export default function GradientCard({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  color = '#4CAF50', 
  gradient = 'from-eco-500 to-eco-600',
  onClick,
  children 
}) {
  return (
    <div
      onClick={onClick}
      className="card-hover group relative overflow-hidden p-5 sm:p-6 cursor-pointer"
    >
      {/* Gradient background accent */}
      <div className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-r ${gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-all duration-300`} />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            {Icon && (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-eco-500/10 to-eco-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Icon size={24} style={{ color }} className="group-hover:text-eco-600 transition-colors" />
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{subtitle}</p>
              <p className="text-2xl sm:text-3xl font-display font-black text-gray-900 mt-0.5">{value}</p>
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-700 group-hover:text-eco-600 transition-colors">{title}</p>
        </div>
      </div>

      {children}
    </div>
  );
}
