import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

const LS_KEY = "recipeApp:favorites";

/**
 * Load favorites from LocalStorage.
 * @returns {string[]} List of recipe IDs.
 */
function loadLS(){
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; }
}
/**
 * Persist favorites to LocalStorage.
 * @param {string[]} data
 * @returns {void}
 */
function saveLS(data){
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {e => console.error(e) }
}

// Firebase sync thunks
export const fetchFavoritesFromFirebase = createAsyncThunk(
  "favorites/fetchFromFirebase",
  async (uid) => {
    if (!uid) return [];
    const ref = doc(db, "favorites", uid);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data().list || [] : [];
  }
);

export const saveFavoritesToFirebase = createAsyncThunk(
  "favorites/saveToFirebase",
  async ({ uid, favorites }) => {
    if (!uid) return;
    const ref = doc(db, "favorites", uid);
    await setDoc(ref, { list: favorites });
  }
);

// Thunks to update favorites and sync with Firebase
export const toggleFavoriteAndSync = createAsyncThunk(
  "favorites/toggleAndSync",
  async (id, { getState, dispatch }) => {
    const state = getState();
    const uid = state.auth?.user?.uid;
    const favorites = state.favorites || [];
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(fav => fav !== id);
    } else {
      updated = [...favorites, id];
    }
    dispatch(setFavorites(updated));
    if (uid) {
      await dispatch(saveFavoritesToFirebase({ uid, favorites: updated }));
    }
    return updated;
  }
);

export const setFavoritesAndSync = createAsyncThunk(
  "favorites/setAndSync",
  async (arr, { getState, dispatch }) => {
    const state = getState();
    const uid = state.auth?.user?.uid;
    const updated = Array.from(new Set(arr || []));
    dispatch(setFavorites(updated));
    if (uid) {
      await dispatch(saveFavoritesToFirebase({ uid, favorites: updated }));
    }
    return updated;
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: loadLS(),
  reducers: {
    /**
     * Toggle a recipe ID in the favorites list.
     * @param {string[]} state
     * @param {{ type: string, payload: string }} action
     */
    toggleFavorite(state, action){
      const id = action.payload;
      const idx = state.indexOf(id);
      if (idx >= 0) state.splice(idx,1); else state.push(id);
      saveLS(state);
    },
    /**
     * Replace favorites with a deduplicated list.
     * @param {string[]} _
     * @param {{ type: string, payload: string[] }} action
     * @returns {string[]}
     */
    setFavorites(_, action){
      const arr = Array.from(new Set(action.payload || []));
      saveLS(arr);
      return arr;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoritesFromFirebase.fulfilled, (state, action) => {
        // Merge local and remote favorites
        const remote = action.payload || [];
        const local = loadLS();
        const merged = Array.from(new Set([...local, ...remote]));
        saveLS(merged);
        return merged;
      });
      // No reducer for saveFavoritesToFirebase (side effect only)
  }
});

export const { toggleFavorite, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
