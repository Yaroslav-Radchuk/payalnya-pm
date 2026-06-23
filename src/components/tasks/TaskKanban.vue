<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Task } from '@/types'
import { TaskStatus } from '@/types'
import TaskKanbanColumn from './TaskKanbanColumn.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'

interface Props {
  tasks: Task[]
}

const props = defineProps<Props>()
const { t } = useI18n()
const editingTask = ref<Task | null>(null)

const columns = [TaskStatus.Todo, TaskStatus.InProgress, TaskStatus.Done]

function tasksFor(status: TaskStatus): Task[] {
  return props.tasks
    .filter((t) => t.status === status)
    .sort((a, b) => a.order - b.order)
}
</script>

<template>
  <div class="kanban-root">
    <div class="kanban">
      <TaskKanbanColumn
        v-for="col in columns"
        :key="col"
        :status="col"
        :tasks="tasksFor(col)"
        @edit="editingTask = $event"
      />
    </div>

    <BaseModal
      :model-value="editingTask !== null"
      :title="t('project.editTask')"
      @update:model-value="editingTask = null"
    >
      <TaskForm
        v-if="editingTask"
        :key="editingTask.id"
        :project-id="editingTask.projectId"
        :task="editingTask"
        @close="editingTask = null"
      />
    </BaseModal>
  </div>
</template>

<style scoped lang="scss">
.kanban-root {
  display: contents;
}

.kanban {
  display: flex;
  gap: var(--spacing-16);
  align-items: flex-start;
  overflow-x: auto;
  padding-bottom: var(--spacing-8);
}
</style>
