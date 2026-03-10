export default function DashboardLoading() {
  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        {/* Skeleton Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded-lg w-64"></div>
            <div className="h-4 bg-gray-200 rounded-md w-48"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
        </div>

        {/* Skeleton Stats/Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skeleton Table / Main Content Block */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-8">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                <div className="flex gap-4 w-1/2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 w-full">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
