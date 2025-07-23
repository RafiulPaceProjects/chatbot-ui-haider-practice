import React, { useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useChat } from '../../contexts/ChatContext'
import { SEOHead } from '../SEOHead'
import { ChatSidebar } from './ChatSidebar'
import { ChatArea } from './ChatArea'
import { LoadingSpinner } from '../ui/LoadingSpinner'

export const ChatInterface: React.FC = () => {
  const { user } = useAuth()
  const { loadChatHistory, isLoading, error, currentChat } = useChat()

  useEffect(() => {
    if (user) {
      loadChatHistory()
    }
  }, [user, loadChatHistory])

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading chat interface..." />
      </div>
    )
  }

  return (
    <>
      <SEOHead
        title={currentChat?.title || 'Chat'}
        description="Chat with AI using LangChain-powered backend"
        keywords={['ai', 'chat', 'langchain', 'assistant']}
      />
      
      <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <ChatSidebar />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <ChatArea />
        </div>

        {/* Error Display */}
        {error && (
          <div 
            className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-md"
            role="alert"
            aria-live="polite"
          >
            <p className="text-sm">{error}</p>
          </div>
        )}
        </div>
    </>
  )
}