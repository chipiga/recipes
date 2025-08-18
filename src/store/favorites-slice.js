import { createSlice } from "@reduxjs/toolkit";

const LS_KEYS = {
  favorites: "recipeApp:favorites",
};
const initialFavorites = (() => {
  try {
    const raw = localStorage.getItem(LS_KEYS.favorites);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
})();

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: initialFavorites,
  reducers: {
    toggleFavorite(state, action) {
      const id = action.payload;
      const idx = state.indexOf(id);
      if (idx >= 0) state.splice(idx, 1);
      else state.push(id);
    },
    setFavorites(state, action) {
      return action.payload || [];
    },
  },
});

export const { toggleFavorite, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;