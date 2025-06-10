'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white' | 'gray'
  text?: string
}

export const LoadingSpinner = memo(({ 
  size = 'md', 
  color = 'primary', 
  text 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const colorClasses = {
    primary: 'border-purple-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-300 border-t-transparent'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        className={`${sizeClasses[size]} border-2 ${colorClasses[color]} rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-600"
        >
          {text}
        </motion.p>
      )}
    </div>
  )
})

LoadingSpinner.displayName = 'LoadingSpinner'

// Skeleton loader for cards
export const SkeletonCard = memo(() => (
  <div className="animate-pulse bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="w-full h-64 bg-gray-300"></div>
    <div className="p-6 space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
      </div>
    </div>
  </div>
))

SkeletonCard.displayName = 'SkeletonCard'

// Page loading component
export const PageLoader = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <motion.div
        className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Bindass</h2>
        <p className="text-gray-600">Please wait while we prepare your experience...</p>
      </motion.div>
    </div>
  </div>
))

PageLoader.displayName = 'PageLoader'
