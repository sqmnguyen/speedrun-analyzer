
import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-center py-3">
          <nav className="flex items-center gap-6 rounded-full bg-slate-800/80 px-4 py-2 shadow-md ring-1 ring-slate-700/60">
            <Link className="px-3 py-1.5 text-slate-200 hover:text-white hover:bg-slate-700 rounded-md transition" to="/">Home</Link>
            <Link className="px-3 py-1.5 text-slate-200 hover:text-white hover:bg-slate-700 rounded-md transition" to="/runs">Runs</Link>
            <Link className="px-3 py-1.5 text-slate-200 hover:text-white hover:bg-slate-700 rounded-md transition" to="/statistics">Statistics</Link>
            <Link className="px-3 py-1.5 text-slate-200 hover:text-white hover:bg-slate-700 rounded-md transition" to="/predictions">Predictions</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
