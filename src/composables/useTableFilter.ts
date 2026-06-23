import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { readLS, writeLS } from '@/utils/storage'

const FILTER_STORAGE_KEY = 'slash_filter_'

export function useTableFilter<T>(
  source: Ref<T[]>,
  storageKey: string,
  predicate: (item: T, search: string, extra: Record<string, string>) => boolean,
) {
  const saved = readLS<{ search: string; extra: Record<string, string> }>(
    FILTER_STORAGE_KEY + storageKey,
    { search: '', extra: {} },
  )
  const search = ref(saved.search)
  const extra = ref<Record<string, string>>(saved.extra)

  function persist(): void {
    writeLS(FILTER_STORAGE_KEY + storageKey, { search: search.value, extra: extra.value })
  }

  function setSearch(v: string): void {
    search.value = v
    persist()
  }

  function setExtra(key: string, v: string): void {
    extra.value = { ...extra.value, [key]: v }
    persist()
  }

  function reset(): void {
    search.value = ''
    extra.value = {}
    persist()
  }

  const filtered = computed(() =>
    source.value.filter((item) => predicate(item, search.value, extra.value)),
  )

  return {
    search,
    extra,
    filtered,
    setSearch,
    setExtra,
    reset,
  }
}
