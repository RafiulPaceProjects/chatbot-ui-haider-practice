/**
 * File API functions for LangChain backend integration
 * 
 * MODIFY THESE FUNCTIONS to match your LangChain document processing endpoints
 */

import { API_CONFIG, buildApiUrl } from '../config'
import { FileUploadRequest, FileUploadResponse, FileInfo } from '../../types/api'
import { authAPI } from './auth'

class FileAPI {
  /**
   * Upload file for processing with LangChain
   * 
   * MODIFY THIS: Update to match your backend's file upload endpoint
   * Your backend should:
   * 1. Accept the file upload
   * 2. Process it with LangChain document loaders
   * 3. Generate embeddings
   * 4. Store in vector database
   * 5. Return file info
   */
  async uploadFile(file: File, description?: string): Promise<FileUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    if (description) {
      formData.append('description', description)
    }

    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FILE_UPLOAD), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authAPI.getToken()}`,
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'File upload failed')
    }

    return await response.json()
  }

  /**
   * Get list of uploaded files
   * 
   * MODIFY THIS: Update to match your backend's file list endpoint
   */
  async getFiles(): Promise<FileInfo[]> {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FILE_LIST), {
      headers: authAPI.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get files: ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Delete a file
   * 
   * MODIFY THIS: Update to match your backend's file delete endpoint
   * Your backend should:
   * 1. Delete the file from storage
   * 2. Remove embeddings from vector database
   * 3. Clean up any related data
   */
  async deleteFile(fileId: string): Promise<void> {
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.FILE_DELETE)}/${fileId}`, {
      method: 'DELETE',
      headers: authAPI.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.statusText}`)
    }
  }

  /**
   * Get file processing status
   * 
   * MODIFY THIS: Add this endpoint to your backend to check processing status
   */
  async getFileStatus(fileId: string): Promise<{ processed: boolean; chunks_count?: number }> {
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.FILE_LIST)}/${fileId}/status`, {
      headers: authAPI.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get file status: ${response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Search files using vector similarity
   * 
   * MODIFY THIS: Add this endpoint to your backend for semantic file search
   * Your backend should use LangChain's vector store for similarity search
   */
  async searchFiles(query: string, limit: number = 5): Promise<FileInfo[]> {
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.FILE_LIST)}/search`, {
      method: 'POST',
      headers: authAPI.getAuthHeaders(),
      body: JSON.stringify({ query, limit }),
    })

    if (!response.ok) {
      throw new Error(`Failed to search files: ${response.statusText}`)
    }

    return await response.json()
  }
}

// Export singleton instance
export const fileAPI = new FileAPI()