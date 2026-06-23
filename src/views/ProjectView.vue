<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTasksStore } from '@/stores/tasks'
import { useProjectsStore } from '@/stores/projects'
import TaskTable from '@/components/tasks/TaskTable.vue'
import TaskKanban from '@/components/tasks/TaskKanban.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseButton from '@/components/common/BaseButton.vue'

type ViewMode = 'table' | 'kanban'

const route = useRoute()
const router = useRouter()
const tasksStore = useTasksStore()
const projectsStore = useProjectsStore()
const { t } = useI18n()

const projectId = computed(() => Number(route.params.id))
const project = computed(() => projectsStore.items.find((p) => p.id === projectId.value))

const VIEW_KEY = `slash_view_${projectId.value}`
const viewMode = ref<ViewMode>((localStorage.getItem(VIEW_KEY) as ViewMode) ?? 'table')
watch(viewMode, (v) => localStorage.setItem(VIEW_KEY, v))

const showCreate = ref(false)

onMounted(async () => {
  if (!projectsStore.items.length) {
    await projectsStore.fetchAll()
  }
  await tasksStore.fetchByProject(projectId.value)
})
</script>

<template>
  <div class="project-view">
    <nav class="project-view__breadcrumb">
      <button class="project-view__back" @click="router.push({ name: 'home' })">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ t('project.backTo') }}
      </button>
      <span class="project-view__sep">/</span>
      <span class="project-view__current">{{ project?.name ?? '—' }}</span>
    </nav>

    <div class="project-view__header">
      <div>
        <h1 class="project-view__title">
          <em class="project-view__title-em">{{ project?.name }}</em>
        </h1>
        <p v-if="project?.description" class="project-view__desc">{{ project.description }}</p>
      </div>

      <div class="project-view__actions">
        <div class="project-view__toggle" role="group">
          <button
            :class="['project-view__toggle-btn', { 'project-view__toggle-btn--active': viewMode === 'table' }]"
            @click="viewMode = 'table'"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/>
              <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/>
              <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/>
              <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/>
            </svg>
            {{ t('project.viewTable') }}
          </button>
          <button
            :class="['project-view__toggle-btn', { 'project-view__toggle-btn--active': viewMode === 'kanban' }]"
            @click="viewMode = 'kanban'"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="3" height="12" rx="1" stroke="currentColor" stroke-width="1.2"/>
              <rect x="5.5" y="1" width="3" height="8" rx="1" stroke="currentColor" stroke-width="1.2"/>
              <rect x="10" y="1" width="3" height="10" rx="1" stroke="currentColor" stroke-width="1.2"/>
            </svg>
            {{ t('project.viewKanban') }}
          </button>
        </div>
        <BaseButton variant="filled" @click="showCreate = true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          {{ t('project.addTask') }}
        </BaseButton>
      </div>
    </div>

    <div v-if="tasksStore.loading" class="project-view__loading">
      <div v-for="i in 5" :key="i" class="skeleton" style="height:48px;border-radius:4px;margin-bottom:8px;" />
    </div>
    <template v-else>
      <Transition name="view-fade" mode="out-in">
        <TaskTable v-if="viewMode === 'table'" :tasks="tasksStore.items" />
        <TaskKanban v-else :tasks="tasksStore.items" />
      </Transition>
    </template>

    <BaseModal v-model="showCreate" :title="t('project.newTask')">
      <TaskForm :project-id="projectId" @close="showCreate = false" />
    </BaseModal>
  </div>
</template>

<style scoped lang="scss">
.project-view {
  padding-block: var(--spacing-32) var(--spacing-40);

  &__breadcrumb {
    display: flex;
    align-items: center;
    gap: var(--spacing-8);
    margin-bottom: var(--spacing-32);
    font-size: var(--text-caption);
    color: var(--color-ash);
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: transparent;
    border: none;
    color: var(--color-silver);
    font-size: var(--text-caption);
    font-family: var(--font-inter);
    cursor: pointer;
    transition: color var(--transition-fast);
    padding: 0;

    &:hover {
      color: var(--color-bone);
    }
  }

  &__sep {
    color: var(--color-iron);
  }

  &__current {
    color: var(--color-pearl);
    font-weight: var(--font-weight-medium);
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-24);
    margin-bottom: var(--spacing-32);
    flex-wrap: wrap;
  }

  &__title {
    font-family: var(--font-ivy-presto);
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 400;
    color: var(--color-paper);
    margin-bottom: var(--spacing-8);
    line-height: 1.1;
  }

  &__title-em {
    font-style: italic;
    color: var(--color-ember-gold);
  }

  &__desc {
    font-size: var(--text-body-lg);
    color: var(--color-ash);
    max-width: 480px;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-12);
    flex-wrap: wrap;
  }

  &__toggle {
    display: flex;
    background: var(--color-graphite);
    border: 1px solid var(--color-iron);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  &__toggle-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-6);
    background: transparent;
    border: none;
    color: var(--color-silver);
    font-family: var(--font-inter);
    font-size: var(--text-caption);
    font-weight: var(--font-weight-medium);
    padding: var(--spacing-8) var(--spacing-14);
    cursor: pointer;
    transition: background var(--transition-fast), color var(--transition-fast);

    &--active {
      background: var(--color-slate);
      color: var(--color-bone);
    }

    &:hover:not(&--active) {
      background: var(--color-slate);
      color: var(--color-pearl);
    }
  }

  &__loading {
    padding: var(--spacing-8);
  }
}
</style>
