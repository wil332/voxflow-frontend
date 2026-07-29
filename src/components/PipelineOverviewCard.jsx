import GlassPanel from "./GlassPanel";

export default function PipelineOverviewCard({
  episodeTitle = "Belum Ada Produksi Aktif",
  overallProgress = 0,
  totalRuntime = "00:00",
  estimatedFinish = "-",
  computeLoad = "Idle",
}) {
  const stats = [
    { label: "Total Runtime", value: totalRuntime },
    { label: "Estimated Finish", value: estimatedFinish },
    { label: "Compute Load", value: computeLoad },
  ];

  return (
    <GlassPanel className="md:col-span-2 p-6 relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-1 text-white">Overall Pipeline Status</h3>
          <p className="text-zinc-400 text-sm">Active production: {episodeTitle}</p>
        </div>
        <span className="bg-cyan-400/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-bold border border-cyan-400/20 animate-pulse">
          LIVE PROCESSING
        </span>
      </div>

      <div className="flex items-center gap-4 mt-8">
        <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-400 rounded-full transition-all duration-1000"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <span className="text-2xl font-semibold text-cyan-400">{overallProgress}%</span>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 bg-white/5 rounded-xl border border-white/5">
            <span className="text-zinc-400 text-xs block mb-1">{stat.label}</span>
            <span className="font-bold text-white">{stat.value}</span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}