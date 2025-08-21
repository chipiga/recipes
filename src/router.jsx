/* eslint-disable react-refresh/only-export-components */
import { useSelector } from 'react-redux';
import { createBrowserRouter, useLocation, Navigate } from 'react-router-dom';
import RootLayout from '@/components/RootLayout';
import ErrorPage from '@/pages/ErrorPage';
import FavoritesPage from '@/pages/FavoritesPage';
import RecipeListPage from '@/pages/RecipeListPage';
import RecipeDetailPage from '@/pages/RecipeDetailPage';
import RecipeFormPage from '@/pages/RecipeFormPage';
import Login from '@/components/Login';
import Register from '@/components/Register';

/**
 * Guards routes that require an authenticated user.
 * Redirects unauthenticated users to `/login` and preserves the origin path.
 *
 * @param {{ children: import('react').ReactElement }} props React children to render when authorized.
 * @returns {import('react').ReactElement} The protected content or a redirect.
 */
function ProtectedRoute({ children }){
  const user = useSelector(s => s.auth.user);
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  return children;
}

// TODO SSR/SSG?
/**
 * Application router with public and protected routes.
 * @type {import('react-router-dom').Router}
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />, // TODO 404?
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/', element: <RecipeListPage /> },
      { path: '/favorites', element: <FavoritesPage /> },
      { path: '/recipes/:id', element: <RecipeDetailPage /> },
      { path: '/create', element: <ProtectedRoute><RecipeFormPage mode="create" /></ProtectedRoute> },
      { path: '/edit/:id', element: <ProtectedRoute><RecipeFormPage mode="edit" /></ProtectedRoute> },
      { path: '*', element: <ErrorPage /> },
    ]
  }
]);

export default router;
