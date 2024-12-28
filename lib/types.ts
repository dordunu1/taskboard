export type TaskStatus = 'ideation' | 'todo' | 'inProgress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  createdBy: string
  assignee?: string
  dueDate?: string
  attachments?: Attachment[]
  createdAt: string
  updatedAt: string
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
  createdAt: string
  createdBy: string
}

export interface User {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt: string
  updatedAt: string
} 