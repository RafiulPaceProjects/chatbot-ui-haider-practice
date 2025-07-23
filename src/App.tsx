import React from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ConfigurationCheck } from './components/ConfigurationCheck'
import { AuthProvider } from './contexts/AuthContext'
import { ChatProvider } from './contexts/ChatContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { MainLayout } from './components/layout/MainLayout'
import { Toaster } from './components/ui/Toaster'
import { isApiConfigured } from './lib/config'
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor'

function App() {
  usePerformanceMonitor()

  return (
    <ErrorBoundary>
      <ThemeProvider>
        {!isApiConfigured() ? (
          <ConfigurationCheck />
        ) : (
          <AuthProvider>
            <ChatProvider>
              <div className="min-h-screen bg-background text-foreground">
                <MainLayout />
                <Toaster />
              </div>
            </ChatProvider>
          </AuthProvider>
        )}
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App