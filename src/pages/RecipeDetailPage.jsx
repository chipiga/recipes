import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRecipe } from '@/store/recipesSlice';
import { Button } from '@/components/ui/button';
import FavoriteButton from '@/components/FavoriteButton';
import ErrorPage from '@/pages/ErrorPage';
import { toast } from "react-toastify";

function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recipe = useSelector((s) => s.recipes.items.find((r) => r.id === id));
  const user = useSelector(s => s.auth.user);
  const canEdit = user && (user.role === "admin" || user.uid === recipe?.uid);

  if (!recipe) return <ErrorPage message="Recipe not found" />;

  async function handleDelete() {
    if (!confirm("Are you sure?")) return;
    await dispatch(deleteRecipe({ id: recipe.id }));
    navigate("/");
    toast.success("Recipe deleted!");
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {recipe.image && (
          <img src={recipe.image} alt={recipe.title} className="h-64 w-full object-cover" />
        )}
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <h1 className="text-2xl font-bold flex-1">{recipe.title}</h1>
            <FavoriteButton recipeId={recipe.id} />
          </div>
          <p className="text-slate-600">Kategorie: {recipe.category}</p>
          <section>
            <h2 className="font-semibold mb-1">Zutaten</h2>
            <ul className="list-disc list-inside text-slate-700">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-semibold mb-1">Zubereitung</h2>
            <p className="whitespace-pre-line leading-relaxed">{recipe.instructions}</p>
          </section>
        </div>
      </div>
      <aside className="space-y-3">
        {canEdit && (
          <>
            <Link
              to={`/edit/${recipe.id}`}
              className="block text-center px-4 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50"
            >Edit</Link>
            <Button variant="destructive" size="lg" onClick={handleDelete} className="w-full">Delete</Button>
          </>
        )}
      </aside>
    </div>
  );
}
export default RecipeDetailPage;