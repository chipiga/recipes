import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';
import favorites from './favoritesSlice';
import recipes from './recipesSlice';

/**
 * Application Redux store with `auth`, `favorites`, and `recipes` slices.
 * @type {import('@reduxjs/toolkit').EnhancedStore}
 */
const store = configureStore({
  reducer: { favorites, recipes, auth },
});

export default store;
