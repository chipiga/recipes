import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

const recipesSlice = createSlice({
  name: "recipes",
  initialState: [],
  reducers: {
    recipesLoaded(state, action) {
      return action.payload || [];
    },
    addRecipe: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(recipe) {
        return { payload: { ...recipe, id: nanoid() } };
      },
    },
    updateRecipe(state, action) {
      const updated = action.payload;
      const i = state.findIndex((r) => r.id === updated.id);
      if (i >= 0) state[i] = { ...state[i], ...updated };
    },
    deleteRecipe(state, action) {
      const id = action.payload;
      return state.filter((r) => r.id !== id);
    },
  },
});

export const { recipesLoaded, addRecipe, updateRecipe, deleteRecipe } = recipesSlice.actions;
export default recipesSlice.reducer;