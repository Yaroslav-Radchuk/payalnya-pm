import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Project } from '@/types'
import { projectsApi } from '@/api/projects'
import { useToastStore } from './toast'
import { i18n } from '@/i18n'

const t = i18n.global.t

export const useProjectsStore = defineStore('projects', () => {
  const items = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const toast = useToastStore()

  const totalActive = computed(() => items.value.filter((p) => p.status === 'active').length)

  async function fetchAll(): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      items.value = await projectsApi.getAll()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function create(payload: Pick<Project, 'name' | 'description'>): Promise<void> {
    const project = await projectsApi.create(payload)
    items.value.push(project)
    toast.success(t('toast.projectCreated'))
  }

  async function update(id: number, payload: Partial<Project>, toastKey = 'toast.projectUpdated'): Promise<void> {
    const updated = await projectsApi.update(id, payload)
    const idx = items.value.findIndex((p) => p.id === id)

    if (idx !== -1) {
      items.value[idx] = updated
    }

    toast.success(t(toastKey))
  }

  async function remove(id: number): Promise<void> {
    await projectsApi.remove(id)
    items.value = items.value.filter((p) => p.id !== id)
    toast.success(t('toast.projectDeleted'))
  }

  function incrementTaskCount(projectId: number): void {
    const p = items.value.find((x) => x.id === projectId)

    if (p) {
      p.taskCount++
    }
  }

  function decrementTaskCount(projectId: number): void {
    const p = items.value.find((x) => x.id === projectId)

    if (p && p.taskCount > 0) {
      p.taskCount--
    }
  }

  return {
    items,
    loading,
    error,
    totalActive,
    fetchAll,
    create,
    update,
    remove,
    incrementTaskCount,
    decrementTaskCount,
  }
})
