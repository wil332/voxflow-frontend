import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import GlassPanel from "../components/GlassPanel";
import { usePipeline } from "../context/usePipeline";

export default function LiveFeed() {
  const { agentsState, isLoading, currentJob, history, getQueue } = usePipeline();
  const logContainerRef = useRef(null);
  const [logs, setLogs] = useState([]);

  // Generate logs dari agentsState + history
  useEffect(() => {
    const newLogs = [];
    const now = new Date();

    // Log dari agent status
    if (agentsState && agentsState.length > 0) {
      agentsState.forEach((agent, index) => {
        if (agent.status !== "idle") {
          const statusMap = {
            processing: "🔄 Running",
            completed: "✅ Completed",
            error: "❌ Failed"
          };
          const time = new Date(now.getTime() - (agentsState.length - index) * 3000);
          newLogs.push({
            id: `agent-${index}`,
            time: time.toLocaleTimeString(),
            agent: agent.name,
            message: `${agent.name}: ${statusMap[agent.status] || agent.status} (${Math.round(agent.progress || 0)}%)`,
            type: agent.status === "processing" ? "info" :
                  agent.status === "completed" ? "success" :
                  agent.status === "error" ? "error" : "pending"
          });
        }
      });
    }

    // Log dari queue
    const queue = getQueue();
    if (queue.length > 0) {
      queue.forEach((item, idx) => {
        const time = new Date(now.getTime() - idx * 5000);
        newLogs.push({
          id: `queue-${idx}`,
          time: time.toLocaleTimeString(),
          agent: "Queue Manager",
          message: `📋 Job #${item.id}: "${item.keyword}" added to queue`,
          type: "info"
        });
      });
    }

    // Log jika tidak ada aktivitas
    if (newLogs.length === 0 && !isLoading) {
      newLogs.push({
        id: "idle",
        time: new Date().toLocaleTimeString(),
        agent: "System",
        message: "💤 Waiting for new jobs...",
        type: "pending"
      });
    }

    setLogs(newLogs.reverse());
  }, [agentsState, isLoading, getQueue]);

  // Auto-scroll ke bawah saat log baru
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const logTypeColor = {
    info: "text-indigo-400",
    success: "text-emerald-400",
    pending: "text-zinc-500",
    error: "text-fuchsia-400",
  };

  const logTypeBg = {
    info: "bg-indigo-400/5 border-indigo-400/10",
    success: "bg-emerald-400/5 border-emerald-400/10",
    pending: "bg-zinc-800/5 border-zinc-700/10",
    error: "bg-fuchsia-400/5 border-fuchsia-400/10",
  };

  return (
    <DashboardLayout title="Live Feed" breadcrumb="Real-time Agent Activity">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">📡 Pipeline Log</h2>
          <p className="text-zinc-400 text-sm mt-1">
            {currentJob?.status === "processing"
              ? "⏳ Pipeline running..."
              : logs.some(l => l.type === "info")
              ? "🔄 System active"
              : "💤 System idle"}
          </p>
        </div>
        <span className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border ${
          currentJob?.status === "processing"
            ? "text-cyan-400 bg-cyan-400/10 border-cyan-400/20"
            : logs.some(l => l.type === "info")
            ? "text-indigo-400 bg-indigo-400/10 border-indigo-400/20"
            : "text-zinc-500 bg-zinc-800 border-zinc-700"
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            currentJob?.status === "processing" ? "bg-cyan-400 animate-pulse" :
            logs.some(l => l.type === "info") ? "bg-indigo-400" :
            "bg-zinc-600"
          }`} />
          {currentJob?.status === "processing" ? "Live" :
           logs.some(l => l.type === "info") ? "Active" : "Idle"}
        </span>
      </div>

      <GlassPanel className="p-6">
        <div
          ref={logContainerRef}
          className="max-h-[500px] overflow-y-auto space-y-3 pr-2 custom-scrollbar"
        >
          {logs.length > 0 ? (
            logs.map((log) => (
              <div
                key={log.id}
                className={`flex items-start gap-4 pb-3 border-b border-white/5 last:border-0 last:pb-0 p-2 rounded-lg ${logTypeBg[log.type] || 'bg-transparent'}`}
              >
                <span className="text-xs text-zinc-500 font-mono mt-0.5 min-w-[70px]">
                  {log.time}
                </span>
                <span className={`text-xs font-mono font-bold min-w-[140px] ${logTypeColor[log.type] || "text-zinc-400"}`}>
                  [{log.agent}]
                </span>
                <p className="text-sm text-zinc-300 flex-1">{log.message}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-4xl text-zinc-600 mb-2">inbox</span>
              <p className="text-sm text-zinc-500">
                {isLoading ? "⏳ Loading..." : "Belum ada aktivitas. Mulai project baru untuk melihat log."}
              </p>
            </div>
          )}
        </div>

        {/* Queue Overview */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400">Queue Status</span>
            <div className="flex gap-4">
              <span className="text-zinc-500">Processing: <span className="text-indigo-400 font-bold">{logs.filter(l => l.type === "info").length}</span></span>
              <span className="text-zinc-500">Completed: <span className="text-emerald-400 font-bold">{logs.filter(l => l.type === "success").length}</span></span>
              <span className="text-zinc-500">Failed: <span className="text-fuchsia-400 font-bold">{logs.filter(l => l.type === "error").length}</span></span>
            </div>
          </div>
        </div>
      </GlassPanel>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </DashboardLayout>
  );
}