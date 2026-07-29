import GlassPanel from "./GlassPanel";

const statusColor = {
  good: { dot: "bg-cyan-400", text: "text-cyan-400" },
  neutral: { dot: "bg-indigo-400 animate-pulse", text: "text-zinc-100" },
  bad: { dot: "bg-red-400 animate-pulse", text: "text-red-400" },
};

export default function SystemHealthCard({ items }) {
  return (
    <GlassPanel className="p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold mb-2">System Health</h3>
        <div className="space-y-4 mt-4">
          {items.map((item) => {
            const color = statusColor[item.status] ?? statusColor.neutral;
            return (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm">{item.label}</span>
                <span className={`flex items-center gap-1.5 text-sm ${color.text}`}>
                  <span className={`w-2 h-2 rounded-full ${color.dot}`} /> {item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <button className="w-full mt-6 flex items-center justify-center gap-2 text-indigo-400 font-bold text-sm border border-indigo-400/20 rounded-lg py-2 hover:bg-indigo-400/5 transition-colors">
        View Node Network <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </button>
    </GlassPanel>
  );
}
