<script setup lang="ts">
import { computed, ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useI18n } from 'vue-i18n'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useTasksStore } from '@/stores/tasks'
import { TaskStatus } from '@/types'

interface Props { projectId: number }

const props = defineProps<Props>()
const emit = defineEmits<{ close: [] }>()
const store = useTasksStore()
const submitting = ref(false)
const { t } = useI18n()

const today = new Date().toISOString().split('T')[0]

const schema = computed(() =>
  toTypedSchema(
    z.object({
      name: z
        .string()
        .min(1, t('taskForm.nameRequired'))
        .min(3, t('taskForm.nameLength'))
        .max(120, t('taskForm.nameLength')),
      status: z.nativeEnum(TaskStatus, { errorMap: () => ({ message: t('taskForm.statusRequired') }) }),
      assignee: z.string().optional(),
      dueDate: z
        .string()
        .min(1, t('taskForm.dateRequired'))
        .refine((d) => d >= today, t('taskForm.datePast')),
    }),
  ),
)

const { handleSubmit, resetForm } = useForm({ validationSchema: schema })

const {
  value: name,
  errorMessage: nameErr,
  handleBlur: blurName,
} = useField<string>('name')

const {
  value: status,
  errorMessage: statusErr,
  handleBlur: blurStatus,
} = useField<string>('status')

const { value: assignee, handleBlur: blurAssignee } = useField<string>('assignee')

const {
  value: dueDate,
  errorMessage: dueDateErr,
  handleBlur: blurDueDate,
} = useField<string>('dueDate')

const statusOptions = computed(() => [
  { value: TaskStatus.Todo, label: t('kanban.todo') },
  { value: TaskStatus.InProgress, label: t('kanban.in_progress') },
  { value: TaskStatus.Done, label: t('kanban.done') },
])

const assigneeOptions = computed(() => [
  { value: '', label: t('taskForm.noAssignee') },
  { value: 'Olena Koval', label: 'Olena Koval' },
  { value: 'Mykola Petrenko', label: 'Mykola Petrenko' },
  { value: 'Daria Shevchenko', label: 'Daria Shevchenko' },
  { value: 'Ivan Bondarenko', label: 'Ivan Bondarenko' },
])

const onSubmit = handleSubmit(async (values) => {
  submitting.value = true
  try {
    await store.create({
      projectId: props.projectId,
      name: values.name,
      status: values.status as TaskStatus,
      assignee: values.assignee || null,
      dueDate: values.dueDate,
    })
    resetForm()
    emit('close')
  } finally {
    submitting.value = false
  }
})
</script>

<template>
  <form class="task-form" @submit.prevent="onSubmit">
    <div class="task-form__fields">
      <BaseInput
        id="task-name"
        v-model="name"
        :label="t('taskForm.name')"
        :placeholder="t('taskForm.namePlaceholder')"
        :error="nameErr"
        required
        @blur="blurName"
      />
      <div class="task-form__row">
        <BaseSelect
          id="task-status"
          v-model="status"
          :options="statusOptions"
          :label="t('taskForm.status')"
          :placeholder="t('taskForm.statusPlaceholder')"
          :error="statusErr"
          required
          @blur="blurStatus"
        />
        <BaseSelect
          id="task-assignee"
          v-model="assignee"
          :options="assigneeOptions"
          :label="t('taskForm.assignee')"
          @blur="blurAssignee"
        />
      </div>
      <BaseInput
        id="task-due"
        v-model="dueDate"
        :label="t('taskForm.dueDate')"
        type="date"
        :error="dueDateErr"
        required
        @blur="blurDueDate"
      />
    </div>
    <div class="task-form__actions">
      <BaseButton variant="ghost" @click="emit('close')">{{ t('taskForm.cancel') }}</BaseButton>
      <BaseButton
        type="submit"
        variant="filled"
        :loading="submitting"
      >{{ t('taskForm.save') }}</BaseButton>
    </div>
  </form>
</template>

<style scoped lang="scss">
.task-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-32);

  &__fields {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-20);
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-16);
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
