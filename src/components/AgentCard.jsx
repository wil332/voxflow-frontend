import StatusBadge from "./StatusBadge";

const PANEL = "bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl";

export default function AgentCard({ agent }) {
  const isPending = agent.status === "pending";
  const isProcessing = agent.status === "processing";
  const isDone = agent.status === "done";
  const isFailed = agent.status === "failed";

  return (
    <div
      className={`p-5 flex flex-col md:flex-row md:items-center gap-4 hover:border-white/30 transition-all cursor-pointer ${PANEL} ${
        isPending ? "opacity-60" : ""
      } ${isProcessing ? "border-indigo-500/30 bg-indigo-950/10" : ""} ${
        isDone ? "border-emerald-500/30 bg-emerald-950/10" : ""
      } ${isFailed ? "border-fuchsia-500/30 bg-fuchsia-950/10" : ""}`}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isProcessing ? "bg-indigo-500/20" :
          isDone ? "bg-emerald-500/20" :
          isFailed ? "bg-fuchsia-500/20" :
          "bg-white/5"
        }`}>
          <span className={`material-symbols-outlined ${
            isProcessing ? "text-indigo-400 animate-spin" :
            isDone ? "text-emerald-400" :
            isFailed ? "text-fuchsia-400" :
            "text-indigo-400"
          }`}>{agent.icon}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold">{agent.name}</h4>
            <span className="text-xs text-zinc-400 px-2 py-0.5 rounded bg-white/5">{agent.tag}</span>
            {isProcessing && (
              <span className="text-[10px] text-indigo-400 animate-pulse ml-auto">● Processing</span>
            )}
          </div>

          {/* Progress Bar */}
          {agent.progress !== null && agent.progress !== undefined && (
            <div className="w-full max-w-xs h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  isProcessing ? "bg-indigo-400 animate-pulse" :
                  isDone ? "bg-emerald-400" :
                  isFailed ? "bg-fuchsia-400" :
                  "bg-zinc-600"
                }`}
                style={{ width: `${agent.progress}%` }}
              />
            </div>
          )}

          <p className="text-xs text-zinc-400 mt-2 italic">{agent.note}</p>

          {/* View Result Link */}
          {isDone && agent.resultUrl && (
            <a
              href={agent.resultUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-purple-200 mt-2 font-bold"
            >
              View Result <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-8 px-4 border-l border-white/10">
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Status</span>
          <StatusBadge status={agent.status} />
        </div>
        <div className="flex flex-col items-end min-w-20">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Updated</span>
          <span className="text-sm">{agent.updated}</span>
        </div>
      </div>
    </div>
  );
}