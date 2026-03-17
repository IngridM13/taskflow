export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface User {
  id: string
  email: string
  name?: string
}

export interface Project {
  id: string
  name: string
  description?: string
  archived: boolean
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  projectId: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  body: string
  taskId: string
  authorId: string
  createdAt: string
  author?: { id: string; email: string; name?: string }
}
