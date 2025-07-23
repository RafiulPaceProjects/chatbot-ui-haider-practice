/**
 * Configuration file for the frontend application
 * 
 * MODIFY THIS FILE to point to your LangChain Python backend
 */

export const API_CONFIG = {
  // Base URL for your LangChain Python backend
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  // WebSocket URL for real-time chat streaming
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws',
  
  // API endpoints - modify these to match your backend routes
  ENDPOINTS: {
    // Authentication
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    
    // Chat
    CHAT_SEND: '/api/chat/send',
    CHAT_HISTORY: '/api/chat/history',
    CHAT_NEW: '/api/chat/new',
    CHAT_DELETE: '/api/chat',
    
    // Files
    FILE_UPLOAD: '/api/files/upload',
    FILE_LIST: '/api/files',
    FILE_DELETE: '/api/files',
    
    // Models
    MODELS_LIST: '/api/models',
  },
  
  // Default settings
  DEFAULTS: {
    MODEL: 'gpt-3.5-turbo',
    TEMPERATURE: 0.7,
    MAX_TOKENS: 2048,
  }
}

// Helper function to build full URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}