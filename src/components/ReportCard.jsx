import { MapPin, Clock } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate, getCategoryConfig } from '../services/reportsService';

export default function ReportCard({ report, onClick }) {
  const cat = getCategoryConfig(report.category);
  const CatIcon = cat.icon;

  return (
    <div
      onClick={onClick}
      className="card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start gap-3">
        {/* Category icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${cat.color}18` }}
        >
          <CatIcon size={20} style={{ color: cat.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm leading-snug truncate group-hover:text-alx-lime transition-colors">
              {report.category || 'Unknown Category'}
            </h3>
            <StatusBadge status={report.status} />
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-xs mb-2 line-clamp-2 leading-relaxed">
            {report.description || 'No description provided.'}
          </p>

          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              <span className="truncate max-w-[140px]">{report.location}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {formatDate(report.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
