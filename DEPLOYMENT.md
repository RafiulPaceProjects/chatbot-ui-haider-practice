# Deployment Guide

## Frontend Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
   - `NEXT_PUBLIC_WS_URL`: Your WebSocket URL (if using)
4. Deploy

### Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Set environment variables in Netlify dashboard

### Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## Backend Deployment

### Railway
1. Create a new project on Railway
2. Connect your Python backend repository
3. Set environment variables
4. Deploy

### Heroku
1. Create a Heroku app
2. Set buildpack to Python
3. Add `Procfile`: `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Deploy

### Docker
```dockerfile
FROM python:3.9

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-backend.herokuapp.com
NEXT_PUBLIC_WS_URL=wss://your-backend.herokuapp.com/ws
```

### Backend (.env)
```
OPENAI_API_KEY=your-openai-key
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
CORS_ORIGINS=https://your-frontend.vercel.app
```

## CORS Configuration

Make sure your backend allows requests from your frontend domain:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```