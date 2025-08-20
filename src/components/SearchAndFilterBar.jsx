import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

function SearchAndFilterBar({ query, setQuery, category, setCategory }) {
  const recipes = useSelector((s) => s.recipes.items);
  const categories = useMemo(() => {
    const set = new Set(recipes.map((r) => r.category || "Sonstiges"));
    return ["Alle", ...Array.from(set)];
  }, [recipes]);

  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-end md:justify-between">
      <div className="flex-1">
        <Label>Suche nach Titel/Zutat</Label>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="z.B. Nudeln, Tomaten, Curry..."
          className="focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      </div>
      <div>
        <Label>Kategorie</Label>
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