import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTasksStore } from '@/stores/tasks'
import { TaskStatus } from '@/types'
import type { Task } from '@/types'

vi.mock('@/api/tasks', () => ({
  tasksApi: {
    getByProject: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

vi.mock('@/stores/projects', () => ({
  useProjectsStore: () => ({
    incrementTaskCount: vi.fn(),
    decrementTaskCount: vi.fn(),
  }),
}))

vi.mock('@/i18n', () => ({
  i18n: { global: { t: (k: string) => k } },
}))

import { tasksApi } from '@/api/tasks'

const mockTask = (overrides: Partial<Task> = {}): Task => ({
  id: 1,
  projectId: 1,
  name: 'Task',
  assignee: null,
  status: TaskStatus.Todo,
  dueDate: '2026-09-01',
  order: 0,
  ...overrides,
})

describe('tasksStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('starts empty', () => {
    const store = useTasksStore()
    expect(store.items).toEqual([])
    expect(store.loading).toBe(false)
  })

  it('fetchByProject loads tasks', async () => {
    const tasks = [mockTask({ id: 1 }), mockTask({ id: 2, status: TaskStatus.Done })]
    vi.mocked(tasksApi.getByProject).mockResolvedValue(tasks)
    const store = useTasksStore()
    await store.fetchByProject(1)
    expect(store.items).toEqual(tasks)
    expect(store.loading).toBe(false)
  })

  it('byStatus groups tasks correctly', () => {
    const store = useTasksStore()
    store.items = [
      mockTask({
        id: 1,
        status: TaskStatus.Todo,
        order: 1,
      }),
      mockTask({
        id: 2,
        status: TaskStatus.InProgress,
        order: 0,
      }),
      mockTask({
        id: 3,
        status: TaskStatus.Done,
        order: 0,
      }),
      mockTask({
        id: 4,
        status: TaskStatus.Todo,
        order: 0,
      }),
    ]
    expect(store.byStatus[TaskStatus.Todo]).toHaveLength(2)
    expect(store.byStatus[TaskStatus.InProgress]).toHaveLength(1)
    expect(store.byStatus[TaskStatus.Done]).toHaveLength(1)
  })

  it('byStatus sorts by order within status', () => {
    const store = useTasksStore()
    store.items = [
      mockTask({
        id: 1,
        status: TaskStatus.Todo,
        order: 2,
      }),
      mockTask({
        id: 2,
        status: TaskStatus.Todo,
        order: 0,
      }),
      mockTask({
        id: 3,
        status: TaskStatus.Todo,
        order: 1,
      }),
    ]
    const ids = store.byStatus[TaskStatus.Todo].map((t) => t.id)
    expect(ids).toEqual([2, 3, 1])
  })

  it('statusCounts reflects current items', () => {
    const store = useTasksStore()
    store.items = [
      mockTask({ id: 1, status: TaskStatus.Todo }),
      mockTask({ id: 2, status: TaskStatus.Todo }),
      mockTask({ id: 3, status: TaskStatus.InProgress }),
    ]
    expect(store.statusCounts).toEqual({
      todo: 2,
      inProgress: 1,
      done: 0,
    })
  })

  it('remove deletes task from items', async () => {
    vi.mocked(tasksApi.remove).mockResolvedValue(undefined)
    const store = useTasksStore()
    store.items = [mockTask({ id: 1 }), mockTask({ id: 2 })]
    await store.remove(1)
    expect(store.items).toHaveLength(1)
    expect(store.items[0].id).toBe(2)
  })

  it('update replaces task in items', async () => {
    const updated = mockTask({ id: 1, name: 'Updated' })
    vi.mocked(tasksApi.update).mockResolvedValue(updated)
    const store = useTasksStore()
    store.items = [mockTask({ id: 1, name: 'Original' })]
    await store.update(1, { name: 'Updated' })
    expect(store.items[0].name).toBe('Updated')
  })
})
