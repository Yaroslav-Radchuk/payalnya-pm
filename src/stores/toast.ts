import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ToastItem } from '@/types'

export const useToastStore = defineStore('toast', () => {
  const items = ref<ToastItem[]>([])

  function add(message: string, type: ToastItem['type'] = 'info'): void {
    const id = `${Date.now()}-${Math.random()}`
    items.value.push({ id, message, type })
    setTimeout(() => remove(id), 3500)
  }

  function success(message: string): void {
    add(message, 'success')
  }

  function error(message: string): void {
    add(message, 'error')
  }

  function info(message: string): void {
    add(message, 'info')
  }

  function remove(id: string): void {
    items.value = items.value.filter((t) => t.id !== id)
  }

  return {
    items,
    success,
    error,
    info,
    remove,
  }
})
