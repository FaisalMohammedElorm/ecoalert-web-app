export default function GradientCard({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  color = '#D4FF00', 
  gradient = 'from-alx-lime to-alx-lime-dark',
  onClick,
  children 
}) {
  return (
    <div
      onClick={onClick}
      className="card-hover group relative overflow-hidden p-4 sm:p-5 md:p-6 cursor-pointer rounded-xl border border-alx-lime/10 bg-alx-navy-lighter/40 hover:bg-alx-navy-lighter/60 transition-all duration-300"
    >
      {/* Gradient background accent - ALX lime */}
      <div className={`absolute -top-8 -right-8 w-28 sm:w-32 h-28 sm:h-32 bg-gradient-to-r ${gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-all duration-300`} />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            {Icon && (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-alx-lime/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Icon size={20} className="sm:w-6 sm:h-6" style={{ color }} />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{subtitle}</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-display font-black text-alx-lime mt-0.5">{value}</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-gray-300 group-hover:text-alx-lime transition-colors">{title}</p>
        </div>
      </div>

      {children}
    </div>
  );
}
