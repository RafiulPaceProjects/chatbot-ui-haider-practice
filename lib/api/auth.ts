/**
 * Authentication API functions
 * 
 * MODIFY THESE FUNCTIONS to match your LangChain backend authentication
 */

import { API_CONFIG, buildApiUrl } from '../config'
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
   * 
   * MODIFY THIS: Update to match your backend's login endpoint
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error: ApiError = await response.json()
        throw new Error(error.message || 'Login failed')
      }

      const data: LoginResponse = await response.json()
      
      // Store token
      this.token = data.access_token
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.access_token)
      }

      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  /**
   * Logout user
   * 
   * MODIFY THIS: Update to match your backend's logout endpoint
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
   * 
   * MODIFY THIS: Update to match your backend's user info endpoint
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