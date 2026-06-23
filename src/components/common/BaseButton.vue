<script setup lang="ts">
interface Props {
  variant?: 'filled' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<Props>(), {
  variant: 'filled',
  size: 'md',
  type: 'button',
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="['btn', `btn--${variant}`, `btn--${size}`, { 'btn--loading': loading }]"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<style scoped lang="scss">
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-8);
  border-radius: var(--radius-buttons);
  font-family: var(--font-inter);
  font-weight: var(--font-weight-medium);
  letter-spacing: -0.007em;
  cursor: pointer;
  transition: background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast), opacity var(--transition-fast);
  white-space: nowrap;
  user-select: none;
  border: 1px solid transparent;

  &--md {
    font-size: var(--text-body-lg);
    padding: var(--spacing-10) var(--spacing-20);
  }

  &--sm {
    font-size: var(--text-caption);
    padding: var(--spacing-6) var(--spacing-12);
  }

  &--filled {
    background: var(--color-paper);
    color: var(--color-inkwell);
    border-color: var(--color-paper);

    &:hover:not(:disabled) {
      background: var(--color-bone);
      border-color: var(--color-bone);
    }
  }

  &--ghost {
    background: transparent;
    color: var(--color-bone);
    border-color: var(--color-ash);

    &:hover:not(:disabled) {
      border-color: var(--color-bone);
    }
  }

  &--danger {
    background: transparent;
    color: #e05252;
    border-color: #7a3333;

    &:hover:not(:disabled) {
      border-color: #e05252;
    }
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &--loading {
    pointer-events: none;
  }
}

.btn__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
