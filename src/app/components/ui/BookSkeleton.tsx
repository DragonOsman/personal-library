export default function BookSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card bg-base-100 shadow-md animate-pulse">
          <div className="h-48 bg-gray-300 rounded-t"></div>
          <div className="card-body space-y-3">
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      ))}
    </div>
  );
}