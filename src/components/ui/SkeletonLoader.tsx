import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: boolean
}

export const Skeleton = ({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  animation = true
}: SkeletonProps) => {
  const baseClasses = 'bg-gray-200 rounded'
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded'
  }
  
  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '100%')
  }
  
  const skeletonElement = (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
  
  if (!animation) {
    return skeletonElement
  }
  
  return (
    <motion.div
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

// Dashboard Skeleton
export const DashboardSkeleton = () => (
  <div className="p-6 h-full">
    {/* Header Skeleton */}
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    </div>

    {/* Stats Grid Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-20 mb-4" />
              <div className="flex items-center">
                <Skeleton className="h-4 w-4 mr-2" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <Skeleton variant="circular" width={48} height={48} />
          </div>
        </div>
      ))}
    </div>

    {/* Quick Actions Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Skeleton variant="circular" width={32} height={32} className="mr-3" />
            <div className="flex-1">
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Table Skeleton */}
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="p-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center py-4 border-b border-gray-100 last:border-b-0">
            <Skeleton className="h-4 w-24 mr-6" />
            <Skeleton className="h-4 w-32 mr-6" />
            <Skeleton className="h-6 w-20 mr-6" />
            <Skeleton className="h-4 w-16 mr-6" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

// Products Skeleton
export const ProductsSkeleton = () => (
  <div className="p-6 h-full">
    {/* Header */}
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-56 mb-2" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    </div>

    {/* Filters */}
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-6 w-32" />
      </div>
    </div>

    {/* Products Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4">
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-20 mb-3" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-16" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// Table Skeleton
export const TableSkeleton = ({ 
  rows = 5, 
  columns = 5,
  title = "Loading..."
}: { 
  rows?: number
  columns?: number
  title?: string
}) => (
  <div className="p-6 h-full">
    {/* Header */}
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>

    {/* Filters */}
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-6 w-32" />
      </div>
    </div>

    {/* Table */}
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-6 py-3">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-24" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)

// Settings Skeleton
export const SettingsSkeleton = () => (
  <div className="p-6 h-full">
    {/* Header */}
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <nav className="space-y-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full mb-2" />
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-lg shadow p-6">
          <Skeleton className="h-6 w-40 mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
)
