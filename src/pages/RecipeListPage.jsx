import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRecipes } from "@/store/recipesSlice";
import RecipeCard from '@/components/RecipeCard';
import SearchAndFilterBar from '@/components/SearchAndFilterBar';
import ErrorPage from '@/pages/ErrorPage';
import Loading from '@/components/Loading';
// import useRecipesLoader from '@/hooks/useRecipesLoader';

/**
 * Recipe list with search and category filtering.
 * @returns {JSX.Element}
 */
function RecipeListPage() {
  // useRecipesLoader();
  const { items, loading, error } = useSelector((state) => state.recipes);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Alle");
  const dispatch = useDispatch();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((r) => {
      const catOk = category === "Alle" || r.category === category;
      if (!q) return catOk;
      const inTitle = r.title.toLowerCase().includes(q);
      const inIngr = (r.ingredients || []).some((i) => i.toLowerCase().includes(q));
      return catOk && (inTitle || inIngr);
    });
  }, [items, query, category]);

  useEffect(() => { dispatch(fetchRecipes()); }, [dispatch]);

  if (loading) return <Loading />;
  if (error) return <ErrorPage message={error} />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Rezeptübersicht</h1>
      <SearchAndFilterBar
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
      />
      {filtered.length === 0 ? (
        <p className="text-slate-500">Keine Rezepte gefunden.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}
export default RecipeListPage;