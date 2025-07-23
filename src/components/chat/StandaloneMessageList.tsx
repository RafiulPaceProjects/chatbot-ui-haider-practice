import React, { useEffect, useRef } from 'react'
import { MockMessage } from './StandaloneChatArea'
import { StandaloneMessageBubble } from './StandaloneMessageBubble'

interface StandaloneMessageListProps {
  messages: MockMessage[]
}

export const StandaloneMessageList: React.FC<StandaloneMessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={message.id} className="message-enter">
            <StandaloneMessageBubble
              message={message}
              isLast={index === messages.length - 1}
            />
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}