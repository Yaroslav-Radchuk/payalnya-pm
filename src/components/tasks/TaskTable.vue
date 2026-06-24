<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'
import type { Task } from '@/types'
import { TaskStatus } from '@/types'
import { formatDate } from '@/utils/format'
import { useConfirm } from '@/composables/useConfirm'
import { useTableSort } from '@/composables/useTableSort'
import { useTableFilter } from '@/composables/useTableFilter'
import { useColumnResize } from '@/composables/useColumnResize'
import { useTaskDrag } from '@/composables/useTaskDrag'
import { useTasksStore } from '@/stores/tasks'
import StatusPill from '@/components/common/StatusPill.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'

interface Props { tasks: Task[] }

const props = defineProps<Props>()
const editingTask = ref<Task | null>(null)
const store = useTasksStore()
const { onTableReorder } = useTaskDrag()
const { t } = useI18n()
const { confirm } = useConfirm()

const source = computed(() => props.tasks)
const { sorted, toggle, iconFor, sortIcon } = useTableSort<Task>(source)

const { search, extra, filtered, setSearch, setExtra } = useTableFilter<Task>(
  sorted, 'tasks',
  (task, s, x) => {
    const matchAssignee = !s || (task.assignee ?? '').toLowerCase().includes(s.toLowerCase())
    const matchStatus = !x.status || task.status === x.status

    return matchAssignee && matchStatus
  },
)

const { widths, startResize } = useColumnResize({
  id: 60,
  name: 240,
  assignee: 160,
  status: 130,
  dueDate: 140,
  actions: 96,
})

const statusOptions = computed(() => [
  { value: '', label: t('table.tasks.allStatuses') },
  { value: TaskStatus.Todo, label: t('kanban.todo') },
  { value: TaskStatus.InProgress, label: t('kanban.in_progress') },
  { value: TaskStatus.Done, label: t('kanban.done') },
])

const draggableList = ref<Task[]>([...filtered.value])

watch(filtered, (newFiltered) => {
  draggableList.value = [...newFiltered]
})

function handleDrop(newList: Task[]): void {
  draggableList.value = newList
  onTableReorder(newList)
}

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

function isPast(d: string) {
  return new Date(d + 'T00:00:00') < new Date(new Date().toDateString())
}
</script>

<template>
  <div class="task-table">
    <div class="task-table__toolbar">
      <div class="task-table__search-wrap">
        <svg class="task-table__search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.2"/>
          <path d="M10.5 10.5l3 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        <input
          class="task-table__search"
          :value="search"
          :placeholder="t('table.tasks.search')"
          @input="setSearch(($event.target as HTMLInputElement).value)"
        />
      </div>
      <BaseSelect
        :model-value="extra.status ?? ''"
        :options="statusOptions"
        :aria-label="t('table.tasks.status')"
        @update:model-value="setExtra('status', $event)"
      />
    </div>

    <div class="task-table__wrap">
      <table class="task-table__table">
        <thead>
          <tr>
            <th
              :style="{ width: widths.id + 'px' }"
              class="task-table__th task-table__th--sort"
              @click="toggle('id')"
            >
              {{ t('table.tasks.id') }} <span>{{ sortIcon(iconFor('id')) }}</span>
              <span
                class="task-table__resizer"
                @mousedown.stop="startResize('id', $event)"
              />
            </th>
            <th :style="{ width: widths.name + 'px' }" class="task-table__th">
              {{ t('table.tasks.name') }}
              <span
                class="task-table__resizer"
                @mousedown.stop="startResize('name', $event)"
              />
            </th>
            <th :style="{ width: widths.assignee + 'px' }" class="task-table__th">
              {{ t('table.tasks.assignee') }}
              <span
                class="task-table__resizer"
                @mousedown.stop="startResize('assignee', $event)"
              />
            </th>
            <th
              :style="{ width: widths.status + 'px' }"
              class="task-table__th task-table__th--sort"
              @click="toggle('status')"
            >
              {{ t('table.tasks.status') }} <span>{{ sortIcon(iconFor('status')) }}</span>
              <span
                class="task-table__resizer"
                @mousedown.stop="startResize('status', $event)"
              />
            </th>
            <th
              :style="{ width: widths.dueDate + 'px' }"
              class="task-table__th task-table__th--sort"
              @click="toggle('dueDate')"
            >
              {{ t('table.tasks.due') }} <span>{{ sortIcon(iconFor('dueDate')) }}</span>
              <span
                class="task-table__resizer"
                @mousedown.stop="startResize('dueDate', $event)"
              />
            </th>
            <th :style="{ width: widths.actions + 'px' }" class="task-table__th task-table__th--actions" />
          </tr>
        </thead>
        <draggable
          :model-value="draggableList"
          tag="tbody"
          item-key="id"
          handle=".task-table__drag"
          ghost-class="sortable-ghost"
          chosen-class="sortable-chosen"
          animation="200"
          @update:model-value="handleDrop"
        >
          <template #item="{ element: task }">
            <tr class="task-table__row">
              <td class="task-table__td tnum task-table__td--muted">
                <span class="task-table__drag" title="Drag to reorder">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="4" cy="3" r="1" fill="currentColor"/><circle cx="8" cy="3" r="1" fill="currentColor"/>
                    <circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="8" cy="6" r="1" fill="currentColor"/>
                    <circle cx="4" cy="9" r="1" fill="currentColor"/><circle cx="8" cy="9" r="1" fill="currentColor"/>
                  </svg>
                </span>
                {{ task.id }}
              </td>
              <td class="task-table__td task-table__td--name">{{ task.name }}</td>
              <td class="task-table__td task-table__td--muted">{{ task.assignee ?? '—' }}</td>
              <td class="task-table__td"><StatusPill :status="task.status" /></td>
              <td :class="['task-table__td', 'tnum', isPast(task.dueDate) && task.status !== 'done' ? 'task-table__td--overdue' : 'task-table__td--muted']">
                {{ formatDate(task.dueDate) }}
              </td>
              <td class="task-table__td task-table__td--actions">
                <div class="task-table__action-wrap">
                  <BaseButton
                    variant="ghost"
                    size="sm"
                    :aria-label="t('project.editTask')"
                    @click="editingTask = task"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M8.5 1.5a1.414 1.414 0 0 1 2 2L3.5 10.5l-3 .5.5-3 7.5-7Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </BaseButton>
                  <BaseButton
                    variant="danger"
                    size="sm"
                    :aria-label="t('confirm.deleteTaskTitle')"
                    @click="removeTask(task.id)"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 3h10M4 3V2h4v1M2 3l.5 7h7L10 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </BaseButton>
                </div>
              </td>
            </tr>
          </template>
        </draggable>
        <tbody v-if="!filtered.length">
          <tr><td colspan="6" class="task-table__empty">{{ t('table.tasks.empty') }}</td></tr>
        </tbody>
      </table>
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
.task-table {
  &__toolbar {
    display: flex;
    align-items: center;
    gap: var(--spacing-12);
    margin-bottom: var(--spacing-20);
    flex-wrap: wrap;
  }

  &__search-wrap {
    position: relative;
    flex: 1;
    min-width: 200px;
    max-width: 280px;
  }

  &__search-icon {
    position: absolute;
    left: var(--spacing-14);
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-ash);
    pointer-events: none;
  }

  &__search {
    width: 100%;
    background: var(--color-graphite);
    border: 1px solid var(--color-fog);
    border-radius: var(--radius-inputs);
    color: var(--color-bone);
    font-family: var(--font-inter);
    font-size: var(--text-body-lg);
    padding: var(--spacing-14) var(--spacing-14) var(--spacing-14) 40px;
    outline: none;
    transition: border-color var(--transition-fast);

    &::placeholder {
      color: var(--color-ash);
    }

    &:focus {
      border-color: var(--color-silver);
    }
  }

  &__wrap {
    overflow-x: auto;
    border: 1px solid var(--color-iron);
    border-radius: var(--radius-cards);
    background: var(--color-slate);
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  &__th {
    padding: var(--spacing-12) var(--spacing-16);
    text-align: left;
    font-size: var(--text-caption);
    font-weight: var(--font-weight-medium);
    color: var(--color-silver);
    letter-spacing: 0.01px;
    text-transform: uppercase;
    border-bottom: 1px solid var(--color-iron);
    white-space: nowrap;
    position: relative;
    user-select: none;

    &--sort {
      cursor: pointer;

      &:hover {
        color: var(--color-pearl);
      }
    }
  }

  &__resizer {
    position: absolute;
    right: 0;
    top: 20%;
    height: 60%;
    width: 4px;
    cursor: col-resize;
    border-right: 1px solid var(--color-iron);
    transition: border-color var(--transition-fast);

    &:hover {
      border-right-color: var(--color-ember-gold);
    }
  }

  &__row {
    cursor: default;
    transition: background var(--transition-fast);

    &:hover .task-table__td {
      background: rgba(255, 255, 255, 0.015);
    }

    &:not(:last-child) .task-table__td {
      border-bottom: 1px solid var(--color-iron);
    }
  }

  &__td {
    padding: var(--spacing-12) var(--spacing-16);
    font-size: var(--text-body-lg);
    color: var(--color-bone);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: background var(--transition-fast);

    &--muted {
      color: var(--color-silver);
    }

    &--name {
      font-weight: var(--font-weight-medium);
    }

    &--overdue {
      color: #e05252;
    }

    &--actions {
      padding-block: var(--spacing-8);
      overflow: visible;
      position: sticky;
      right: 0;
      background: var(--color-slate);
    }
  }

  &__th--actions {
    position: sticky;
    right: 0;
    background: var(--color-slate);
    z-index: 1;
  }

  &__action-wrap {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__drag {
    cursor: grab;
    color: var(--color-steel);
    margin-right: var(--spacing-8);
    display: inline-flex;
    vertical-align: middle;

    &:hover {
      color: var(--color-silver);
    }
  }

  &__empty {
    padding: var(--spacing-40);
    text-align: center;
    color: var(--color-ash);
  }
}
</style>
