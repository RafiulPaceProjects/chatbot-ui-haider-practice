/**
 * Main App Page
 * 
 * This is the entry point that shows either login or chat interface
 */

'use client'

import React from 'react'
import { useAuth } from '../lib/hooks/useAuth'
import { LoginForm } from '../components/auth/LoginForm'
import { ChatInterface } from '../components/chat/ChatInterface'
import { Button } from '../components/ui/button'
import { IconLogout } from '@tabler/icons-react'

export default function HomePage() {
  const { user, loading, logout, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <LoginForm />
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Chatbot UI</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Welcome, {user.name || user.email}</span>
          <Button variant="outline" size="sm" onClick={logout}>
            <IconLogout className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1">
        <ChatInterface />
      </div>

      {/* Backend Integration Notice */}
      <div className="bg-yellow-50 border-t border-yellow-200 p-3">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-yellow-800">
            <strong>Backend Integration:</strong> This frontend is ready to connect to your LangChain Python backend. 
            Update the API endpoints in <code>lib/config.ts</code> and implement the corresponding routes in your backend.
            See <code>README-BACKEND-INTEGRATION.md</code> for detailed instructions.
          </p>
        </div>
      </div>
    </div>
  )
}