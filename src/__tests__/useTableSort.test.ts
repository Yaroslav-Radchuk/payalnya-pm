import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useTableSort } from '@/composables/useTableSort'

const items = [
  { id: 3, name: 'Charlie' },
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]

describe('useTableSort', () => {
  it('returns items unsorted by default', () => {
    const { sorted } = useTableSort(ref([...items]))
    expect(sorted.value.map((x) => x.id)).toEqual([3, 1, 2])
  })

  it('sorts ascending on first toggle', () => {
    const { sorted, toggle } = useTableSort(ref([...items]))
    toggle('id')
    expect(sorted.value.map((x) => x.id)).toEqual([1, 2, 3])
  })

  it('reverses to descending on second toggle of same key', () => {
    const { sorted, toggle } = useTableSort(ref([...items]))
    toggle('name')
    toggle('name')
    expect(sorted.value.map((x) => x.name)).toEqual(['Charlie', 'Bob', 'Alice'])
  })

  it('resets direction when switching key', () => {
    const { sort, toggle } = useTableSort(ref([...items]))
    toggle('id')
    toggle('id')
    toggle('name')
    expect(sort.value).toEqual({ key: 'name', direction: 'asc' })
  })

  it('sortIcon returns correct symbols', () => {
    const { sortIcon } = useTableSort(ref([...items]))
    expect(sortIcon(null)).toBe('↕')
    expect(sortIcon('asc')).toBe('↑')
    expect(sortIcon('desc')).toBe('↓')
  })
})
