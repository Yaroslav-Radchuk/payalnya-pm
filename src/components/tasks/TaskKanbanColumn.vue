<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'
import type { Task } from '@/types'
import { TaskStatus } from '@/types'
import { useTaskDrag } from '@/composables/useTaskDrag'
import TaskKanbanCard from './TaskKanbanCard.vue'

interface Props { status: TaskStatus; tasks: Task[] }

const props = defineProps<Props>()
const { onKanbanChange } = useTaskDrag()
const { t } = useI18n()

const labelKey: Record<TaskStatus, string> = {
  [TaskStatus.Todo]: 'kanban.todo',
  [TaskStatus.InProgress]: 'kanban.in_progress',
  [TaskStatus.Done]: 'kanban.done',
}

const localList = computed({
  get: () => props.tasks,
  set: (newList: Task[]) => onKanbanChange(props.status, newList),
})
</script>

<template>
  <div :class="['kanban-col', `kanban-col--${status.replace('_', '-')}`]">
    <div class="kanban-col__header">
      <span class="kanban-col__label">{{ t(labelKey[status]) }}</span>
      <span class="kanban-col__count tnum">{{ tasks.length }}</span>
    </div>
    <draggable
      v-model="localList"
      :group="{ name: 'tasks' }"
      item-key="id"
      ghost-class="sortable-ghost"
      chosen-class="sortable-chosen"
      animation="200"
      class="kanban-col__list"
    >
      <template #item="{ element }">
        <TaskKanbanCard :task="element" />
      </template>
    </draggable>
  </div>
</template>

<style scoped lang="scss">
.kanban-col {
  flex: 1;
  min-width: 260px;
  max-width: 360px;
  background: var(--color-slate);
  border: 1px solid var(--color-iron);
  border-radius: var(--radius-cards);
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-16) var(--spacing-20);
    border-bottom: 1px solid var(--color-iron);
  }

  &__label {
    font-size: var(--text-caption);
    font-weight: var(--font-weight-semibold);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  &__count {
    font-size: var(--text-caption);
    background: var(--color-iron);
    color: var(--color-silver);
    border-radius: var(--radius-full);
    padding: 1px 8px;
    min-width: 22px;
    text-align: center;
  }

  &--todo .kanban-col__label {
    color: var(--color-silver);
  }

  &--in-progress .kanban-col__label {
    color: var(--color-ember-gold);
  }

  &--done .kanban-col__label {
    color: var(--color-pearl);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-10);
    padding: var(--spacing-16);
    flex: 1;
    min-height: 120px;
  }
}
</style>
