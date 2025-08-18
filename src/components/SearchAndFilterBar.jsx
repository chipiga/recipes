import { useMemo } from 'react';
import { useSelector } from 'react-redux';

function SearchAndFilterBar({ query, setQuery, category, setCategory }) {
  const recipes = useSelector((s) => s.recipes);
  const categories = useMemo(() => {
    const set = new Set(recipes.map((r) => r.category || "Sonstiges"));
    return ["Alle", ...Array.from(set)];
  }, [recipes]);

  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-end md:justify-between">
      <div className="flex-1">
        <label className="block text-sm mb-1">Suche nach Titel/Zutat</label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="z.B. Nudeln, Tomaten, Curry..."
          className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Kategorie</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-slate-300 rounded-xl px-3 py-2"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
export default SearchAndFilterBar;