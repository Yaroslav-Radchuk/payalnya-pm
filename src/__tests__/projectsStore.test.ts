import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProjectsStore } from '@/stores/projects'
import { ProjectStatus } from '@/types'
import type { Project } from '@/types'

vi.mock('@/api/projects', () => ({
  projectsApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

vi.mock('@/i18n', () => ({
  i18n: { global: { t: (k: string) => k } },
}))

import { projectsApi } from '@/api/projects'

const mockProject = (overrides: Partial<Project> = {}): Project => ({
  id: 1,
  name: 'Test',
  description: '',
  status: ProjectStatus.Active,
  createdAt: '2026-01-01T00:00:00Z',
  taskCount: 0,
  ...overrides,
})

describe('projectsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('starts with empty items and loading false', () => {
    const store = useProjectsStore()
    expect(store.items).toEqual([])
    expect(store.loading).toBe(false)
  })

  it('fetchAll sets items and clears loading', async () => {
    const projects = [mockProject({ id: 1 }), mockProject({ id: 2, status: ProjectStatus.Archived })]
    vi.mocked(projectsApi.getAll).mockResolvedValue(projects)
    const store = useProjectsStore()
    await store.fetchAll()
    expect(store.items).toEqual(projects)
    expect(store.loading).toBe(false)
  })

  it('fetchAll sets error on failure', async () => {
    vi.mocked(projectsApi.getAll).mockRejectedValue(new Error('Network error'))
    const store = useProjectsStore()
    await store.fetchAll()
    expect(store.error).toBe('Network error')
    expect(store.items).toEqual([])
  })

  it('create appends project to items', async () => {
    const project = mockProject()
    vi.mocked(projectsApi.create).mockResolvedValue(project)
    const store = useProjectsStore()
    await store.create({ name: 'Test', description: '' })
    expect(store.items).toHaveLength(1)
    expect(store.items[0]).toEqual(project)
  })

  it('remove filters project from items', async () => {
    vi.mocked(projectsApi.remove).mockResolvedValue(undefined)
    const store = useProjectsStore()
    store.items = [mockProject({ id: 1 }), mockProject({ id: 2 })]
    await store.remove(1)
    expect(store.items).toHaveLength(1)
    expect(store.items[0].id).toBe(2)
  })

  it('totalActive counts only active projects', () => {
    const store = useProjectsStore()
    store.items = [
      mockProject({ id: 1, status: ProjectStatus.Active }),
      mockProject({ id: 2, status: ProjectStatus.Active }),
      mockProject({ id: 3, status: ProjectStatus.Archived }),
    ]
    expect(store.totalActive).toBe(2)
  })

  it('incrementTaskCount increases taskCount by 1', () => {
    const store = useProjectsStore()
    store.items = [mockProject({ id: 1, taskCount: 3 })]
    store.incrementTaskCount(1)
    expect(store.items[0].taskCount).toBe(4)
  })

  it('decrementTaskCount does not go below 0', () => {
    const store = useProjectsStore()
    store.items = [mockProject({ id: 1, taskCount: 0 })]
    store.decrementTaskCount(1)
    expect(store.items[0].taskCount).toBe(0)
  })
})
