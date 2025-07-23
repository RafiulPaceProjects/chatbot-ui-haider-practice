import React, { useState, useRef, useEffect } from 'react'
import { useChat } from '../../contexts/ChatContext'
import { Button } from '../ui/Button'
import { Textarea } from '../ui/Textarea'
import { IconSend, IconPlayerStop, IconPaperclip } from '@tabler/icons-react'

export const ChatInput: React.FC = () => {
  const { sendMessage, isStreaming, stopStreaming } = useChat()
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || isStreaming) return

    const message = input.trim()
    setInput('')
    
    try {
      await sendMessage(message)
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    } else if (e.key === 'Escape') {
      if (isStreaming) {
        handleStop()
      }
    }
  }

  const handleStop = () => {
    stopStreaming()
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-3">
          {/* File Upload Button (Optional) */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={isStreaming}
          >
            <IconPaperclip className="h-5 w-5" />
          </Button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Shift+Enter for new line)"
              className="min-h-[44px] max-h-32 resize-none pr-12"
              disabled={isStreaming}
              aria-label="Chat message input"
              aria-describedby="input-help"
            />
            
            {/* Send/Stop Button */}
            <div className="absolute bottom-2 right-2">
              {isStreaming ? (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleStop}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  aria-label="Stop generating response"
                >
                  <IconPlayerStop className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                  aria-label="Send message"
                >
                  <IconSend className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <div id="input-help" className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          Press Enter to send, Shift+Enter for new line, Escape to stop
        </div>
      </form>
    </div>
  )
}