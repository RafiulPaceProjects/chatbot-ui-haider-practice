/**
 * Main Chat Interface Component
 * 
 * This is the main chat component that integrates with your LangChain backend
 */

import React, { useState, useEffect, useRef } from 'react'
import { useChat } from '../../lib/hooks/useChat'
import { useFiles } from '../../lib/hooks/useFiles'
import { useAuth } from '../../lib/hooks/useAuth'
import { ChatMessage } from '../../types/api'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ScrollArea } from '../ui/scroll-area'
import { Badge } from '../ui/badge'
import { 
  IconSend, 
  IconStop, 
  IconPaperclip, 
  IconTrash,
  IconDownload,
  IconUser,
  IconBot
} from '@tabler/icons-react'

export const ChatInterface: React.FC = () => {
  const { user } = useAuth()
  const {
    messages,
    chats,
    currentChat,
    isStreaming,
    error: chatError,
    sendMessage,
    stopStreaming,
    loadChatHistory,
    createNewChat,
    deleteChat,
    selectChat,
  } = useChat()

  const {
    files,
    uploading,
    error: fileError,
    loadFiles,
    uploadFile,
    deleteFile,
  } = useFiles()

  const [input, setInput] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [showFiles, setShowFiles] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load initial data
  useEffect(() => {
    if (user) {
      loadChatHistory()
      loadFiles()
    }
  }, [user, loadChatHistory, loadFiles])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isStreaming) return

    const messageContent = input
    setInput('')

    try {
      await sendMessage(messageContent, {
        files: selectedFiles,
      })
      setSelectedFiles([])
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      await uploadFile(file)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      console.error('File upload failed:', err)
    }
  }

  const handleNewChat = async () => {
    try {
      await createNewChat()
    } catch (err) {
      console.error('Failed to create new chat:', err)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <Button onClick={handleNewChat} className="w-full">
            New Chat
          </Button>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {chats.map((chat) => (
              <Card 
                key={chat.id} 
                className={`cursor-pointer transition-colors ${
                  currentChat?.id === chat.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                }`}
                onClick={() => selectChat(chat)}
              >
                <CardContent className="p-3">
                  <div className="font-medium truncate">{chat.title}</div>
                  <div className="text-sm text-gray-500">
                    {chat.message_count} messages
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {/* Files Section */}
        <div className="border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start p-4"
            onClick={() => setShowFiles(!showFiles)}
          >
            <IconPaperclip className="mr-2 h-4 w-4" />
            Files ({files.length})
          </Button>
          
          {showFiles && (
            <div className="p-4 pt-0 max-h-40 overflow-y-auto">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".txt,.pdf,.docx,.md"
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full mb-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload File'}
              </Button>
              
              <div className="space-y-1">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                  >
                    <div className="flex-1 truncate">
                      <div className="font-medium">{file.filename}</div>
                      <div className="text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                        {file.processed && file.chunks_count && (
                          <span className="ml-2">• {file.chunks_count} chunks</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFiles(prev => [...prev, file.id])
                          } else {
                            setSelectedFiles(prev => prev.filter(id => id !== file.id))
                          }
                        }}
                        className="mr-2"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteFile(file.id)}
                      >
                        <IconTrash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">
              {currentChat?.title || 'Select a chat or start a new one'}
            </h1>
            {currentChat && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteChat(currentChat.id)}
              >
                <IconTrash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === 'assistant' && (
                      <IconBot className="h-5 w-5 mt-0.5 text-gray-500" />
                    )}
                    {message.role === 'user' && (
                      <IconUser className="h-5 w-5 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Error Display */}
        {(chatError || fileError) && (
          <div className="p-4 bg-red-50 border-t border-red-200">
            <div className="text-red-600 text-sm">
              {chatError || fileError}
            </div>
          </div>
        )}

        {/* Selected Files Display */}
        {selectedFiles.length > 0 && (
          <div className="p-4 bg-blue-50 border-t border-blue-200">
            <div className="text-sm text-blue-700 mb-2">
              Selected files for context:
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map(fileId => {
                const file = files.find(f => f.id === fileId)
                return file ? (
                  <Badge key={fileId} variant="secondary">
                    {file.filename}
                  </Badge>
                ) : null
              })}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message... (Shift+Enter for new line)"
                  className="min-h-[60px] pr-12 resize-none"
                  disabled={isStreaming}
                />
                <Button
                  size="sm"
                  className="absolute bottom-2 right-2"
                  onClick={isStreaming ? stopStreaming : handleSendMessage}
                  disabled={!input.trim() && !isStreaming}
                >
                  {isStreaming ? (
                    <IconStop className="h-4 w-4" />
                  ) : (
                    <IconSend className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}