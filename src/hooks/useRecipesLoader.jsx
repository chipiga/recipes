import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from "nanoid";
import { fetchRecipes } from '@/store/recipesSlice';

/**
 * @typedef {Object} Recipe
 * @property {string} id
 * @property {string} title
 * @property {string} category
 * @property {string[]} ingredients
 * @property {string} instructions
 * @property {string=} image
 */

/**
 * Load and normalize recipes from `/recipes.json` when Firestore is empty.
 * Used as a fallback bootstrap for development or first run.
 *
 * @returns {Promise<Recipe[]>} Normalized recipe list.
 */
async function loadRecipesFromJson() {
  try { 
    const res = await fetch("/recipes.json", { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    // validieren & IDs ergänzen, falls fehlen
    const normalized = (Array.isArray(data) ? data : []).map((r) => ({
      id: r.id || nanoid(),
      title: r.title || "Unbenanntes Rezept",
      category: r.category || "Sonstiges",
      ingredients: r.ingredients || [],
      instructions: r.instructions || "",
      image: r.image,
    }));
    return normalized;
  } catch (e) {
    console.error(e);
    return [];
  }
}

/**
 * React hook to ensure recipes are loaded.
 * Triggers a background fetch when there are no items in the store.
 *
 * @returns {void}
 */
function useRecipesLoader() {
  const dispatch = useDispatch();
  const recipes = useSelector((s) => s.recipes.items);
  useEffect(() => {
    if (recipes && recipes.length === 0) {
      loadRecipesFromJson().then(data => {
        console.log(data);
        // dispatch(recipesLoaded(data))
        dispatch(fetchRecipes(data))
      })
    }
  }, [dispatch, recipes]);
}

export default useRecipesLoader;
