import React, { useState } from 'react'
import { SEOHead } from './SEOHead'
import { StandaloneSidebar } from './chat/StandaloneSidebar'
import { StandaloneChatArea } from './chat/StandaloneChatArea'
import { ThemeToggle } from './ui/ThemeToggle'
import { Button } from './ui/Button'
import { IconSettings, IconPlug } from '@tabler/icons-react'

export const StandaloneChatInterface: React.FC = () => {
  const [showConnectionModal, setShowConnectionModal] = useState(false)

  return (
    <>
      <SEOHead
        title="Chat Interface"
        description="LangChain Frontend UI - Ready for backend connection"
        keywords={['ai', 'chat', 'langchain', 'frontend', 'ui']}
      />
      
      <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <StandaloneSidebar />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header with connection status */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  LangChain Chat UI
                </h1>
                <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-yellow-700 dark:text-yellow-300">
                    Backend Disconnected
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConnectionModal(true)}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <IconPlug className="h-4 w-4 mr-2" />
                  Connect Backend
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </div>

          <StandaloneChatArea />
        </div>

        {/* Connection Modal */}
        {showConnectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Connect to Backend
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This is a standalone frontend UI. To enable AI responses, you'll need to:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <li>Set up your LangChain backend server</li>
                <li>Configure the API URL in your environment variables</li>
                <li>Implement authentication if needed</li>
                <li>Connect the chat functionality</li>
              </ol>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConnectionModal(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => window.open('https://github.com/your-repo/examples', '_blank')}
                >
                  View Examples
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}