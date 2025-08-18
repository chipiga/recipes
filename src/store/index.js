import { configureStore } from '@reduxjs/toolkit';

import favoritesSlice from './favorites-slice';
import recipesSlice from './recipies-slice';

const store = configureStore({
  reducer: { favorites: favoritesSlice, recipes: recipesSlice },
});

// Persist favorites -> localStorage
// store.subscribe(() => {
//   const state = store.getState();
//   try {
//     localStorage.setItem(LS_KEYS.favorites, JSON.stringify(state.favorites));
//   } catch (e) {
//     // ignore
//   }
// });

export default store;
