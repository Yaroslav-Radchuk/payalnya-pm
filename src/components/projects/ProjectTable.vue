<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Project } from '@/types'
import { ProjectStatus } from '@/types'
import { formatDate } from '@/utils/format'
import { useConfirm } from '@/composables/useConfirm'
import { useTableSort } from '@/composables/useTableSort'
import { useTableFilter } from '@/composables/useTableFilter'
import { useColumnResize } from '@/composables/useColumnResize'
import { useProjectsStore } from '@/stores/projects'
import StatusPill from '@/components/common/StatusPill.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import ProjectForm from '@/components/projects/ProjectForm.vue'

interface Props { projects: Project[] }

const props = defineProps<Props>()
const router = useRouter()
const store = useProjectsStore()
const { t } = useI18n()
const { confirm } = useConfirm()

const source = computed(() => props.projects)
const { sorted, toggle, iconFor, sortIcon } = useTableSort<Project>(source)

const { search, extra, filtered, setSearch, setExtra } = useTableFilter<Project>(
  sorted,
  'projects',
  (p, s, x) => {
    const matchName = p.name.toLowerCase().includes(s.toLowerCase())
    const matchStatus = !x.status || p.status === x.status

    return matchName && matchStatus
  },
)

const { widths, startResize } = useColumnResize({
  id: 60,
  name: 220,
  taskCount: 120,
  status: 120,
  createdAt: 160,
  actions: 140,
})

const statusOptions = computed(() => [
  { value: '', label: t('table.projects.allStatuses') },
  { value: ProjectStatus.Active, label: t('statusFilter.active') },
  { value: ProjectStatus.Archived, label: t('statusFilter.archived') },
])

const deletingId = ref<number | null>(null)
const archivingId = ref<number | null>(null)
const editingProject = ref<Project | null>(null)

async function confirmDelete(e: MouseEvent, id: number) {
  e.stopPropagation()
  const ok = await confirm({
    title: t('confirm.deleteTitle'),
    message: t('confirm.deleteMsg'),
    danger: true,
  })

  if (!ok) {
    return
  }

  deletingId.value = id

  try {
    await store.remove(id)
  } finally {
    deletingId.value = null
  }
}

async function toggleArchive(e: MouseEvent, project: Project) {
  e.stopPropagation()
  const isActive = project.status === ProjectStatus.Active

  if (isActive) {
    const ok = await confirm({
      title: t('confirm.archiveTitle'),
      message: t('confirm.archiveMsg'),
    })

    if (!ok) {
      return
    }
  } else {
    const ok = await confirm({
      title: t('confirm.restoreTitle'),
      message: t('confirm.restoreMsg'),
    })

    if (!ok) {
      return
    }
  }
  archivingId.value = project.id

  const newStatus = isActive ? ProjectStatus.Archived : ProjectStatus.Active
  const toastKey = isActive ? 'toast.projectArchived' : 'toast.projectRestored'

  try {
    await store.update(project.id, { status: newStatus }, toastKey)
  } finally {
    archivingId.value = null
  }
}

</script>

<template>
  <div class="proj-table">
    <div class="proj-table__toolbar">
      <div class="proj-table__search-wrap">
        <svg class="proj-table__search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.2"/>
          <path d="M10.5 10.5l3 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        <input
          class="proj-table__search"
          :value="search"
          :placeholder="t('table.projects.search')"
          @input="setSearch(($event.target as HTMLInputElement).value)"
        />
      </div>
      <BaseSelect
        :model-value="extra.status ?? ''"
        :options="statusOptions"
        @update:model-value="setExtra('status', $event)"
      />
    </div>

    <div class="proj-table__wrap">
      <table class="proj-table__table">
        <thead>
          <tr>
            <th
              :style="{ width: widths.id + 'px' }"
              class="proj-table__th proj-table__th--sort"
              @click="toggle('id')"
            >
              {{ t('table.projects.id') }} <span class="proj-table__sort-icon">{{ sortIcon(iconFor('id')) }}</span>
              <span
                class="proj-table__resizer"
                @mousedown.stop="startResize('id', $event)"
              />
            </th>
            <th
              :style="{ width: widths.name + 'px' }"
              class="proj-table__th proj-table__th--sort"
              @click="toggle('name')"
            >
              {{ t('table.projects.name') }} <span class="proj-table__sort-icon">{{ sortIcon(iconFor('name')) }}</span>
              <span
                class="proj-table__resizer"
                @mousedown.stop="startResize('name', $event)"
              />
            </th>
            <th
              :style="{ width: widths.taskCount + 'px' }"
              class="proj-table__th proj-table__th--sort proj-table__th--num"
              @click="toggle('taskCount')"
            >
              {{ t('table.projects.tasks') }} <span class="proj-table__sort-icon">{{ sortIcon(iconFor('taskCount')) }}</span>
              <span
                class="proj-table__resizer"
                @mousedown.stop="startResize('taskCount', $event)"
              />
            </th>
            <th
              :style="{ width: widths.status + 'px' }"
              class="proj-table__th proj-table__th--sort"
              @click="toggle('status')"
            >
              {{ t('table.projects.status') }} <span class="proj-table__sort-icon">{{ sortIcon(iconFor('status')) }}</span>
              <span
                class="proj-table__resizer"
                @mousedown.stop="startResize('status', $event)"
              />
            </th>
            <th
              :style="{ width: widths.createdAt + 'px' }"
              class="proj-table__th proj-table__th--sort"
              @click="toggle('createdAt')"
            >
              {{ t('table.projects.created') }} <span class="proj-table__sort-icon">{{ sortIcon(iconFor('createdAt')) }}</span>
              <span
                class="proj-table__resizer"
                @mousedown.stop="startResize('createdAt', $event)"
              />
            </th>
            <th :style="{ width: widths.actions + 'px' }" class="proj-table__th" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in filtered"
            :key="p.id"
            class="proj-table__row"
            @click="router.push({ name: 'project', params: { id: p.id } })"
          >
            <td class="proj-table__td tnum proj-table__td--muted">{{ p.id }}</td>
            <td class="proj-table__td proj-table__td--name">{{ p.name }}</td>
            <td class="proj-table__td tnum proj-table__td--center">{{ p.taskCount }}</td>
            <td class="proj-table__td"><StatusPill :status="p.status" /></td>
            <td class="proj-table__td proj-table__td--muted tnum">{{ formatDate(p.createdAt) }}</td>
            <td class="proj-table__td proj-table__td--actions" @click.stop>
              <div class="proj-table__actions-wrap">
                <BaseButton
                  variant="ghost"
                  size="sm"
                  @click="editingProject = p"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M8.5 1.5a1.414 1.414 0 0 1 2 2L3.5 10.5l-3 .5.5-3 7.5-7Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="sm"
                  :loading="archivingId === p.id"
                  :title="p.status === 'active' ? t('table.projects.archive') : t('table.projects.restore')"
                  @click="toggleArchive($event, p)"
                >
                  <svg v-if="p.status === 'active'" width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <rect x="1" y="4" width="11" height="8" rx="1" stroke="currentColor" stroke-width="1.2"/>
                    <path d="M1 4l1.5-3h8L12 4" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
                    <path d="M4.5 8h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                  </svg>
                  <svg v-else width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <rect x="1" y="4" width="11" height="8" rx="1" stroke="currentColor" stroke-width="1.2"/>
                    <path d="M1 4l1.5-3h8L12 4" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
                    <path d="M6.5 10V6m0 0L4.5 8m2-2l2 2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </BaseButton>
                <BaseButton
                  variant="danger"
                  size="sm"
                  :loading="deletingId === p.id"
                  @click="confirmDelete($event, p.id)"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 3h10M4 3V2h4v1M2 3l.5 7h7L10 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </BaseButton>
              </div>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td colspan="6" class="proj-table__empty">{{ t('table.projects.empty') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <BaseModal
    :model-value="editingProject !== null"
    :title="t('project.editProject')"
    @update:model-value="editingProject = null"
  >
    <ProjectForm
      v-if="editingProject"
      :key="editingProject.id"
      :project="editingProject"
      @close="editingProject = null"
    />
  </BaseModal>
</template>

<style scoped lang="scss">
.proj-table {
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
    max-width: 320px;
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

    &--num {
      text-align: center;
    }
  }

  &__sort-icon {
    color: var(--color-steel);
    margin-left: 4px;
    font-size: 10px;
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
    cursor: pointer;
    transition: background var(--transition-fast);

    &:hover .proj-table__td {
      background: rgba(255, 255, 255, 0.02);
    }

    &:not(:last-child) .proj-table__td {
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
      color: var(--color-ash);
    }

    &--name {
      font-weight: var(--font-weight-medium);
    }

    &--center {
      text-align: center;
    }

    &--actions {
      padding: var(--spacing-8);
    }
  }

  &__actions-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  &__empty {
    padding: var(--spacing-40);
    text-align: center;
    color: var(--color-ash);
  }
}
</style>
