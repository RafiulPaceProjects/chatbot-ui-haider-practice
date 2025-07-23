import React, { useState, useRef, useEffect } from 'react'
import { Button } from '../ui/Button'
import { Textarea } from '../ui/Textarea'
import { IconSend, IconPaperclip } from '@tabler/icons-react'

interface StandaloneChatInputProps {
  onSendMessage: (message: string) => void
}

export const StandaloneChatInput: React.FC<StandaloneChatInputProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || isLoading) return

    const message = input.trim()
    setInput('')
    setIsLoading(true)
    
    onSendMessage(message)
    
    // Simulate loading state
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
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
          {/* File Upload Button (Disabled in demo) */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-300 dark:text-gray-600 cursor-not-allowed"
            disabled
            title="File upload will be available when backend is connected"
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
              placeholder="Type your message... (Demo mode - responses are simulated)"
              className="min-h-[44px] max-h-32 resize-none pr-12"
              disabled={isLoading}
              aria-label="Chat message input"
              aria-describedby="input-help"
            />
            
            {/* Send Button */}
            <div className="absolute bottom-2 right-2">
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim() || isLoading}
                loading={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                aria-label="Send message"
              >
                <IconSend className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <div id="input-help" className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          <span className="text-yellow-600 dark:text-yellow-400">Demo Mode:</span> Messages will receive simulated responses. Connect backend for AI responses.
        </div>
      </form>
    </div>
  )
}