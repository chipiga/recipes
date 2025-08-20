import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import RecipeCard from '@/components/RecipeCard';
import SearchAndFilterBar from '@/components/SearchAndFilterBar';
// import useRecipesLoader from '@/hooks/useRecipesLoader';

function RecipeListPage() {
  // useRecipesLoader();
  const recipes = useSelector((s) => s.recipes.items);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Alle");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter((r) => {
      const catOk = category === "Alle" || r.category === category;
      if (!q) return catOk;
      const inTitle = r.title.toLowerCase().includes(q);
      const inIngr = (r.ingredients || []).some((i) => i.toLowerCase().includes(q));
      return catOk && (inTitle || inIngr);
    });
  }, [recipes, query, category]);

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