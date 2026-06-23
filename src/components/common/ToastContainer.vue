<script setup lang="ts">
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()
</script>

<template>
  <div class="toast-container" aria-live="polite">
    <TransitionGroup
      name="toast"
      tag="div"
      class="toast-list"
    >
      <div
        v-for="item in toast.items"
        :key="item.id"
        :class="['toast', `toast--${item.type}`]"
        @click="toast.remove(item.id)"
      >
        <span class="toast__icon">
          <svg v-if="item.type === 'success'" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7l3.5 3.5L12 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else-if="item.type === 'error'" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 3v4.5M7 10.5h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7 5v3M7 9.5h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="toast__msg">{{ item.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.toast-container {
  position: fixed;
  top: calc(var(--nav-height) + var(--spacing-16));
  right: var(--spacing-24);
  z-index: 1000;
  pointer-events: none;
}

.toast-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--spacing-10);
  background: var(--color-slate);
  border: 1px solid var(--color-iron);
  border-radius: var(--radius-cards);
  padding: var(--spacing-12) var(--spacing-16);
  font-size: var(--text-caption);
  font-weight: var(--font-weight-medium);
  color: var(--color-bone);
  pointer-events: all;
  cursor: pointer;
  min-width: 240px;
  max-width: 360px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);

  &--success .toast__icon {
    color: var(--color-ember-gold);
  }

  &--error .toast__icon {
    color: #e05252;
  }

  &--info .toast__icon {
    color: var(--color-silver);
  }
}
</style>
