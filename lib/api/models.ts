/**
 * Models API functions for LangChain backend integration
 * 
 * MODIFY THESE FUNCTIONS to match your LangChain backend model endpoints
 */

import { API_CONFIG, buildApiUrl } from '../config'
import { Model } from '../../types/api'
import { authAPI } from './auth'

class ModelsAPI {
  /**
   * Get available models from your LangChain backend
   * 
   * MODIFY THIS: Update to match your backend's models endpoint
   * Your backend should return available LLM models
   */
  async getAvailableModels(): Promise<Model[]> {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.MODELS_LIST), {
      headers: authAPI.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get models: ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Get model capabilities
   * 
   * MODIFY THIS: Add this endpoint to your backend to return model capabilities
   */
  async getModelCapabilities(modelId: string): Promise<{
    max_tokens: number
    supports_streaming: boolean
    supports_functions: boolean
    context_window: number
  }> {
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.MODELS_LIST)}/${modelId}/capabilities`, {
      headers: authAPI.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get model capabilities: ${response.statusText}`)
    }

    return await response.json()
  }
}

// Export singleton instance
export const modelsAPI = new ModelsAPI()