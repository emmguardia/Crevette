import { describe, it, expect } from 'vitest'
import { cn } from '../lib/utils'

describe('cn (className helper)', () => {
  it('merges class strings', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('drops conflicts using tailwind-merge semantics', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('handles falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b')
  })

  it('supports conditional objects', () => {
    expect(cn('a', { b: true, c: false })).toBe('a b')
  })
})
