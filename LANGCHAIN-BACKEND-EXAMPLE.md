# LangChain Python Backend Example

This document provides example implementations for your LangChain Python backend to work with the frontend.

## FastAPI Backend Example

```python
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import asyncio
import json
import uuid
from datetime import datetime

# LangChain imports
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import TextLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain

app = FastAPI()
security = HTTPBearer()

# Models
class ChatRequest(BaseModel):
    message: str
    chat_id: Optional[str] = None
    model: str = "gpt-3.5-turbo"
    temperature: float = 0.7
    max_tokens: int = 2048
    files: Optional[List[str]] = []

class LoginRequest(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: str
    email: str
    name: str
    created_at: str

# Authentication
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # IMPLEMENT: Your authentication logic here
    # Verify JWT token and return user
    token = credentials.credentials
    # Your token verification logic
    return User(
        id="user123",
        email="user@example.com", 
        name="Test User",
        created_at=datetime.now().isoformat()
    )

# Initialize LangChain components
llm = ChatOpenAI(temperature=0.7)
embeddings = OpenAIEmbeddings()
vectorstore = Chroma(embedding_function=embeddings)

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    # IMPLEMENT: Your authentication logic
    # Verify credentials and return JWT token
    if request.email == "test@example.com" and request.password == "password":
        return {
            "access_token": "your-jwt-token-here",
            "user": {
                "id": "user123",
                "email": request.email,
                "name": "Test User",
                "created_at": datetime.now().isoformat()
            }
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/auth/me")
async def get_me(user: User = Depends(get_current_user)):
    return user

@app.post("/api/chat/send")
async def send_message(request: ChatRequest, user: User = Depends(get_current_user)):
    """
    Send message and return streaming response
    """
    async def generate_response():
        try:
            # Create conversation chain
            memory = ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True
            )
            
            # If files are selected, use retrieval chain
            if request.files:
                # IMPLEMENT: Retrieve relevant documents from vector store
                # based on selected file IDs
                retrieval_chain = ConversationalRetrievalChain.from_llm(
                    llm=llm,
                    retriever=vectorstore.as_retriever(),
                    memory=memory
                )
                
                # Stream response
                response = retrieval_chain.run(request.message)
                
                # Simulate streaming by yielding chunks
                for chunk in response.split():
                    yield f'{json.dumps({"type": "token", "content": chunk + " "})}\n'
                    await asyncio.sleep(0.05)  # Small delay for streaming effect
            else:
                # Direct LLM response
                response = llm.predict(request.message)
                
                # Stream response
                for chunk in response.split():
                    yield f'{json.dumps({"type": "token", "content": chunk + " "})}\n'
                    await asyncio.sleep(0.05)
            
            yield f'{json.dumps({"type": "done"})}\n'
            
        except Exception as e:
            yield f'{json.dumps({"type": "error", "error": str(e)})}\n'
    
    return StreamingResponse(generate_response(), media_type="text/plain")

@app.post("/api/files/upload")
async def upload_file(file: UploadFile = File(...), user: User = Depends(get_current_user)):
    """
    Upload and process file with LangChain
    """
    try:
        # Save file
        file_id = str(uuid.uuid4())
        file_path = f"uploads/{file_id}_{file.filename}"
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Process with LangChain
        if file.filename.endswith('.pdf'):
            loader = PyPDFLoader(file_path)
        else:
            loader = TextLoader(file_path)
        
        documents = loader.load()
        
        # Split documents
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        chunks = text_splitter.split_documents(documents)
        
        # Add to vector store
        vectorstore.add_documents(chunks)
        
        return {
            "id": file_id,
            "filename": file.filename,
            "size": len(content),
            "type": file.content_type,
            "processed": True,
            "chunks_count": len(chunks)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/files")
async def get_files(user: User = Depends(get_current_user)):
    """
    Get user's uploaded files
    """
    # IMPLEMENT: Return user's files from your database
    return []

@app.delete("/api/files/{file_id}")
async def delete_file(file_id: str, user: User = Depends(get_current_user)):
    """
    Delete file and remove from vector store
    """
    # IMPLEMENT: Delete file and remove embeddings
    return {"message": "File deleted"}

@app.get("/api/chat/history")
async def get_chat_history(user: User = Depends(get_current_user)):
    """
    Get user's chat history
    """
    # IMPLEMENT: Return user's chats from your database
    return []

@app.post("/api/chat/new")
async def create_new_chat(user: User = Depends(get_current_user)):
    """
    Create new chat
    """
    chat_id = str(uuid.uuid4())
    # IMPLEMENT: Save chat to your database
    return {
        "id": chat_id,
        "title": "New Chat",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "message_count": 0
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Key Integration Points

### 1. Authentication
- Implement JWT token-based authentication
- Store user sessions in your database
- Protect all API endpoints with authentication middleware

### 2. File Processing
- Use LangChain document loaders for different file types
- Process documents into chunks using text splitters
- Store embeddings in a vector database (Chroma, Pinecone, etc.)
- Associate files with users for access control

### 3. Chat Streaming
- Implement streaming responses for real-time chat
- Use LangChain's streaming capabilities
- Send JSON-formatted chunks to the frontend

### 4. Vector Search
- Implement semantic search using your vector store
- Allow users to select files for context in conversations
- Use retrieval-augmented generation (RAG) for file-based queries

### 5. Database Schema
You'll need tables for:
- Users
- Chats
- Messages
- Files
- File chunks/embeddings

## Environment Variables

```bash
# .env file for your Python backend
OPENAI_API_KEY=your-openai-key
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
UPLOAD_DIR=./uploads
VECTOR_DB_PATH=./vector_db
```

## Dependencies

```bash
pip install fastapi uvicorn langchain openai chromadb python-multipart python-jose[cryptography] passlib[bcrypt]
```

## Running the Backend

```bash
python main.py
```

The backend will run on `http://localhost:8000` by default.