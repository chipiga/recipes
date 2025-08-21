import { Link } from 'react-router-dom';
import FavoriteButton from '@/components/FavoriteButton';

/**
 * Card displaying brief recipe information.
 * @param {{ recipe: { id: string, title: string, category: string, ingredients: string[], image?: string, uid?: string } }} props
 * @returns {JSX.Element}
 */
function RecipeCard({ recipe }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className="h-40 w-full object-cover" />
      )}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start gap-2">
          <h3 className="text-lg font-semibold flex-1">{recipe.title}</h3>
          <FavoriteButton recipeId={recipe.id} short={true} />
        </div>
        <p className="text-sm text-slate-500 mt-1">{recipe.category}</p>
        <p className="text-sm line-clamp-2 my-2">
          Zutaten: {recipe.ingredients.join(", ")}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <Link
            to={`/recipes/${recipe.id}`}
            className="inline-block px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50"
          >
            Details
          </Link>
          {recipe.uid && <span className="text-xs text-slate-400">von {recipe.uid.slice(0, 6)}</span>}
        </div>
      </div>
    </div>
  );
}
export default RecipeCard;