import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/components/RootLayout';
import ErrorPage from '@/pages/ErrorPage';
import RecipeListPage from '@/pages/RecipeListPage';
import FavoritesPage from '@/pages/FavoritesPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    // errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <RecipeListPage /> },
      { path: '/favorites', element: <FavoritesPage /> },
      { path: '*', element: <ErrorPage /> },
    ]
  }
]);

export default router;
