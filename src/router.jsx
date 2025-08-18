import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/components/RootLayout';
import ErrorPage from '@/pages/ErrorPage';
import FavoritesPage from '@/pages/FavoritesPage';
import RecipeListPage from '@/pages/RecipeListPage';
import RecipeDetailPage from '@/pages/RecipeDetailPage';
import RecipeFormPage from '@/pages/RecipeFormPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    // errorElement: <ErrorPage />, // TODO 404?
    children: [
      { path: '/', element: <RecipeListPage /> },
      { path: '/favorites', element: <FavoritesPage /> },
      { path: '/recipes/:id', element: <RecipeDetailPage /> },
      { path: '/create', element: <RecipeFormPage mode="create" /> },
      { path: '/edit/:id', element: <RecipeFormPage mode="edit" />},
      { path: '*', element: <ErrorPage /> },
    ]
  }
]);

export default router;
