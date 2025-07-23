/**
 * Chat API functions for LangChain backend integration
 * 
 * MODIFY THESE FUNCTIONS to match your LangChain backend chat endpoints
 */

import { API_CONFIG, buildApiUrl } from '../config'
import { ChatRequest, ChatResponse, Chat, ChatMessage, StreamingResponse } from '../../types/api'
import { authAPI } from './auth'

class ChatAPI {
  /**
   * Send a message and get streaming response
   * 
   * MODIFY THIS: Update to match your LangChain streaming endpoint
   */
  async sendMessage(request: ChatRequest): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CHAT_SEND), {
      method: 'POST',
      headers: authAPI.getAuthHeaders(),
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.statusText}`)
    }

    if (!response.body) {
      throw new Error('No response body received')
    }

    return response.body
  }

  /**
   * Process streaming response from LangChain backend
   * 
   * MODIFY THIS: Update parsing logic based on your backend's streaming format
   */
  async processStreamingResponse(
    stream: ReadableStream<Uint8Array>,
    onToken: (token: string) => void,
    onComplete: (fullResponse: string) => void,
    onError: (error: string) => void
  ): Promise<void> {
    const reader = stream.getReader()
    const decoder = new TextDecoder()
    let fullResponse = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        
        // Parse streaming response - MODIFY THIS based on your backend format
        const lines = chunk.split('\n').filter(line => line.trim())
        
        for (const line of lines) {
          try {
            // Assuming your backend sends JSON lines like: {"type": "token", "content": "hello"}
            const data: StreamingResponse = JSON.parse(line)
            
            if (data.type === 'token' && data.content) {
              fullResponse += data.content
              onToken(data.content)
            } else if (data.type === 'done') {
              onComplete(fullResponse)
              return
            } else if (data.type === 'error') {
              onError(data.error || 'Unknown error')
              return
            }
          } catch (parseError) {
            // If not JSON, treat as raw token
            fullResponse += chunk
            onToken(chunk)
          }
        }
      }
      
      onComplete(fullResponse)
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Stream processing error')
    } finally {
      reader.releaseLock()
    }
  }

  /**
   * Get chat history
   * 
   * MODIFY THIS: Update to match your backend's chat history endpoint
   */
  async getChatHistory(chatId?: string): Promise<Chat[]> {
    const url = chatId 
      ? `${buildApiUrl(API_CONFIG.ENDPOINTS.CHAT_HISTORY)}/${chatId}/messages`
      : buildApiUrl(API_CONFIG.ENDPOINTS.CHAT_HISTORY)

    const response = await fetch(url, {
      headers: authAPI.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get chat history: ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Create new chat
   * 
   * MODIFY THIS: Update to match your backend's new chat endpoint
   */
  async createNewChat(title?: string): Promise<Chat> {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CHAT_NEW), {
      method: 'POST',
      headers: authAPI.getAuthHeaders(),
      body: JSON.stringify({ title: title || 'New Chat' }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create chat: ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Delete chat
   * 
   * MODIFY THIS: Update to match your backend's delete chat endpoint
   */
  async deleteChat(chatId: string): Promise<void> {
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.CHAT_DELETE)}/${chatId}`, {
      method: 'DELETE',
      headers: authAPI.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to delete chat: ${response.statusText}`)
    }
  }

  /**
   * Get messages for a specific chat
   * 
   * MODIFY THIS: Update to match your backend's messages endpoint
   */
  async getChatMessages(chatId: string): Promise<ChatMessage[]> {
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.CHAT_HISTORY)}/${chatId}/messages`, {
      headers: authAPI.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get messages: ${response.statusText}`)
    }

    return await response.json()
  }
}

// Export singleton instance
export const chatAPI = new ChatAPI()