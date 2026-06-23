import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { SortState, SortDirection } from '@/types'

export function useTableSort<T>(source: Ref<T[]>) {
  const sort = ref<SortState<T>>({ key: null, direction: 'asc' }) as Ref<SortState<T>>

  function toggle(key: keyof T): void {
    if (sort.value.key === key) {
      sort.value.direction = sort.value.direction === 'asc' ? 'desc' : 'asc'
    } else {
      sort.value = { key, direction: 'asc' }
    }
  }

  const sorted = computed<T[]>(() => {
    const { key, direction } = sort.value

    if (!key) {
      return [...source.value]
    }
    return [...source.value].sort((a, b) => {
      const av = a[key]
      const bv = b[key]
      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return direction === 'asc' ? cmp : -cmp
    })
  })

  function iconFor(key: keyof T): SortDirection | null {
    return sort.value.key === key ? sort.value.direction : null
  }

  function sortIcon(dir: SortDirection | null): string {
    if (!dir) {
      return '↕'
    }
    return dir === 'asc' ? '↑' : '↓'
  }

  return {
    sort,
    toggle,
    sorted,
    iconFor,
    sortIcon,
  }
}
