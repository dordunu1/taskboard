import { storage } from './firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { Timestamp } from 'firebase/firestore'
import { MediaAttachment } from './types'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export async function uploadTaskMedia(
  file: File,
  taskId: string,
  userId: string
): Promise<MediaAttachment> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 10MB limit')
  }

  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('File type not supported')
  }

  // Create a unique file name
  const fileExtension = file.name.split('.').pop()
  const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`
  const filePath = `tasks/${taskId}/attachments/${uniqueFileName}`

  // Upload file to Firebase Storage
  const storageRef = ref(storage, filePath)
  await uploadBytes(storageRef, file)

  // Get download URL
  const downloadUrl = await getDownloadURL(storageRef)

  // Return media attachment object
  return {
    id: uniqueFileName,
    fileName: file.name,
    fileUrl: downloadUrl,
    fileType: file.type,
    fileSize: file.size,
    uploadedAt: Timestamp.now(),
    uploadedBy: userId,
  }
} 