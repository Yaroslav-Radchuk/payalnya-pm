export enum ProjectStatus {
  Active = 'active',
  Archived = 'archived',
}

export enum TaskStatus {
  Todo = 'todo',
  InProgress = 'in_progress',
  Done = 'done',
}

export interface Project {
  id: number
  name: string
  description?: string
  status: ProjectStatus
  createdAt: string
  taskCount: number
}

export interface Task {
  id: number
  projectId: number
  name: string
  assignee: string | null
  status: TaskStatus
  dueDate: string
  order: number
}

export type SortDirection = 'asc' | 'desc'

export interface SortState<T> {
  key: keyof T | null
  direction: SortDirection
}

export interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export interface ApiResponse<T> {
  data: T
  status: number
}
