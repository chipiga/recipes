import { createSlice } from "@reduxjs/toolkit";

const LS_KEY = "recipeApp:favorites";

function loadLS(){
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; }
}
function saveLS(data){
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
}

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: loadLS(),
  reducers: {
    toggleFavorite(state, action){
      const id = action.payload;
      const idx = state.indexOf(id);
      if (idx >= 0) state.splice(idx,1); else state.push(id);
      saveLS(state);
    },
    setFavorites(_, action){
      const arr = Array.from(new Set(action.payload || []));
      saveLS(arr);
      return arr;
    }
  }
});

export const { toggleFavorite, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
