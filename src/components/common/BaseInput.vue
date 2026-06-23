<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  label?: string
  error?: string
  type?: string
  id?: string
  required?: boolean
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
    >{{ label }}<span v-if="required" class="field__req">*</span></label>
    <input
      :id="id"
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :class="['field__input', { 'field__input--error': error }]"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="emit('blur')"
    />
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

  &__input {
    background: var(--color-graphite);
    border: 1px solid var(--color-fog);
    border-radius: var(--radius-inputs);
    color: var(--color-bone);
    font-size: var(--text-body-lg);
    font-weight: var(--font-weight-regular);
    padding: var(--spacing-14) var(--spacing-20);
    outline: none;
    transition: border-color var(--transition-fast);
    width: 100%;

    &::placeholder {
      color: var(--color-ash);
    }

    &:focus {
      border-color: var(--color-silver);
    }

    &--error {
      border-color: #e05252;
    }
  }

  &__error {
    font-size: var(--text-caption);
    color: #e05252;
    line-height: var(--leading-caption);
  }
}
</style>
