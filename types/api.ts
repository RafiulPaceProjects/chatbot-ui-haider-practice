/**
 * API Types for LangChain Backend Integration
 * 
 * These types define the expected request/response formats
 * for your LangChain Python backend
 */

// Authentication Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user: User
}

export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

// Chat Types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  chat_id: string
}

export interface ChatRequest {
  message: string
  chat_id?: string
  model?: string
  temperature?: number
  max_tokens?: number
  files?: string[] // File IDs for context
}

export interface ChatResponse {
  message: ChatMessage
  chat_id: string
}

export interface Chat {
  id: string
  title: string
  created_at: string
  updated_at: string
  message_count: number
}

// File Types
export interface FileUploadRequest {
  file: File
  description?: string
}

export interface FileUploadResponse {
  id: string
  filename: string
  size: number
  type: string
  processed: boolean
  chunks_count?: number
}

export interface FileInfo {
  id: string
  filename: string
  size: number
  type: string
  uploaded_at: string
  processed: boolean
  chunks_count?: number
}

// Model Types
export interface Model {
  id: string
  name: string
  provider: string
  max_tokens: number
  supports_streaming: boolean
}

// Error Types
export interface ApiError {
  error: string
  message: string
  status_code: number
}

// Streaming Types
export interface StreamingResponse {
  type: 'token' | 'done' | 'error'
  content?: string
  error?: string
}