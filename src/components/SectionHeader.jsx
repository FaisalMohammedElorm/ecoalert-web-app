export default function SectionHeader({ 
  title, 
  subtitle, 
  icon: Icon,
  action,
  actionLabel = 'View All' 
}) {
  return (
    <div className="flex items-start justify-between mb-6 animate-fade-up">
      <div>
        <div className="flex items-center gap-3 mb-2">
          {Icon && <Icon size={20} className="text-eco-500" />}
          <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        {subtitle && <p className="text-sm text-gray-500 dark:text-white ml-8">{subtitle}</p>}
      </div>
      {action && (
        <button
          onClick={action}
          className="text-sm font-semibold text-eco-600 hover:text-eco-700 transition-colors"
        >
          {actionLabel} →
        </button>
      )}
    </div>
  );
}
