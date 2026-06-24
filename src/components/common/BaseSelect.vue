<script setup lang="ts">
interface Option {
  value: string
  label: string
}

interface Props {
  modelValue: string
  options: Option[]
  placeholder?: string
  label?: string
  error?: string
  id?: string
  required?: boolean
  ariaLabel?: string
}

defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()
</script>

<template>
  <div class="field">
    <label
      v-if="label"
      :for="id"
      class="field__label"
    >
      {{ label }}<span v-if="required" class="field__req">*</span>
    </label>
    <div class="field__wrap">
      <select
        :id="id"
        :value="modelValue"
        :aria-label="ariaLabel"
        :class="['field__select', { 'field__select--error': error }]"
        @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        @blur="emit('blur')"
      >
        <option
          v-if="placeholder"
          value=""
          disabled
          class="field__option"
        >{{ placeholder }}</option>
        <option
          v-for="opt in options"
          :key="opt.value"
          :value="opt.value"
          class="field__option"
        >{{ opt.label }}</option>
      </select>
      <span class="field__arrow">
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>
    </div>
    <span v-if="error" class="field__error">{{ error }}</span>
  </div>
</template>

<style scoped lang="scss">
.field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);

  &__label {
    font-size: var(--text-caption);
    font-weight: var(--font-weight-medium);
    color: var(--color-silver);
    letter-spacing: 0.01px;
    text-transform: uppercase;
  }

  &__req {
    color: var(--color-ember-gold);
    margin-left: 2px;
  }

  &__wrap {
    position: relative;
  }

  &__select {
    appearance: none;
    background: var(--color-graphite);
    border: 1px solid var(--color-fog);
    border-radius: var(--radius-inputs);
    color: var(--color-bone);
    font-family: var(--font-inter);
    font-size: var(--text-body-lg);
    padding: var(--spacing-14) var(--spacing-40) var(--spacing-14) var(--spacing-20);
    outline: none;
    transition: border-color var(--transition-fast);
    width: 100%;
    cursor: pointer;

    &:focus {
      border-color: var(--color-silver);
    }

    &--error {
      border-color: #e05252;
    }

    &__option {
      background: var(--color-graphite);
    }
  }

  &__arrow {
    pointer-events: none;
    position: absolute;
    right: var(--spacing-14);
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-ash);
  }

  &__error {
    font-size: var(--text-caption);
    color: #e05252;
    line-height: var(--leading-caption);
  }
}
</style>
