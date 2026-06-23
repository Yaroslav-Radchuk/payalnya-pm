<script setup lang="ts">
import type { Task } from '@/types'
import { TaskStatus } from '@/types'
import TaskKanbanColumn from './TaskKanbanColumn.vue'

interface Props {
  tasks: Task[]
}

const props = defineProps<Props>()

const columns = [TaskStatus.Todo, TaskStatus.InProgress, TaskStatus.Done]

function tasksFor(status: TaskStatus): Task[] {
  return props.tasks
    .filter((t) => t.status === status)
    .sort((a, b) => a.order - b.order)
}
</script>

<template>
  <div class="kanban">
    <TaskKanbanColumn
      v-for="col in columns"
      :key="col"
      :status="col"
      :tasks="tasksFor(col)"
    />
  </div>
</template>

<style scoped lang="scss">
.kanban {
  display: flex;
  gap: var(--spacing-16);
  align-items: flex-start;
  overflow-x: auto;
  padding-bottom: var(--spacing-8);
}
</style>
