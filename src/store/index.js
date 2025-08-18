import { configureStore } from '@reduxjs/toolkit';
import { LS_KEYS } from "@/lib/helpers";
import favoritesSlice from './favoritesSlice';
import recipesSlice from './recipesSlice';

const store = configureStore({
  reducer: { favorites: favoritesSlice, recipes: recipesSlice },
});

// Persist favorites -> localStorage
store.subscribe(() => {
  const state = store.getState();
  try {
    localStorage.setItem(LS_KEYS.favorites, JSON.stringify(state.favorites));
  } catch (e) {
    // ignore
  }
});

export default store;
