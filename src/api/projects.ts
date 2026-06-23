import type { Project } from '@/types'
import { apiGet, apiPost, apiPut, apiDelete } from './client'

export const projectsApi = {
  getAll: () => apiGet<Project[]>('/projects'),
  create: (payload: Pick<Project, 'name' | 'description'>) =>
    apiPost<Project>('/projects', payload),
  update: (id: number, payload: Partial<Project>) =>
    apiPut<Project>(`/projects/${id}`, payload),
  remove: (id: number) => apiDelete(`/projects/${id}`),
}
