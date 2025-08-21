import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import favoritesReducer, {
  toggleFavorite,
  setFavorites,
  fetchFavoritesFromFirebase,
  saveFavoritesToFirebase,
  toggleFavoriteAndSync,
  setFavoritesAndSync
} from '../favoritesSlice'

// Mock Firebase
vi.mock('@/firebase', () => ({
  db: {},
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
})

describe('favoritesSlice', () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: {
        favorites: favoritesReducer,
        auth: {
          reducer: (state = { user: null }, action) => state,
          getInitialState: () => ({ user: null }),
        },
      },
    })
    localStorageMock.getItem.mockReturnValue('[]')
    localStorageMock.setItem.mockClear()
    localStorageMock.getItem.mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('reducers', () => {
    it('should handle initial state', () => {
      const state = store.getState().favorites
      expect(state).toEqual([])
    })

    it('should handle toggleFavorite - adding new favorite', () => {
      store.dispatch(toggleFavorite('recipe-1'))
      
      const state = store.getState().favorites
      expect(state).toEqual(['recipe-1'])
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'recipeApp:favorites',
        '["recipe-1"]'
      )
    })

    it('should handle toggleFavorite - removing existing favorite', () => {
      // First add a favorite
      store.dispatch(toggleFavorite('recipe-1'))
      // Then remove it
      store.dispatch(toggleFavorite('recipe-1'))
      
      const state = store.getState().favorites
      expect(state).toEqual([])
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'recipeApp:favorites',
        '[]'
      )
    })

    it('should handle setFavorites', () => {
      const newFavorites = ['recipe-1', 'recipe-2', 'recipe-3']
      store.dispatch(setFavorites(newFavorites))
      
      const state = store.getState().favorites
      expect(state).toEqual(newFavorites)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'recipeApp:favorites',
        JSON.stringify(newFavorites)
      )
    })

    it('should deduplicate favorites when setting', () => {
      const duplicates = ['recipe-1', 'recipe-2', 'recipe-1', 'recipe-3', 'recipe-2']
      store.dispatch(setFavorites(duplicates))
      
      const state = store.getState().favorites
      expect(state).toEqual(['recipe-1', 'recipe-2', 'recipe-3'])
    })

    it('should handle empty array in setFavorites', () => {
      store.dispatch(setFavorites([]))
      
      const state = store.getState().favorites
      expect(state).toEqual([])
    })

    it('should handle undefined in setFavorites', () => {
      store.dispatch(setFavorites(undefined))
      
      const state = store.getState().favorites
      expect(state).toEqual([])
    })
  })

  describe('localStorage integration', () => {
    // TODO: Fix localStorage mocking issues
    it.skip('should load initial state from localStorage', () => {
      const storedFavorites = ['recipe-1', 'recipe-2']
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedFavorites))
      
      // Create a new store after mocking localStorage
      const newStore = configureStore({
        reducer: {
          favorites: favoritesReducer,
          auth: {
            reducer: (state = { user: null }, action) => state,
            getInitialState: () => ({ user: null }),
          },
        },
      })
      
      const state = newStore.getState().favorites
      expect(state).toEqual(storedFavorites)
    })

    it('should handle localStorage parse error gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json')
      
      const newStore = configureStore({
        reducer: {
          favorites: favoritesReducer,
          auth: {
            reducer: (state = { user: null }, action) => state,
            getInitialState: () => ({ user: null }),
          },
        },
      })
      
      const state = newStore.getState().favorites
      expect(state).toEqual([])
    })

    it('should handle localStorage setItem error gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })
      
      // Should not throw error
      expect(() => {
        store.dispatch(toggleFavorite('recipe-1'))
      }).not.toThrow()
    })
  })

  describe('async thunks', () => {
    it('should handle fetchFavoritesFromFirebase.fulfilled', async () => {
      const remoteFavorites = ['recipe-2', 'recipe-3']
      
      // First add some local favorites
      store.dispatch(toggleFavorite('recipe-1'))
      
      // Mock localStorage to return the current favorites
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['recipe-1']))
      
      // Then fetch from Firebase
      await store.dispatch(fetchFavoritesFromFirebase.fulfilled(remoteFavorites))
      
      const state = store.getState().favorites
      expect(state).toEqual(['recipe-1', 'recipe-2', 'recipe-3'])
    })

    it('should handle fetchFavoritesFromFirebase with empty payload', async () => {
      // Add some local favorites
      store.dispatch(toggleFavorite('recipe-1'))
      
      // Mock localStorage to return the current favorites
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['recipe-1']))
      
      // Fetch empty from Firebase
      await store.dispatch(fetchFavoritesFromFirebase.fulfilled([]))
      
      const state = store.getState().favorites
      expect(state).toEqual(['recipe-1'])
    })

    it('should handle fetchFavoritesFromFirebase with undefined payload', async () => {
      // Add some local favorites
      store.dispatch(toggleFavorite('recipe-1'))
      
      // Mock localStorage to return the current favorites
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['recipe-1']))
      
      // Fetch undefined from Firebase
      await store.dispatch(fetchFavoritesFromFirebase.fulfilled(undefined))
      
      const state = store.getState().favorites
      expect(state).toEqual(['recipe-1'])
    })
  })

  describe('edge cases', () => {
    it('should handle multiple rapid toggles', () => {
      store.dispatch(toggleFavorite('recipe-1'))
      store.dispatch(toggleFavorite('recipe-1'))
      store.dispatch(toggleFavorite('recipe-1'))
      
      const state = store.getState().favorites
      expect(state).toEqual(['recipe-1'])
    })

    it('should handle setting favorites multiple times', () => {
      store.dispatch(setFavorites(['recipe-1', 'recipe-2']))
      store.dispatch(setFavorites(['recipe-3', 'recipe-4']))
      
      const state = store.getState().favorites
      expect(state).toEqual(['recipe-3', 'recipe-4'])
    })
  })
})
