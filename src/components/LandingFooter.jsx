import { footerLinkGroups } from "../data/landingContent";

export default function LandingFooter() {
  return (
    <footer className="w-full pt-16 pb-8 bg-zinc-900/40 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
          <div className="col-span-2">
            <div className="text-2xl font-black text-white/10 uppercase tracking-widest mb-6">
              VoxFlow AI
            </div>
            <p className="text-zinc-400 text-sm max-w-xs">
              The autonomous production house for the next generation of creative content.
            </p>
          </div>
          {footerLinkGroups.map((col) => (
            <div key={col.title}>
              <h4 className="text-lg font-semibold mb-6">{col.title}</h4>
              <ul className="flex flex-col gap-3 text-sm text-zinc-400">
                {col.items.map((item) => (
                  <li key={item}>
                    <a className="hover:text-zinc-100 hover:underline transition-all" href="#">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">© {new Date().getFullYear()} VoxFlow AI, Inc. All rights reserved.</p>
          <span className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> All Systems Operational
          </span>
        </div>
      </div>
    </footer>
  );
}
