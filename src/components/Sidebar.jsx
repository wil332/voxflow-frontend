import { Link, useLocation } from "react-router-dom";
import { sidebarLinks } from "../data/agents";
import logo from "../assets/logo.jpeg"

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-zinc-900 border-r border-white/10 flex flex-col py-2 z-50">
      <div className="px-6 py-4 flex items-center gap-3">
        <img src={logo} alt="VoxFlow AI" className="w-8 h-8 rounded-lg" />
<h1 className="text-lg font-bold text-indigo-400 tracking-tight">VoxFlow AI</h1>
      </div>

      <div className="px-4 mt-2">
        <div className="bg-white/5 rounded-lg p-3 mb-6">
          <p className="text-zinc-400 text-[10px] uppercase mb-1">Current Space</p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm">Pro Workspace</span>
            <span className="material-symbols-outlined text-zinc-400 text-sm">unfold_more</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 rounded-lg px-4 py-2 mx-2 transition-all ${
                isActive
                  ? "bg-purple-300/20 text-purple-200"
                  : "text-zinc-400 hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined text-lg">{link.icon}</span>
              <span className="text-sm">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4 py-4 border-t border-white/10">
        <Link
          to="/dashboard/new-project"
          className="w-full bg-indigo-500 hover:opacity-90 text-white py-2 rounded-lg font-bold text-sm active:scale-95 transition-all mb-4 flex items-center justify-center"
        >
          New Project
        </Link>
        <div className="flex flex-col gap-1">
          <a className="flex items-center gap-3 text-zinc-400 hover:text-zinc-100 px-2 py-1 text-sm transition-colors" href="#">
            <span className="material-symbols-outlined text-sm">help</span> Support
          </a>
          <Link className="flex items-center gap-3 text-zinc-400 hover:text-zinc-100 px-2 py-1 text-sm transition-colors" to="/">
            <span className="material-symbols-outlined text-sm">logout</span> Logout
          </Link>
        </div>
      </div>
    </aside>
  );
}