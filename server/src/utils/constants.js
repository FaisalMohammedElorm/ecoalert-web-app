export const USER_ROLES = ['citizen', 'officer', 'admin'];

export const REPORT_STATUSES = [
  'pending',
  'under_review',
  'assigned',
  'in_progress',
  'resolved',
  'closed',
  'rejected',
];

export const LEGACY_STATUS_MAP = {
  verified: 'under_review',
};

export const SEVERITY_LEVELS = ['low', 'medium', 'high', 'critical'];

export const DEFAULT_CATEGORIES = [
  { name: 'Illegal dumping', slug: 'illegal-dumping', color: '#ef4444' },
  { name: 'Flooding', slug: 'flooding', color: '#0ea5e9' },
  { name: 'Blocked drains', slug: 'blocked-drains', color: '#f59e0b' },
  { name: 'Air pollution', slug: 'air-pollution', color: '#64748b' },
  { name: 'Bush burning', slug: 'bush-burning', color: '#f97316' },
  { name: 'Water pollution', slug: 'water-pollution', color: '#2563eb' },
  { name: 'Illegal mining (galamsey)', slug: 'illegal-mining-galamsey', color: '#a16207' },
  { name: 'Noise pollution', slug: 'noise-pollution', color: '#8b5cf6' },
  { name: 'Oil spills', slug: 'oil-spills', color: '#111827' },
  { name: 'Dead animals', slug: 'dead-animals', color: '#7c2d12' },
  { name: 'Sanitation issues', slug: 'sanitation-issues', color: '#16a34a' },
];

export const DEFAULT_DISTRICTS = [
  { name: 'Accra Metropolitan', region: 'Greater Accra' },
  { name: 'Kumasi Metropolitan', region: 'Ashanti' },
  { name: 'Tamale Metropolitan', region: 'Northern' },
  { name: 'Sekondi-Takoradi Metropolitan', region: 'Western' },
  { name: 'Cape Coast Metropolitan', region: 'Central' },
  { name: 'Tema Metropolitan', region: 'Greater Accra' },
  { name: 'Ga East Municipal', region: 'Greater Accra' },
  { name: 'Obuasi Municipal', region: 'Ashanti' },
];

export function normalizeStatus(status = 'pending') {
  return LEGACY_STATUS_MAP[status] || status;
}
