import { useDispatch, useSelector } from 'react-redux';
import { toggleFavoriteAndSync } from '@/store/favoritesSlice';
import { Button } from '@/components/ui/button';

export default function FavoriteButton({ recipeId, short = false }) {
  const dispatch = useDispatch();
  const favorites = useSelector(s => s.favorites);
  const isFavorite = favorites.includes(recipeId);
  const buttonText = short ? '' : ' Favorit'

  return (
    <Button
      onClick={() => dispatch(toggleFavoriteAndSync(recipeId))}
      variant={`favorite${ isFavorite ? 'Active' : 'Inactive'}`} size="md"
    >
      {isFavorite ? `★${buttonText}`: `☆${buttonText}`}
    </Button>
  );
}