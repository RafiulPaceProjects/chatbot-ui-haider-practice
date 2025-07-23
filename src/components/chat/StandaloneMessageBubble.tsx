import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { MockMessage } from './StandaloneChatArea'
import { useTheme } from '../../contexts/ThemeContext'
import { formatDate } from '../../lib/utils'
import { IconUser, IconRobot, IconCopy, IconCheck, IconSettings } from '@tabler/icons-react'
import { Button } from '../ui/Button'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'

interface StandaloneMessageBubbleProps {
  message: MockMessage
  isLast: boolean
}

export const StandaloneMessageBubble: React.FC<StandaloneMessageBubbleProps> = ({ message, isLast }) => {
  const { actualTheme } = useTheme()
  const { isCopied, copyToClipboard } = useCopyToClipboard()
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  const handleCopy = () => {
    copyToClipboard(message.content)
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          isUser
            ? 'bg-blue-500 text-white'
            : isSystem
            ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700'
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        }`}
      >
        <div className="flex items-start space-x-3">
          {/* Avatar */}
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              isUser
                ? 'bg-blue-600'
                : isSystem
                ? 'bg-yellow-100 dark:bg-yellow-800'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            {isUser ? (
              <IconUser className="h-4 w-4" />
            ) : isSystem ? (
              <IconSettings className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            ) : (
              <IconRobot className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className={`prose prose-sm max-w-none ${
              isUser ? 'prose-invert' : isSystem ? 'prose-yellow dark:prose-invert' : 'dark:prose-invert'
            }`}>
              {isUser ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={actualTheme === 'dark' ? oneDark : oneLight}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-md"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>

            {/* Message Footer */}
            <div className="flex items-center justify-between mt-2">
              <span
                className={`text-xs ${
                  isUser
                    ? 'text-blue-100'
                    : isSystem
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {formatDate(message.timestamp)}
              </span>

              {/* Copy Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                  isUser
                    ? 'text-blue-100 hover:text-white hover:bg-blue-600'
                    : isSystem
                    ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-800'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {isCopied ? (
                  <IconCheck className="h-3 w-3" />
                ) : (
                  <IconCopy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}