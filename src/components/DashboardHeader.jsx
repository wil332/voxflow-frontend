export default function DashboardHeader({ title, breadcrumb }) {
  return (
    <header className="sticky top-0 w-full h-16 bg-zinc-950/80 backdrop-blur-md border-b border-white/10 flex justify-between items-center px-10 z-40">
      <div className="flex items-center gap-4 text-sm">
        <span className="font-bold">{title}</span>
        <span className="text-zinc-500">/</span>
        <span className="text-zinc-400">{breadcrumb}</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 cursor-pointer text-sm">
          <span className="material-symbols-outlined text-sm">search</span> Quick Search
        </div>
        <div className="w-8 h-8 rounded-full bg-zinc-700 border border-white/10 flex items-center justify-center text-xs">
          W
        </div>
      </div>
    </header>
  );
}
