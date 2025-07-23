import React from 'react'
import { IconMessage, IconBolt, IconPlug } from '@tabler/icons-react'

export const StandaloneEmptyState: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
            <IconMessage className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Frontend UI Ready
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            This is a standalone frontend interface. Connect your LangChain backend to enable AI responses.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 text-left">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <IconBolt className="h-5 w-5 text-green-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                UI Components Ready
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Chat interface, themes, and responsive design
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <IconPlug className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Backend Connection Needed
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Connect your LangChain server for AI responses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}