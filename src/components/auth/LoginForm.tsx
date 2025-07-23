import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card } from '../ui/Card'
import { API_CONFIG } from '../../lib/config'

export const LoginForm: React.FC = () => {
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) return

    try {
      await login({ email, password })
    } catch (err) {
      const errorMessage = (error as Error).message
      
      // Provide user-friendly error messages
      if (errorMessage.includes('Cannot connect to backend')) {
        setError('Cannot connect to server. Please check if your backend is running.')
      } else if (errorMessage.includes('not configured')) {
        setError('Backend not configured. Please set up your environment variables.')
      } else {
        setError(errorMessage)
      }
      console.error('Login failed:', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {API_CONFIG.APP.NAME}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {API_CONFIG.APP.DESCRIPTION}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !email || !password}
            loading={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Backend Integration
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            This frontend connects to your LangChain backend at{' '}
            <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
              {API_CONFIG.BASE_URL}
            </code>
          </p>
        </div>
      </Card>
    </div>
  )
}