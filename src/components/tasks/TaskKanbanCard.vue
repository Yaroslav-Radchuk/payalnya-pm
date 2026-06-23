<script setup lang="ts">
import type { Task } from '@/types'
import { useI18n } from 'vue-i18n'
import { useTasksStore } from '@/stores/tasks'
import { useConfirm } from '@/composables/useConfirm'
import { formatDateShort } from '@/utils/format'
import StatusPill from '@/components/common/StatusPill.vue'

interface Props {
  task: Task
}

defineProps<Props>()
const store = useTasksStore()
const { t } = useI18n()
const { confirm } = useConfirm()

async function removeTask(id: number) {
  const ok = await confirm({
    title: t('confirm.deleteTaskTitle'),
    message: t('confirm.deleteTaskMsg'),
    danger: true,
  })

  if (ok) {
    store.remove(id)
  }
}
</script>

<template>
  <div class="kanban-card">
    <div class="kanban-card__header">
      <span class="kanban-card__id tnum">{{ task.id }}</span>
      <button class="kanban-card__del" @click.stop="removeTask(task.id)">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2L2 10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
      </button>
    </div>
    <p class="kanban-card__name">{{ task.name }}</p>
    <div class="kanban-card__footer">
      <StatusPill :status="task.status" />
      <div class="kanban-card__meta">
        <span v-if="task.assignee" class="kanban-card__assignee">{{ task.assignee.split(' ')[0] }}</span>
        <span class="kanban-card__due tnum">{{ formatDateShort(task.dueDate) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.kanban-card {
  background: var(--color-graphite);
  border: 1px solid var(--color-iron);
  border-radius: var(--radius-cards);
  padding: var(--spacing-16);
  cursor: grab;
  transition: border-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);

  &:hover {
    border-color: var(--color-steel);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    transform: translateY(-1px);
  }

  &:active {
    cursor: grabbing;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-8);
  }

  &__id {
    font-size: var(--text-caption);
    color: var(--color-ash);
  }

  &__del {
    background: transparent;
    border: none;
    color: var(--color-steel);
    padding: 2px;
    border-radius: 2px;
    transition: color var(--transition-fast);
    display: flex;

    &:hover {
      color: #e05252;
    }
  }

  &__name {
    font-size: var(--text-body-lg);
    font-weight: var(--font-weight-medium);
    color: var(--color-bone);
    line-height: 1.4;
    margin-bottom: var(--spacing-12);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-8);
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: var(--spacing-8);
  }

  &__assignee {
    font-size: var(--text-caption);
    color: var(--color-silver);
  }

  &__due {
    font-size: var(--text-caption);
    color: var(--color-ash);
  }
}
</style>
