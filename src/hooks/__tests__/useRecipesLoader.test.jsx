import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import useRecipesLoader from '../useRecipesLoader'

// Mock fetch
global.fetch = vi.fn()

// Mock nanoid
vi.mock('nanoid', () => ({
  nanoid: () => 'mock-id-123',
}))

// Mock console methods
const consoleSpy = {
  log: vi.spyOn(console, 'log').mockImplementation(() => {}),
  error: vi.spyOn(console, 'error').mockImplementation(() => {}),
}

// Mock Redux hooks
vi.mock('react-redux', () => {
  const mockUseSelector = vi.fn()
  const mockDispatch = vi.fn()
  
  return {
    useDispatch: () => mockDispatch,
    useSelector: mockUseSelector,
    __mockUseSelector: mockUseSelector,
    __mockDispatch: mockDispatch,
  }
})

describe('useRecipesLoader', () => {
  let mockUseSelector
  let mockDispatch

  beforeEach(() => {
    vi.clearAllMocks()
    fetch.mockClear()
    
    // Get the mock functions from the mocked module
    const { __mockUseSelector, __mockDispatch } = require('react-redux')
    mockUseSelector = __mockUseSelector
    mockDispatch = __mockDispatch
  })

  afterEach(() => {
    consoleSpy.log.mockClear()
    consoleSpy.error.mockClear()
  })

  // TODO: Fix Redux mocking issues
  it.skip('should not fetch recipes when recipes already exist', async () => {
    mockUseSelector.mockReturnValue([
      { id: '1', title: 'Existing Recipe', category: 'Test', ingredients: [], instructions: '' }
    ])

    renderHook(() => useRecipesLoader())

    // Wait a bit to ensure the effect has run
    await new Promise(resolve => setTimeout(resolve, 100))
    
    expect(fetch).not.toHaveBeenCalled()
  })

  it.skip('should fetch recipes when store is empty', async () => {
    mockUseSelector.mockReturnValue([])
    
    const mockRecipes = [
      { title: 'Recipe 1', category: 'Dessert', ingredients: ['sugar'], instructions: 'Mix' },
      { title: 'Recipe 2', category: 'Main', ingredients: ['meat'], instructions: 'Cook' }
    ]

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRecipes,
    })

    renderHook(() => useRecipesLoader())

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/recipes.json', { cache: 'no-store' })
    })

    await waitFor(() => {
      expect(consoleSpy.log).toHaveBeenCalledWith([
        { id: 'mock-id-123', title: 'Recipe 1', category: 'Dessert', ingredients: ['sugar'], instructions: 'Mix', image: undefined },
        { id: 'mock-id-123', title: 'Recipe 2', category: 'Main', ingredients: ['meat'], instructions: 'Cook', image: undefined }
      ])
    })
  })

  it.skip('should handle fetch error gracefully', async () => {
    mockUseSelector.mockReturnValue([])
    
    fetch.mockRejectedValueOnce(new Error('Network error'))

    renderHook(() => useRecipesLoader())

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/recipes.json', { cache: 'no-store' })
    })

    await waitFor(() => {
      expect(consoleSpy.error).toHaveBeenCalledWith(new Error('Network error'))
    })
  })

  it.skip('should handle non-ok response', async () => {
    mockUseSelector.mockReturnValue([])
    
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    })

    renderHook(() => useRecipesLoader())

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/recipes.json', { cache: 'no-store' })
    })

    await waitFor(() => {
      expect(consoleSpy.error).toHaveBeenCalledWith(Error('404'))
    })
  })

  it.skip('should normalize recipes with missing fields', async () => {
    mockUseSelector.mockReturnValue([])
    
    const mockRecipes = [
      { title: 'Recipe 1' }, // Missing most fields
      { id: 'custom-id', title: 'Recipe 2', category: 'Custom' }, // Has custom ID
    ]

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRecipes,
    })

    renderHook(() => useRecipesLoader())

    await waitFor(() => {
      expect(consoleSpy.log).toHaveBeenCalledWith([
        { id: 'mock-id-123', title: 'Recipe 1', category: 'Sonstiges', ingredients: [], instructions: '', image: undefined },
        { id: 'custom-id', title: 'Recipe 2', category: 'Custom', ingredients: [], instructions: '', image: undefined }
      ])
    })
  })

  it.skip('should handle non-array response', async () => {
    mockUseSelector.mockReturnValue([])
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => 'not-an-array',
    })

    renderHook(() => useRecipesLoader())

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/recipes.json', { cache: 'no-store' })
    })

    await waitFor(() => {
      expect(consoleSpy.log).toHaveBeenCalledWith([])
    })
  })

  it.skip('should handle null response', async () => {
    mockUseSelector.mockReturnValue([])
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => null,
    })

    renderHook(() => useRecipesLoader())

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/recipes.json', { cache: 'no-store' })
    })

    await waitFor(() => {
      expect(consoleSpy.log).toHaveBeenCalledWith([])
    })
  })

  it.skip('should preserve existing recipe IDs when provided', async () => {
    mockUseSelector.mockReturnValue([])
    
    const mockRecipes = [
      { id: 'existing-id-1', title: 'Recipe 1', category: 'Test', ingredients: [], instructions: '' },
      { title: 'Recipe 2', category: 'Test', ingredients: [], instructions: '' }
    ]

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRecipes,
    })

    renderHook(() => useRecipesLoader())

    await waitFor(() => {
      expect(consoleSpy.log).toHaveBeenCalledWith([
        { id: 'existing-id-1', title: 'Recipe 1', category: 'Test', ingredients: [], instructions: '', image: undefined },
        { id: 'mock-id-123', title: 'Recipe 2', category: 'Test', ingredients: [], instructions: '', image: undefined }
      ])
    })
  })

  it.skip('should handle empty array response', async () => {
    mockUseSelector.mockReturnValue([])
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    renderHook(() => useRecipesLoader())

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/recipes.json', { cache: 'no-store' })
    })

    await waitFor(() => {
      expect(consoleSpy.log).toHaveBeenCalledWith([])
    })
  })
})
