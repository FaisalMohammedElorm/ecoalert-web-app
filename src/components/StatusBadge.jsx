import { STATUS_CONFIG } from '../services/reportsService';

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: config.dot }} />
      {config.label}
    </span>
  );
}
