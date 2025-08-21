import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "@/firebase";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

/**
 * Fetch all recipes from Firestore.
 * @returns {Promise<Array<{id: string} & Record<string, any>>>}
 */
export const fetchRecipes = createAsyncThunk("recipes/fetch", async () => {
  const querySnapshot = await getDocs(collection(db, "recipes"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

export const addRecipe = createAsyncThunk("recipes/add", async ({ recipe, user }) => {
  const newRecipe = { ...recipe, uid: user.uid, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  const docRef = await addDoc(collection(db, "recipes"), newRecipe);
  return { id: docRef.id, ...newRecipe };
});

export const updateRecipe = createAsyncThunk("recipes/update", async ({ id, updates }) => {
  const recipeRef = doc(db, "recipes", id);
  await updateDoc(recipeRef, { ...updates, updatedAt: new Date().toISOString() });
  return { id, updates };
});

export const deleteRecipe = createAsyncThunk("recipes/delete", async ({ id }) => {
  const recipeRef = doc(db, "recipes", id);
  await deleteDoc(recipeRef);
  return id;
});

const recipesSlice = createSlice({
  name: "recipes",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addRecipe.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        const idx = state.items.findIndex((r) => r.id === action.payload.id);
        if (idx >= 0) state.items[idx] = { ...state.items[idx], ...action.payload.updates };
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      });
  },
});

export default recipesSlice.reducer;