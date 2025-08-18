import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleFavorite } from '@/store/favoritesSlice';
import { Button } from '@/components/ui/button';

function RecipeCard({ recipe }) {
  const dispatch = useDispatch();
  const favorites = useSelector((s) => s.favorites);
  const isFav = favorites.includes(recipe.id);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className="h-40 w-full object-cover" />
      )}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start gap-2">
          <h3 className="text-lg font-semibold flex-1">{recipe.title}</h3>
          <Button
            onClick={() => dispatch(toggleFavorite(recipe.id))}
            variant={`favorite${ isFav ? 'Active' : 'Inactive'}`} size="md"
            title={isFav ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
          >
            {isFav ? "★" : "☆"}
          </Button>
        </div>
        <p className="text-sm text-slate-500 mt-1">{recipe.category}</p>
        <p className="text-sm line-clamp-2 mt-2">
          Zutaten: {recipe.ingredients.join(", ")}
        </p>
        <div className="mt-auto pt-3">
          <Link
            to={`/recipes/${recipe.id}`}
            className="inline-block px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
export default RecipeCard;