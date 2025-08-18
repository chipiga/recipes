import { useSelector } from 'react-redux';
import RecipeCard from '@/components/RecipeCard';
import useRecipesLoader from '@/hooks/useRecipesLoader';

function FavoritesPage() {
  useRecipesLoader();
  const recipes = useSelector((s) => s.recipes);
  const favorites = useSelector((s) => s.favorites);
  const favRecipes = recipes.filter((r) => favorites.includes(r.id));
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Favoriten</h1>
      {favRecipes.length === 0 ? (
        <p className="text-slate-500">Noch keine Favoriten.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favRecipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}
export default FavoritesPage;