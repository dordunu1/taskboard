import { Timestamp } from 'firebase/firestore'

export enum TaskStatus {
  IDEATION = 'Ideation',
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export enum TaskCategory {
  BLOCKCHAIN = 'Blockchain',
  GENERAL = 'General',
}

export interface MediaAttachment {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploadedAt: Timestamp
  uploadedBy: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  category: TaskCategory
  dueDate?: Timestamp
  assignee?: string
  collaborators?: string[]
  attachments?: MediaAttachment[]
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
  links?: string[]
}

export interface User {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  text: string
  userName: string
  createdAt: Timestamp
  taskId: string
} 