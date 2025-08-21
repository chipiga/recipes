import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { startAuthListener } from "@/store/authSlice";

import { RouterProvider } from "react-router-dom";
import router from '@/router';

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

/**
 * Root application component.
 * Sets up the authentication listener and renders the router and toasts.
 *
 * @returns {JSX.Element} The application root element.
 */
function App() {
  const dispatch = useDispatch();

  useEffect(() => { dispatch(startAuthListener()); }, [dispatch]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}

export default App
