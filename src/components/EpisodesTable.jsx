import { useState } from "react";
import { Link } from "react-router-dom";
import GlassPanel from "./GlassPanel";
import { usePipeline } from "../context/usePipeline";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://voxflow-backend-production.up.railway.app";

const localStatusColor = {
  completed: "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20",
  done: "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20",
  processing: "bg-indigo-400/10 text-indigo-400 border border-indigo-400/20 animate-pulse",
  failed: "bg-fuchsia-400/10 text-fuchsia-400 border border-fuchsia-400/20",
  pending: "bg-amber-400/10 text-amber-400 border border-amber-400/20",
  idle: "bg-zinc-800 text-zinc-500 border border-zinc-700",
};

export default function EpisodesTable({ episodes = [], showViewAll = false, limit }) {
  const { handleRetry, isLoading, getVideoStreamUrl, fetchHistory } = usePipeline();
  const [deletingId, setDeletingId] = useState(null);

  const visibleEpisodes = limit ? episodes.slice(0, limit) : episodes;

  // rawId dipakai buat panggil API (harus angka murni), ep.id boleh format tampilan "EP-001"
  const handleDelete = async (rawId, title) => {
    if (!window.confirm(`⚠️ Hapus episode "${title}"? Ini tidak bisa dibatalkan!`)) {
      return;
    }

    setDeletingId(rawId);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/podcast/episode/${rawId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Gagal menghapus");
      }

      await fetchHistory(); // refresh data tanpa reload penuh halaman
    } catch (error) {
      alert(`❌ Gagal menghapus: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <GlassPanel className="p-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">📋 Episode History</h3>
        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-400">{episodes.length} episode total</span>
          {showViewAll && (
            <Link
              to="/dashboard/history"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold"
            >
              View All
            </Link>
          )}
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-zinc-500 text-xs uppercase tracking-wider border-b border-white/10">
            <th className="pb-3 font-medium">Episode</th>
            <th className="pb-3 font-medium">Title</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Progress</th>
            <th className="pb-3 font-medium">Started</th>
            <th className="pb-3 font-medium text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {visibleEpisodes.length > 0 ? (
            visibleEpisodes.map((ep) => {
              const rawId = ep.rawId ?? ep.id; // fallback kalau rawId belum disediakan
              const canDelete = ep.status !== "processing" && ep.status !== "pending";
              const isDeleting = deletingId === rawId;

              return (
                <tr key={ep.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="py-3">
                    <span className="font-bold text-zinc-100">{ep.id}</span>
                  </td>
                  <td className="py-3">
                    <span className="text-zinc-300 truncate max-w-[150px] inline-block">{ep.title}</span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                        localStatusColor[ep.status] || localStatusColor.idle
                      }`}
                    >
                      {ep.status === "processing" ? "● Running" :
                       ep.status === "completed" ? "✅ Done" :
                       ep.status === "failed" ? "❌ Failed" :
                       ep.status === "pending" ? "⏳ Pending" :
                       ep.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2 w-32">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            ep.status === "failed" ? "bg-fuchsia-400" :
                            ep.status === "processing" ? "bg-indigo-400" :
                            ep.status === "completed" ? "bg-emerald-400" :
                            "bg-amber-400"
                          }`}
                          style={{ width: `${ep.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-400">{ep.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-zinc-500 text-xs">{ep.startedAt || "Baru saja"}</td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {ep.status === "completed" && ep.videoFilename && (
                        <a
                          href={getVideoStreamUrl(ep.videoFilename)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-emerald-400 hover:text-emerald-300 font-bold px-2 py-1 rounded hover:bg-emerald-400/10 transition"
                        >
                          View
                        </a>
                      )}

                      {ep.status === "failed" && (
                        <button
                          onClick={() => handleRetry(rawId, ep.title)}
                          disabled={isLoading}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-bold px-2 py-1 rounded hover:bg-indigo-400/10 transition disabled:opacity-50"
                        >
                          Retry
                        </button>
                      )}

                      {canDelete && (
                        <button
                          onClick={() => handleDelete(rawId, ep.title)}
                          disabled={isDeleting}
                          className={`text-xs text-fuchsia-400 hover:text-fuchsia-300 font-bold px-2 py-1 rounded hover:bg-fuchsia-400/10 transition disabled:opacity-50 ${
                            isDeleting ? "animate-pulse" : ""
                          }`}
                        >
                          {isDeleting ? "⏳" : "🗑️"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="py-6 text-center text-zinc-500 text-xs">
                Belum ada episode. Buat project baru!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </GlassPanel>
  );
}