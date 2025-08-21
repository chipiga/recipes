import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from "nanoid";
import { fetchRecipes } from '@/store/recipesSlice';

// { id: string, title: string, category: string, ingredients: string[], instructions: string, image?: string }

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

function useRecipesLoader() {
  const dispatch = useDispatch();
  const recipes = useSelector((s) => s.recipes.items);
  useEffect(() => {
    if (!recipes || recipes.length === 0)
      loadRecipesFromJson().then(data => {
        console.log(data);
        // dispatch(recipesLoaded(data))
        dispatch(fetchRecipes(data))
      })
  }, [dispatch, recipes]);
}

export default useRecipesLoader;
