import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { startAuthListener } from "@/store/authSlice";

import { RouterProvider } from "react-router-dom";
import router from '@/router';

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
