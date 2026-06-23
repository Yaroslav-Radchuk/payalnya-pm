import { describe, it, expect } from 'vitest'
import { formatDate, formatDateShort } from '@/utils/format'

describe('formatDate', () => {
  it('formats ISO datetime string', () => {
    expect(formatDate('2026-03-10T09:00:00Z')).toMatch(/10\.03\.2026/)
  })

  it('formats date-only string without timezone shift', () => {
    expect(formatDate('2026-07-15')).toMatch(/15\.07\.2026/)
  })
})

describe('formatDateShort', () => {
  it('returns day and month only', () => {
    const result = formatDateShort('2026-07-15')
    expect(result).toMatch(/15\.07/)
    expect(result).not.toMatch(/2026/)
  })
})
