import type { Task } from '@/types'
import { apiGet, apiPost, apiPut, apiDelete } from './client'

export const tasksApi = {
  getByProject: (projectId: number) =>
    apiGet<Task[]>('/tasks', { projectId }),
  create: (payload: Omit<Task, 'id' | 'order'>) =>
    apiPost<Task>('/tasks', payload),
  update: (id: number, payload: Partial<Task>) =>
    apiPut<Task>(`/tasks/${id}`, payload),
  remove: (id: number) => apiDelete(`/tasks/${id}`),
}
