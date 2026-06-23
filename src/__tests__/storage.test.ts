import { describe, it, expect, beforeEach } from 'vitest'
import { readLS, writeLS } from '@/utils/storage'

describe('readLS', () => {
  beforeEach(() => localStorage.clear())

  it('returns fallback when key missing', () => {
    expect(readLS('missing', [])).toEqual([])
  })

  it('parses stored JSON', () => {
    localStorage.setItem('key', JSON.stringify({ x: 1 }))
    expect(readLS('key', {})).toEqual({ x: 1 })
  })

  it('returns fallback on corrupt data', () => {
    localStorage.setItem('key', 'not-json')
    expect(readLS('key', 'fallback')).toBe('fallback')
  })
})

describe('writeLS', () => {
  beforeEach(() => localStorage.clear())

  it('serializes value to localStorage', () => {
    writeLS('key', { a: 1 })
    expect(localStorage.getItem('key')).toBe('{"a":1}')
  })
})
