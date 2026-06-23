import { describe, it, expect, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useTableFilter } from '@/composables/useTableFilter'

const items = [
  { name: 'Alpha Launch', status: 'active' },
  { name: 'Brand Refresh', status: 'active' },
  { name: 'Legacy Migration', status: 'archived' },
]

describe('useTableFilter', () => {
  beforeEach(() => localStorage.clear())

  const predicate = (item: typeof items[0], s: string, x: Record<string, string>) => {
    const matchName = item.name.toLowerCase().includes(s.toLowerCase())
    const matchStatus = !x.status || item.status === x.status
    return matchName && matchStatus
  }

  it('returns all items with empty search', () => {
    const { filtered } = useTableFilter(ref(items), 'test', predicate)
    expect(filtered.value).toHaveLength(3)
  })

  it('filters by search string', () => {
    const { filtered, setSearch } = useTableFilter(ref(items), 'test', predicate)
    setSearch('alpha')
    expect(filtered.value).toHaveLength(1)
    expect(filtered.value[0].name).toBe('Alpha Launch')
  })

  it('filters by extra field', () => {
    const { filtered, setExtra } = useTableFilter(ref(items), 'test', predicate)
    setExtra('status', 'archived')
    expect(filtered.value).toHaveLength(1)
    expect(filtered.value[0].status).toBe('archived')
  })

  it('persists filter state to localStorage', () => {
    const { setSearch, setExtra } = useTableFilter(ref(items), 'persist-test', predicate)
    setSearch('brand')
    setExtra('status', 'active')
    const saved = JSON.parse(localStorage.getItem('slash_filter_persist-test') ?? '{}')
    expect(saved.search).toBe('brand')
    expect(saved.extra.status).toBe('active')
  })

  it('restores saved filter from localStorage on init', () => {
    localStorage.setItem('slash_filter_restore-test', JSON.stringify({ search: 'leg', extra: {} }))
    const { filtered } = useTableFilter(ref(items), 'restore-test', predicate)
    expect(filtered.value).toHaveLength(1)
    expect(filtered.value[0].name).toBe('Legacy Migration')
  })
})
