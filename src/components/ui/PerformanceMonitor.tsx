'use client'

import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage: number
}

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return

    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart
      const renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
      
      // Memory usage (if available)
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0

      setMetrics({
        loadTime: Math.round(loadTime),
        renderTime: Math.round(renderTime),
        memoryUsage: Math.round(memoryUsage / 1024 / 1024) // Convert to MB
      })
    }

    // Wait for page to fully load
    if (document.readyState === 'complete') {
      measurePerformance()
    } else {
      window.addEventListener('load', measurePerformance)
    }

    // Toggle visibility with Ctrl+Shift+P
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('load', measurePerformance)
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  if (!metrics || !isVisible || process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-[9999] backdrop-blur-sm">
      <div className="mb-2 font-bold text-green-400">Performance Metrics</div>
      <div className="space-y-1">
        <div>Load Time: <span className="text-yellow-400">{metrics.loadTime}ms</span></div>
        <div>Render Time: <span className="text-blue-400">{metrics.renderTime}ms</span></div>
        <div>Memory: <span className="text-purple-400">{metrics.memoryUsage}MB</span></div>
      </div>
      <div className="mt-2 text-gray-400 text-[10px]">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  )
}

// Web Vitals monitoring
export const WebVitalsReporter = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const reportWebVitals = (metric: any) => {
      console.log(`[Web Vitals] ${metric.name}:`, metric.value)
    }

    // Dynamic import to avoid SSR issues
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(reportWebVitals)
      getFID(reportWebVitals)
      getFCP(reportWebVitals)
      getLCP(reportWebVitals)
      getTTFB(reportWebVitals)
    }).catch(() => {
      // web-vitals not available
    })
  }, [])

  return null
}
