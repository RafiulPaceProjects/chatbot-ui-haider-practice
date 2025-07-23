# Frontend-only Chatbot UI - Backend Integration Guide

This is a standalone frontend version of Chatbot UI that can be integrated with any backend API, specifically designed for LangChain Python backends.

## Overview

This frontend has been stripped of all Supabase dependencies and backend logic. It now communicates with your backend through configurable API endpoints.

## Backend Integration Points

### 1. Authentication Endpoint
**File to modify:** `lib/api/auth.ts`
**Your backend should provide:**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### 2. Chat Endpoints
**File to modify:** `lib/api/chat.ts`
**Your backend should provide:**
- `POST /api/chat/send` - Send message and get streaming response
- `GET /api/chat/history` - Get chat history
- `POST /api/chat/new` - Create new chat
- `DELETE /api/chat/{id}` - Delete chat

### 3. File Upload Endpoints
**File to modify:** `lib/api/files.ts`
**Your backend should provide:**
- `POST /api/files/upload` - Upload file for processing
- `GET /api/files` - List user files
- `DELETE /api/files/{id}` - Delete file

### 4. Configuration
**File to modify:** `lib/config.ts`
Update the `API_BASE_URL` to point to your backend:

```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
```

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

## LangChain Python Backend Requirements

Your Python backend should implement these endpoints:

### Chat Streaming Endpoint
```python
@app.post("/api/chat/send")
async def send_message(request: ChatRequest):
    # Your LangChain logic here
    # Return streaming response
    pass
```

### File Processing Endpoint
```python
@app.post("/api/files/upload")
async def upload_file(file: UploadFile):
    # Process file with LangChain document loaders
    # Store embeddings in your vector database
    pass
```

## Key Files to Customize

1. **`lib/api/`** - All API communication logic
2. **`lib/config.ts`** - Configuration settings
3. **`components/chat/chat-input.tsx`** - Chat interface
4. **`components/chat/chat-messages.tsx`** - Message display
5. **`types/api.ts`** - API type definitions

## Data Flow

1. User sends message → Frontend calls `/api/chat/send`
2. Backend processes with LangChain → Returns streaming response
3. Frontend displays response in real-time
4. File uploads → Backend processes with LangChain document loaders
5. Chat history stored in your backend database

## Next Steps

1. Update `lib/config.ts` with your backend URL
2. Implement the API endpoints in `lib/api/`
3. Test the integration with your LangChain backend
4. Customize the UI as needed