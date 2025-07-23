import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { formatDate, truncateText } from '../../lib/utils'
import { 
  IconPlus, 
  IconTrash, 
  IconUser,
  IconMessage,
  IconRobot
} from '@tabler/icons-react'

// Mock data for demonstration
const mockChats = [
  {
    id: 'chat_1',
    title: 'Welcome Chat',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    message_count: 3
  },
  {
    id: 'chat_2',
    title: 'Sample Conversation',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    message_count: 5
  }
]

export const StandaloneSidebar: React.FC = () => {
  const [chats, setChats] = useState(mockChats)
  const [currentChatId, setCurrentChatId] = useState('chat_1')

  const handleNewChat = () => {
    const newChat = {
      id: `chat_${Date.now()}`,
      title: 'New Chat',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      message_count: 0
    }
    setChats([newChat, ...chats])
    setCurrentChatId(newChat.id)
  }

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (chats.length > 1) {
      const updatedChats = chats.filter(chat => chat.id !== chatId)
      setChats(updatedChats)
      if (currentChatId === chatId) {
        setCurrentChatId(updatedChats[0]?.id || '')
      }
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <IconRobot className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Frontend Demo
            </span>
          </div>
        </div>

        <Button onClick={handleNewChat} className="w-full">
          <IconPlus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chats.length === 0 ? (
          <div className="text-center py-8">
            <IconMessage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No chats yet. Start a new conversation!
            </p>
          </div>
        ) : (
          chats.map((chat) => (
            <Card
              key={chat.id}
              className={`p-3 cursor-pointer transition-all hover:shadow-md group ${
                currentChatId === chat.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => setCurrentChatId(chat.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                    {truncateText(chat.title, 30)}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {chat.message_count} messages
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {formatDate(chat.updated_at)}
                    </p>
                  </div>
                </div>
                {chats.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <IconTrash className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
          <div>LangChain Frontend UI v1.0</div>
          <div className="text-yellow-600 dark:text-yellow-400">
            ⚠️ Demo Mode - No Backend Connected
          </div>
        </div>
      </div>
    </div>
  )
}