export function SkeletonLine({ width = 'w-full', height = 'h-3' }) {
  return (
    <div className={`${width} ${height} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="card space-y-4">
      <SkeletonLine width="w-1/3" height="h-4" />
      <SkeletonLine height="h-12" />
      <SkeletonLine height="h-3" />
      <SkeletonLine width="w-2/3" height="h-3" />
    </div>
  );
}

export function SkeletonGrid({ count = 3, cols = 3 }) {
  return (
    <div className={`grid grid-cols-${cols} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 'w-12 h-12' }) {
  return <div className={`${size} bg-gradient-to-r from-gray-200 to-gray-100 rounded-full animate-pulse`} />;
}
