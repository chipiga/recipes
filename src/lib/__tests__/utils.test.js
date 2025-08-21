import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('utils', () => {
  describe('cn function', () => {
    it('should combine multiple class strings', () => {
      const result = cn('text-red-500', 'bg-blue-200', 'p-4')
      expect(result).toBe('text-red-500 bg-blue-200 p-4')
    })

    it('should handle single class string', () => {
      const result = cn('text-center')
      expect(result).toBe('text-center')
    })

    it('should handle empty strings', () => {
      const result = cn('', 'text-bold', '')
      expect(result).toBe('text-bold')
    })

    it('should handle undefined and null values', () => {
      const result = cn(undefined, 'text-red', null, 'bg-blue')
      expect(result).toBe('text-red bg-blue')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const isDisabled = false
      const result = cn(
        'base-class',
        isActive && 'active-class',
        isDisabled && 'disabled-class'
      )
      expect(result).toBe('base-class active-class')
    })

    it('should handle arrays of classes', () => {
      const result = cn(['text-red', 'bg-blue'], 'p-4', ['m-2', 'rounded'])
      expect(result).toBe('text-red bg-blue p-4 m-2 rounded')
    })

    it('should handle objects with boolean values', () => {
      const result = cn({
        'text-red': true,
        'bg-blue': false,
        'p-4': true,
        'm-2': false
      })
      expect(result).toBe('text-red p-4')
    })

    it('should handle mixed input types', () => {
      const isActive = true
      const classes = ['text-red', 'bg-blue']
      const conditional = isActive && 'active'
      
      const result = cn('base', classes, conditional, { 'p-4': true })
      expect(result).toBe('base text-red bg-blue active p-4')
    })

    it('should handle no arguments', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should handle whitespace-only strings', () => {
      const result = cn('  ', 'text-red', '  ')
      expect(result).toBe('text-red')
    })

    it('should handle numbers', () => {
      const result = cn(42, 'text-red', 0)
      expect(result).toBe('42 text-red')
    })
  })
})
