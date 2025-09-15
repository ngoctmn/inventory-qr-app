'use client'

export function ProgressBar({ total, checked }: { total: number; checked: number }) {
  const percentage = total > 0 ? Math.round((checked / total) * 100) : 0

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Tiến độ kiểm kê</span>
        <span className="font-semibold">{checked} / {total} ({percentage}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-emerald-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        >
          <div className="h-full flex items-center justify-end pr-2">
            {percentage > 10 && (
              <span className="text-xs text-white font-semibold">{percentage}%</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}