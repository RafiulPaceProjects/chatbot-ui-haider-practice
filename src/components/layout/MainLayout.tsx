import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { OfflineIndicator } from '../OfflineIndicator'
import { LoginForm } from '../auth/LoginForm'
import { ChatInterface } from '../chat/ChatInterface'
import { LoadingSpinner } from '../ui/LoadingSpinner'

export const MainLayout: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading application..." />
      </div>
    )
  }

  return (
    <>
      <OfflineIndicator />
      {!isAuthenticated || !user ? (
        <LoginForm />
      ) : (
        <ChatInterface />
      )}
    </>
  )
}