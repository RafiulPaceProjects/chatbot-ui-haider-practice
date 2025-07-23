/**
 * Chat hook for managing chat state and operations
 * 
 * This hook manages chat messages, sending, and streaming responses
 */

import { useState, useCallback, useRef } from 'react'
import { ChatMessage, Chat, ChatRequest } from '../../types/api'
import { chatAPI } from '../api/chat'
import { API_CONFIG } from '../config'

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const abortControllerRef = useRef<AbortController | null>(null)

  /**
   * Load chat history
   */
  const loadChatHistory = useCallback(async () => {
    try {
      setIsLoading(true)
      const history = await chatAPI.getChatHistory()
      setChats(history)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chat history')
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Load messages for a specific chat
   */
  const loadChatMessages = useCallback(async (chatId: string) => {
    try {
      setIsLoading(true)
      const chatMessages = await chatAPI.getChatMessages(chatId)
      setMessages(chatMessages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages')
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Send a message with streaming response
   */
  const sendMessage = useCallback(async (
    content: string,
    options: {
      model?: string
      temperature?: number
      max_tokens?: number
      files?: string[]
    } = {}
  ) => {
    try {
      setIsStreaming(true)
      setError(null)

      // Create abort controller for this request
      abortControllerRef.current = new AbortController()

      // Add user message immediately
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
        chat_id: currentChat?.id || '',
      }
      setMessages(prev => [...prev, userMessage])

      // Prepare request
      const request: ChatRequest = {
        message: content,
        chat_id: currentChat?.id,
        model: options.model || API_CONFIG.DEFAULTS.MODEL,
        temperature: options.temperature || API_CONFIG.DEFAULTS.TEMPERATURE,
        max_tokens: options.max_tokens || API_CONFIG.DEFAULTS.MAX_TOKENS,
        files: options.files,
      }

      // Get streaming response
      const stream = await chatAPI.sendMessage(request)

      // Create assistant message placeholder
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        chat_id: currentChat?.id || '',
      }
      setMessages(prev => [...prev, assistantMessage])

      // Process streaming response
      await chatAPI.processStreamingResponse(
        stream,
        // On token received
        (token: string) => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, content: msg.content + token }
                : msg
            )
          )
        },
        // On complete
        (fullResponse: string) => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, content: fullResponse }
                : msg
            )
          )
          setIsStreaming(false)
        },
        // On error
        (error: string) => {
          setError(error)
          setIsStreaming(false)
          // Remove the failed assistant message
          setMessages(prev => prev.filter(msg => msg.id !== assistantMessage.id))
        }
      )

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
      setIsStreaming(false)
    }
  }, [currentChat])

  /**
   * Stop current streaming response
   */
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsStreaming(false)
    }
  }, [])

  /**
   * Create new chat
   */
  const createNewChat = useCallback(async (title?: string) => {
    try {
      const newChat = await chatAPI.createNewChat(title)
      setChats(prev => [newChat, ...prev])
      setCurrentChat(newChat)
      setMessages([])
      return newChat
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create chat')
      throw err
    }
  }, [])

  /**
   * Delete a chat
   */
  const deleteChat = useCallback(async (chatId: string) => {
    try {
      await chatAPI.deleteChat(chatId)
      setChats(prev => prev.filter(chat => chat.id !== chatId))
      if (currentChat?.id === chatId) {
        setCurrentChat(null)
        setMessages([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete chat')
      throw err
    }
  }, [currentChat])

  /**
   * Select a chat
   */
  const selectChat = useCallback(async (chat: Chat) => {
    setCurrentChat(chat)
    await loadChatMessages(chat.id)
  }, [loadChatMessages])

  return {
    messages,
    chats,
    currentChat,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    stopStreaming,
    loadChatHistory,
    loadChatMessages,
    createNewChat,
    deleteChat,
    selectChat,
    setError,
  }
}