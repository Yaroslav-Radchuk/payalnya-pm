import type { Task } from '@/types'
import { TaskStatus } from '@/types'
import { useTasksStore } from '@/stores/tasks'

export function useTaskDrag() {
  const store = useTasksStore()

  async function onTableReorder(reordered: Task[]): Promise<void> {
    await store.reorder(reordered)
  }

  async function onKanbanChange(
    status: TaskStatus,
    newList: Task[],
  ): Promise<void> {
    const patches = newList.map((t, i) => ({ ...t, status, order: i }))
    await store.reorder(patches)
  }

  return { onTableReorder, onKanbanChange }
}
