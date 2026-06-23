<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

interface Props {
  title: string
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [v: boolean] }>()

function close() {
  emit('update:modelValue', false)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="modal"
        role="dialog"
        aria-modal="true"
        @mousedown.self="close"
      >
        <div class="modal__box">
          <div class="modal__header">
            <h2 class="modal__title">{{ title }}</h2>
            <button
              class="modal__close"
              aria-label="Close"
              @click="close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
          </div>
          <div class="modal__body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  padding: var(--spacing-24);

  &__box {
    background: var(--color-slate);
    border: 1px solid var(--color-iron);
    border-radius: var(--radius-cards);
    width: 100%;
    max-width: 520px;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.7);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-24) var(--spacing-32);
    border-bottom: 1px solid var(--color-iron);
  }

  &__title {
    font-size: var(--text-heading-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-paper);
    letter-spacing: var(--tracking-heading-sm);
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: transparent;
    border: 1px solid var(--color-iron);
    border-radius: var(--radius-sm);
    color: var(--color-silver);
    transition: border-color var(--transition-fast), color var(--transition-fast);

    &:hover {
      border-color: var(--color-ash);
      color: var(--color-bone);
    }
  }

  &__body {
    padding: var(--spacing-32);
  }
}
</style>
