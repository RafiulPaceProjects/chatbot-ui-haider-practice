import React from 'react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { isApiConfigured, API_CONFIG } from '../lib/config'
import { IconAlertTriangle, IconExternalLink, IconCopy } from '@tabler/icons-react'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'

export const ConfigurationCheck: React.FC = () => {
  const { copyToClipboard, isCopied } = useCopyToClipboard()
  
  if (isApiConfigured()) {
    return null
  }

  const envExample = `# Copy this to your .env.local file
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
VITE_APP_NAME=My LangChain App`

  const handleCopyEnv = () => {
    copyToClipboard(envExample)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="max-w-2xl w-full p-8 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
            <IconAlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Configuration Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please configure your LangChain backend URL and ensure your backend server is running.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Quick Setup:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Create a <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">.env.local</code> file in your project root</li>
              <li>Add your LangChain backend URL</li>
              <li>3. Start your LangChain backend server</li>
              <li>4. Restart the development server</li>
            </ol>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-left">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Default Backend URL:</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              The frontend expects your backend at <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">http://localhost:8000</code>
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Environment Variables:
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyEnv}
                className="text-xs"
              >
                {isCopied ? (
                  <>Copied!</>
                ) : (
                  <>
                    <IconCopy className="h-3 w-3 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm overflow-x-auto">
              {envExample}
            </pre>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Need a LangChain Backend?
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              Check out our backend integration examples to get started quickly.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://github.com/your-repo/examples', '_blank')}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <IconExternalLink className="h-4 w-4 mr-2" />
              View Examples
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Current API URL: <code>{API_CONFIG.BASE_URL || 'Not configured'}</code>
          </p>
        </div>
      </Card>
    </div>
  )
}