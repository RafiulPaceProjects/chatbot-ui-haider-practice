/**
 * Configuration for the LangChain Frontend
 * 
 * Update these values to match your LangChain backend
 */

// Validate required environment variables
const validateConfig = () => {
  const requiredVars = ['VITE_API_BASE_URL']
  const missing = requiredVars.filter(key => !import.meta.env[key])
  
  if (missing.length > 0 && import.meta.env.PROD) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`)
  }
}

// Run validation
validateConfig()

export const API_CONFIG = {
  // Base URL for your LangChain backend
  BASE_URL: import.meta.env.VITE_API_BASE_URL || (
    import.meta.env.DEV ? 'http://localhost:8000' : ''
  ),
  
  // WebSocket URL for real-time features
  WS_URL: import.meta.env.VITE_WS_URL || (
    import.meta.env.DEV ? 'ws://localhost:8000/ws' : ''
  ),
  
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
    
    // Files (optional)
    FILE_UPLOAD: '/api/files/upload',
    FILE_LIST: '/api/files',
    FILE_DELETE: '/api/files',
  },
  
  // Default settings
  DEFAULTS: {
    MODEL: 'gpt-3.5-turbo',
    TEMPERATURE: 0.7,
    MAX_TOKENS: 2048,
  },
  
  // App configuration
  APP: {
    NAME: import.meta.env.VITE_APP_NAME || 'LangChain Chat UI',
    DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'A beautiful frontend for LangChain backends',
    DEBUG: import.meta.env.VITE_DEBUG === 'true',
    VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  }
}

// Helper function to check if API is configured
export const isApiConfigured = (): boolean => {
  return !!(API_CONFIG.BASE_URL && API_CONFIG.BASE_URL !== '')
}

// Helper function to build full URLs
export const buildApiUrl = (endpoint: string): string => {
  if (!API_CONFIG.BASE_URL) {
    throw new Error('API_BASE_URL is not configured. Please check your environment variables.')
  }
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Helper function to get environment variables with fallbacks
export const getEnvVar = (key: string, fallback: string = ''): string => {
  return import.meta.env[key] || fallback
}