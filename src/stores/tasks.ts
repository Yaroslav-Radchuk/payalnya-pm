import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task } from '@/types'
import { TaskStatus } from '@/types'
import { tasksApi } from '@/api/tasks'
import { useToastStore } from './toast'
import { useProjectsStore } from './projects'
import { i18n } from '@/i18n'

const t = i18n.global.t

export const useTasksStore = defineStore('tasks', () => {
  const items = ref<Task[]>([])
  const loading = ref(false)
  const currentProjectId = ref<number | null>(null)

  const toast = useToastStore()

  const _bucketed = computed(() => {
    const buckets: Record<TaskStatus, Task[]> = {
      [TaskStatus.Todo]: [],
      [TaskStatus.InProgress]: [],
      [TaskStatus.Done]: [],
    }

    for (const task of items.value) {
      buckets[task.status].push(task)
    }

    buckets[TaskStatus.Todo].sort((a, b) => a.order - b.order)
    buckets[TaskStatus.InProgress].sort((a, b) => a.order - b.order)
    buckets[TaskStatus.Done].sort((a, b) => a.order - b.order)

    return buckets
  })

  const byStatus = computed(() => _bucketed.value)

  const statusCounts = computed(() => ({
    todo: _bucketed.value[TaskStatus.Todo].length,
    inProgress: _bucketed.value[TaskStatus.InProgress].length,
    done: _bucketed.value[TaskStatus.Done].length,
  }))

  async function fetchByProject(projectId: number): Promise<void> {
    loading.value = true
    currentProjectId.value = projectId

    try {
      items.value = await tasksApi.getByProject(projectId)
    } finally {
      loading.value = false
    }
  }

  async function create(payload: Omit<Task, 'id' | 'order'>): Promise<void> {
    const task = await tasksApi.create(payload)
    items.value.push(task)
    const projects = useProjectsStore()
    projects.incrementTaskCount(task.projectId)
    toast.success(t('toast.taskCreated'))
  }

  async function update(id: number, payload: Partial<Task>): Promise<void> {
    const updated = await tasksApi.update(id, payload)
    const idx = items.value.findIndex((t) => t.id === id)

    if (idx !== -1) {
      items.value[idx] = updated
    }

    toast.success(t('toast.taskUpdated'))
  }

  async function remove(id: number): Promise<void> {
    const task = items.value.find((t) => t.id === id)
    
    await tasksApi.remove(id)

    items.value = items.value.filter((t) => t.id !== id)

    if (task) {
      const projects = useProjectsStore()
      projects.decrementTaskCount(task.projectId)
    }

    toast.success(t('toast.taskDeleted'))
  }

  async function reorder(reordered: Task[]): Promise<void> {
    const patches = reordered.map((t, i) => ({ ...t, order: i }))
    const patchIds = new Set(patches.map((t) => t.id))
    const others = items.value.filter((t) => !patchIds.has(t.id))

    items.value = [...patches, ...others]

    await Promise.all(patches.map((t) => tasksApi.update(t.id, { order: t.order, status: t.status })))
  }

  async function moveToStatus(taskId: number, newStatus: TaskStatus, newOrder: number): Promise<void> {
    const task = items.value.find((t) => t.id === taskId)

    if (!task) {
      return
    }

    const updated = { ...task, status: newStatus, order: newOrder }
    const idx = items.value.findIndex((t) => t.id === taskId)

    if (idx !== -1) {
      items.value[idx] = updated
    }

    await tasksApi.update(taskId, { status: newStatus, order: newOrder })
  }

  return {
    items,
    loading,
    currentProjectId,
    byStatus,
    statusCounts,
    fetchByProject,
    create,
    update,
    remove,
    reorder,
    moveToStatus,
  }
})
