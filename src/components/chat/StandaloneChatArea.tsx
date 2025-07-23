import React, { useState } from 'react'
import { StandaloneMessageList } from './StandaloneMessageList'
import { StandaloneChatInput } from './StandaloneChatInput'
import { StandaloneEmptyState } from './StandaloneEmptyState'

export interface MockMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export const StandaloneChatArea: React.FC = () => {
  const [messages, setMessages] = useState<MockMessage[]>([
    {
      id: '1',
      role: 'system',
      content: 'Welcome to LangChain Frontend UI! This is a demo interface. Connect your backend to enable AI responses.',
      timestamp: new Date().toISOString()
    }
  ])

  const handleSendMessage = (content: string) => {
    const userMessage: MockMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])

    // Simulate a response after a short delay
    setTimeout(() => {
      const botMessage: MockMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '🤖 This is a frontend-only demo. To get AI responses, please connect your LangChain backend server. The UI is ready and waiting for your backend integration!',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, botMessage])
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        {messages.length > 0 ? (
          <StandaloneMessageList messages={messages} />
        ) : (
          <StandaloneEmptyState />
        )}
      </div>

      {/* Input */}
      <StandaloneChatInput onSendMessage={handleSendMessage} />
    </div>
  )
}