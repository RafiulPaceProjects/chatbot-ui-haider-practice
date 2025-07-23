/**
 * Files hook for managing file uploads and operations
 * 
 * This hook manages file state and provides file operations
 */

import { useState, useCallback } from 'react'
import { FileInfo, FileUploadResponse } from '../../types/api'
import { fileAPI } from '../api/files'

export const useFiles = () => {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Load user files
   */
  const loadFiles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const userFiles = await fileAPI.getFiles()
      setFiles(userFiles)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files')
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Upload a file
   */
  const uploadFile = useCallback(async (file: File, description?: string): Promise<FileUploadResponse> => {
    try {
      setUploading(true)
      setError(null)
      
      const response = await fileAPI.uploadFile(file, description)
      
      // Add to files list
      const newFile: FileInfo = {
        id: response.id,
        filename: response.filename,
        size: response.size,
        type: response.type,
        uploaded_at: new Date().toISOString(),
        processed: response.processed,
        chunks_count: response.chunks_count,
      }
      
      setFiles(prev => [newFile, ...prev])
      
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setUploading(false)
    }
  }, [])

  /**
   * Delete a file
   */
  const deleteFile = useCallback(async (fileId: string) => {
    try {
      setError(null)
      await fileAPI.deleteFile(fileId)
      setFiles(prev => prev.filter(file => file.id !== fileId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file')
      throw err
    }
  }, [])

  /**
   * Search files
   */
  const searchFiles = useCallback(async (query: string, limit?: number): Promise<FileInfo[]> => {
    try {
      setError(null)
      return await fileAPI.searchFiles(query, limit)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search files')
      return []
    }
  }, [])

  /**
   * Check file processing status
   */
  const checkFileStatus = useCallback(async (fileId: string) => {
    try {
      const status = await fileAPI.getFileStatus(fileId)
      
      // Update file in state
      setFiles(prev => 
        prev.map(file => 
          file.id === fileId 
            ? { ...file, processed: status.processed, chunks_count: status.chunks_count }
            : file
        )
      )
      
      return status
    } catch (err) {
      console.error('Failed to check file status:', err)
      return null
    }
  }, [])

  return {
    files,
    uploading,
    loading,
    error,
    loadFiles,
    uploadFile,
    deleteFile,
    searchFiles,
    checkFileStatus,
    setError,
  }
}