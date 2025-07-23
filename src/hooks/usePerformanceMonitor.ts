import { useEffect } from 'react'

interface PerformanceMetrics {
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
}

export const usePerformanceMonitor = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return
    }

    const observer = new PerformanceObserver((list) => {
      const metrics: PerformanceMetrics = {}
      
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime
            }
            break
          case 'largest-contentful-paint':
            metrics.lcp = entry.startTime
            break
          case 'first-input':
            metrics.fid = entry.processingStart - entry.startTime
            break
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              metrics.cls = (metrics.cls || 0) + (entry as any).value
            }
            break
        }
      }

      // Log metrics in development
      if (import.meta.env.DEV && Object.keys(metrics).length > 0) {
        console.log('Performance Metrics:', metrics)
      }

      // Send to analytics in production
      if (import.meta.env.PROD && Object.keys(metrics).length > 0) {
        // Example: Send to your analytics service
        // analytics.track('performance_metrics', metrics)
      }
    })

    // Observe different entry types
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] })
    } catch (error) {
      console.warn('Performance observer not supported:', error)
    }

    return () => {
      observer.disconnect()
    }
  }, [])
}