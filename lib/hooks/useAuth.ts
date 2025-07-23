/**
 * Authentication hook for managing user state
 * 
 * This hook manages authentication state and provides auth functions
 */

import { useState, useEffect, useCallback } from 'react'
import { User, LoginRequest } from '../../types/api'
import { authAPI } from '../api/auth'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)
      const currentUser = await authAPI.getCurrentUser()
      setUser(currentUser)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication check failed')
    } finally {
      setLoading(false)
    }
  }

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authAPI.login(credentials)
      setUser(response.user)
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authAPI.logout()
      setUser(null)
      setError(null)
    } catch (err) {
      console.error('Logout error:', err)
    }
  }, [])

  const isAuthenticated = authAPI.isAuthenticated()

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  }
}