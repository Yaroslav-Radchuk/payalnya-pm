<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfirmState } from '@/composables/useConfirm'
import BaseButton from '@/components/common/BaseButton.vue'

const state = useConfirmState()
const { t } = useI18n()

function answer(v: boolean) {
  state.value.resolve?.(v)
  state.value.visible = false
}

function onKey(e: KeyboardEvent) {
  if (!state.value.visible) {
    return
  }

  if (e.key === 'Escape') {
    answer(false)
  }
  
  if (e.key === 'Enter') {
    answer(true)
  }
}

onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="state.visible"
        class="confirm-backdrop"
        role="dialog"
        aria-modal="true"
        @mousedown.self="answer(false)"
      >
        <div class="confirm">
          <div :class="['confirm__icon', { 'confirm__icon--danger': state.danger }]">
            <svg v-if="state.danger" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 11v4M14 11v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="7" width="20" height="15" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M2 7l2.5-5h15L22 7" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M9 14h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>

          <h2 class="confirm__title">{{ state.title }}</h2>
          <p class="confirm__message">{{ state.message }}</p>

          <div class="confirm__actions">
            <BaseButton variant="ghost" @click="answer(false)">
              {{ t('confirm.cancel') }}
            </BaseButton>
            <BaseButton :variant="state.danger ? 'danger' : 'filled'" @click="answer(true)">
              {{ t('confirm.ok') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.confirm-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 600;
  padding: var(--spacing-24);
}

.confirm {
  background: var(--color-slate);
  border: 1px solid var(--color-iron);
  border-radius: var(--radius-cards);
  padding: var(--spacing-40) var(--spacing-32) var(--spacing-32);
  width: 100%;
  max-width: 380px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &__icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(204, 145, 102, 0.1);
    border: 1px solid rgba(204, 145, 102, 0.2);
    color: var(--color-ember-gold);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--spacing-24);

    &--danger {
      background: rgba(224, 82, 82, 0.1);
      border-color: rgba(224, 82, 82, 0.2);
      color: #e05252;
    }
  }

  &__title {
    font-family: var(--font-ivy-presto);
    font-size: var(--text-heading-sm);
    font-weight: 400;
    color: var(--color-paper);
    margin-bottom: var(--spacing-10);
    letter-spacing: var(--tracking-heading-sm);
  }

  &__message {
    font-size: var(--text-body-lg);
    color: var(--color-ash);
    line-height: var(--leading-body-lg);
    max-width: 280px;
    margin-bottom: var(--spacing-32);
  }

  &__actions {
    display: flex;
    gap: var(--spacing-12);
    width: 100%;
    padding-top: var(--spacing-24);
    border-top: 1px solid var(--color-iron);
    justify-content: center;
  }
}
</style>
