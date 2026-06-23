<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ProjectStatus, TaskStatus } from '@/types'

interface Props {
  status: ProjectStatus | TaskStatus
}

const props = defineProps<Props>()
const { t } = useI18n()

const label = computed(() => t(`status.${props.status}`))
const mod = computed(() => props.status.replace('_', '-'))
</script>

<template>
  <span :class="['pill', `pill--${mod}`]">{{ label }}</span>
</template>

<style scoped lang="scss">
.pill {
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-full);
  padding: 2px var(--spacing-10);
  font-size: var(--text-caption);
  font-weight: var(--font-weight-medium);
  border: 1px solid;
  white-space: nowrap;

  &--active {
    color: var(--color-ember-gold);
    border-color: var(--color-ember-gold);
  }

  &--archived {
    color: var(--color-ash);
    border-color: var(--color-ash);
  }

  &--todo {
    color: var(--color-silver);
    border-color: var(--color-steel);
  }

  &--in-progress {
    color: var(--color-ember-gold);
    border-color: var(--color-ember-gold);
  }

  &--done {
    color: var(--color-pearl);
    border-color: var(--color-iron);
  }
}
</style>
