import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addRecipe, updateRecipe } from '@/store/recipesSlice';
import useRecipesLoader from '@/hooks/useRecipesLoader';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function RecipeFormPage({ mode }) {
  useRecipesLoader();
  const isEdit = mode === "edit";
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const existing = useSelector((s) => s.recipes.find((r) => r.id === id));

  const [title, setTitle] = useState(existing?.title || "");
  const [category, setCategory] = useState(existing?.category || "Sonstiges");
  const [ingredientsText, setIngredientsText] = useState((existing?.ingredients || []).join(", "));
  const [instructions, setInstructions] = useState(existing?.instructions || "");
  const [image, setImage] = useState(existing?.image || "");

  useEffect(() => {
    if (isEdit && !existing) { // check if recipe exists for edit mode
      navigate("/");
    }
  }, [isEdit, existing, navigate]);

  function onSubmit(e) {
    e.preventDefault();
    const newRecipe = {
      id: existing?.id,
      title: title.trim() || "Unbenannt",
      category: category.trim() || "Sonstiges",
      ingredients: ingredientsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      instructions: instructions.trim(),
      image: image.trim() || undefined,
    };

    if (isEdit) {
      dispatch(updateRecipe(newRecipe));
      navigate(`/recipes/${existing.id}`);
    } else {
      dispatch(addRecipe(newRecipe));
      navigate("/");
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Rezept bearbeiten" : "Neues Rezept anlegen"}
      </h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label>Titel</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Kategorie</Label>
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div>
          <Label>Zutaten (kommagetrennt)</Label>
          <Input
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder="z.B. Tomaten, Gurken, ..."
          />
        </div>
        <div>
          <Label>Zubereitung</Label>
          <Textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>
        <div>
          <Label>Bild-URL (optional)</Label>
          <Input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="lg">
            {isEdit ? "Speichern" : "Erstellen"}
          </Button>
          <Button type="button" variant="outline" size="lg"
            onClick={() => navigate(isEdit ? `/recipes/${existing?.id}` : "/")}
          >
            Abbrechen
          </Button>
        </div>
      </form>
    </div>
  );
}
export default RecipeFormPage;