import MainNavigation from "@/components/MainNavigation";
import { Outlet } from "react-router-dom";

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
