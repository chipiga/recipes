import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';
import favorites from './favoritesSlice';
import recipes from './recipesSlice';

const store = configureStore({
  reducer: { favorites, recipes, auth },
});

export default store;
