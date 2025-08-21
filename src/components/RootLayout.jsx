import MainNavigation from "@/components/MainNavigation";
import { Outlet } from "react-router-dom";

/**
 * Root layout surrounding all routes with navigation and main container.
 * @returns {JSX.Element}
 */
function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <MainNavigation />
      <main className="max-w-6xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default RootLayout;
