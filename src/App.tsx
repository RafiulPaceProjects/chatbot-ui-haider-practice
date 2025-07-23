import React from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ThemeProvider } from './contexts/ThemeContext'
import { StandaloneChatInterface } from './components/StandaloneChatInterface'
import { Toaster } from './components/ui/Toaster'
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor'

function App() {
  usePerformanceMonitor()

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground">
          <StandaloneChatInterface />
          <Toaster />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App