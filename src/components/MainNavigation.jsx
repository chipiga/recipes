import { Link } from "react-router-dom";

function MainNavigation() {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link to="/" className="text-xl font-bold">Rezepte</Link>
        <nav className="ml-auto flex items-center gap-2">
          <Link className="px-3 py-1.5 rounded-xl hover:bg-slate-100" to="/">Übersicht</Link>
          <Link className="px-3 py-1.5 rounded-xl hover:bg-slate-100" to="/create">Neues Rezept</Link>
          <Link className="px-3 py-1.5 rounded-xl hover:bg-slate-100" to="/favorites">Favoriten</Link>
        </nav>
      </div>
    </header>
  )
}

export default MainNavigation;
