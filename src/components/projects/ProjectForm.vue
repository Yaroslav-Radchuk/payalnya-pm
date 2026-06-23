<script setup lang="ts">
import { computed, ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useI18n } from 'vue-i18n'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useProjectsStore } from '@/stores/projects'

const emit = defineEmits<{ close: [] }>()
const store = useProjectsStore()
const submitting = ref(false)
const { t } = useI18n()

const schema = computed(() =>
  toTypedSchema(
    z.object({
      name: z.string().min(2, t('projectForm.nameLength')).max(100, t('projectForm.nameLength')),
      description: z.string().optional(),
    }),
  ),
)

const { handleSubmit } = useForm({ validationSchema: schema })

const {
  value: name,
  errorMessage: nameErr,
  handleBlur: blurName,
} = useField<string>('name')

const { value: description, handleBlur: blurDesc } = useField<string>('description')

const onSubmit = handleSubmit(async (values) => {
  submitting.value = true
  try {
    await store.create({ name: values.name, description: values.description })
    emit('close')
  } finally {
    submitting.value = false
  }
})
</script>

<template>
  <form class="project-form" @submit.prevent="onSubmit">
    <div class="project-form__fields">
      <BaseInput
        id="proj-name"
        v-model="name"
        :label="t('projectForm.name')"
        :placeholder="t('projectForm.namePlaceholder')"
        :error="nameErr"
        required
        @blur="blurName"
      />
      <BaseInput
        id="proj-desc"
        v-model="description"
        :label="t('projectForm.description')"
        :placeholder="t('projectForm.descPlaceholder')"
        @blur="blurDesc"
      />
    </div>
    <div class="project-form__actions">
      <BaseButton variant="ghost" @click="emit('close')">{{ t('projectForm.cancel') }}</BaseButton>
      <BaseButton
        type="submit"
        variant="filled"
        :loading="submitting"
      >{{ t('projectForm.save') }}</BaseButton>
    </div>
  </form>
</template>

<style scoped lang="scss">
.project-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-32);

  &__fields {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-20);
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-12);
    padding-top: var(--spacing-8);
    border-top: 1px solid var(--color-iron);
  }
}
</style>
