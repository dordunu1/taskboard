import { Timestamp } from 'firebase/firestore'

export enum TaskStatus {
  IDEATION = 'IDEATION',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum TaskCategory {
  BLOCKCHAIN = 'BLOCKCHAIN',
  GENERAL = 'GENERAL',
}

export interface Attachment {
  name: string
  url: string
  type: string
  size: number
  uploadedAt: Timestamp
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
  attachments?: Attachment[]
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