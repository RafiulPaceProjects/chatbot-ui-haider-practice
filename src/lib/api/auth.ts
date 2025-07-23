/**
 * Authentication API functions
 */

import { API_CONFIG, buildApiUrl, isApiConfigured } from '../config'
import { LoginRequest, LoginResponse, User, ApiError } from '../../types/api'

class AuthAPI {
  private token: string | null = null

  constructor() {
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Check if API is configured
    if (!isApiConfigured()) {
      throw new Error('Backend API is not configured. Please check your environment variables.')
    }

    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Login failed with status ${response.status}`)
      }

      const data: LoginResponse = await response.json()
      
      // Store token
      this.token = data.access_token
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.access_token)
      }

      return data
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend server. Please ensure your LangChain backend is running.')
      }
      console.error('Login error:', error)
      throw error
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      if (this.token) {
        await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOGOUT), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear token regardless of API call success
      this.token = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
      }
    }
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<User | null> {
    if (!this.token) return null

    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ME), {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, clear it
          this.logout()
          return null
        }
        throw new Error('Failed to get user info')
      }

      return await response.json()
    } catch (error) {
      console.error('Get user error:', error)
      return null
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token
  }

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return this.token
  }

  /**
   * Get authorization headers for API calls
   */
  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    return headers
  }
}

// Export singleton instance
export const authAPI = new AuthAPI()