import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import GlassPanel from "../components/GlassPanel";
import EpisodesTable from "../components/EpisodesTable";
import MetadataCard from "../components/MetadataCard";
import { usePipeline } from "../context/usePipeline";

export default function Dashboard() {
  const location = useLocation();
  const {
    history = [],
    agentsState = [],
    isLoading,
    currentJob,
    getVideoStreamUrl,
    getAudioDownloadUrl,
    getLatestEpisode,
    getStatistics,
    getQueue,
    forceUpdateAgents,
    updateCounter
  } = usePipeline();

  const historyRef = useRef(history);
  const counterRef = useRef(updateCounter);

  // ============================================================
  // DEBUG: Pantau perubahan agentsState
  // ============================================================
  useEffect(() => {
    console.log("[DASHBOARD] 🔄 Agents State Updated:", agentsState);
    if (agentsState.length > 0) {
      console.log("[DASHBOARD]   - Research:", agentsState[0]?.status, agentsState[0]?.progress);
      console.log("[DASHBOARD]   - Script:", agentsState[1]?.status, agentsState[1]?.progress);
      console.log("[DASHBOARD]   - Audio:", agentsState[2]?.status, agentsState[2]?.progress);
      console.log("[DASHBOARD]   - TikTok:", agentsState[3]?.status, agentsState[3]?.progress);
    }
  }, [agentsState]);

  // ============================================================
  // AUTO-UPDATE: Panggil saat history berubah
  // ============================================================
  useEffect(() => {
    if (history.length > 0 && history !== historyRef.current) {
      historyRef.current = history;
      console.log("[DASHBOARD] 📋 History changed, forcing update...");
      forceUpdateAgents();
    }
  }, [history]);

  // ============================================================
  // AUTO-UPDATE: Panggil saat updateCounter berubah
  // ============================================================
  useEffect(() => {
    if (updateCounter > 0 && updateCounter !== counterRef.current) {
      counterRef.current = updateCounter;
      console.log("[DASHBOARD] 🔄 Update counter:", updateCounter);
      forceUpdateAgents();
    }
  }, [updateCounter]);

  // ============================================================
  // NOTIFIKASI JOB STARTED
  // ============================================================
  useEffect(() => {
    if (location.state?.jobStarted) {
      console.log("[DASHBOARD] Job started:", location.state.keyword);
    }
  }, [location]);

  const safeHistory = Array.isArray(history) ? history : [];
  const latestEpisode = getLatestEpisode();
  const stats = getStatistics();
  const queue = getQueue();

  // ============================================================
  // FORMAT EPISODES UNTUK TABEL
  // ============================================================
  const formattedEpisodes = safeHistory.map((item) => ({
    id: `EP-${String(item.id).padStart(3, '0')}`,
    title: item.keyword || "Untitled",
    stage: item.status === "completed" ? "Completed" :
           item.status === "failed" ? "Failed" :
           item.status === "processing" ? "Processing" : "Pending",
    progress: item.status === "completed" ? 100 :
              item.status === "failed" ? 0 :
              item.status === "processing" ? 50 : 10,
    status: item.status === "completed" ? "completed" :
            item.status === "failed" ? "failed" :
            item.status === "processing" ? "processing" : "pending",
    startedAt: item.created_at ? new Date(item.created_at).toLocaleString() : "Baru saja",
    videoFilename: item.video_filename,
    audioFilename: item.merged_audio_filename,
  }));

  // ============================================================
  // VIDEO & AUDIO URL
  // ============================================================
  const videoUrl = currentJob?.videoUrl
    ? getVideoStreamUrl(currentJob.videoUrl)
    : latestEpisode?.video_filename
    ? getVideoStreamUrl(latestEpisode.video_filename)
    : null;

    console.log("video_filename =", latestEpisode?.video_filename);
console.log("videoUrl =", videoUrl);

  const audioUrl = currentJob?.audioUrl
    ? getAudioDownloadUrl(currentJob.audioUrl)
    : latestEpisode?.merged_audio_filename
    ? getAudioDownloadUrl(latestEpisode.merged_audio_filename)
    : null;
    console.log("currentJob =", currentJob);
console.log("latestEpisode =", latestEpisode);
console.log("merged_audio_filename =", latestEpisode?.merged_audio_filename);
console.log("audioUrl =", audioUrl);

  // ============================================================
  // PROGRESS
  // ============================================================
  const overallProgress = agentsState.length > 0
    ? Math.round(agentsState.reduce((acc, a) => acc + (a.progress || 0), 0) / agentsState.length)
    : 0;

  const isPipelineRunning = agentsState.some(a => a.status === "processing");

  return (
    <DashboardLayout title="Dashboard Overview" breadcrumb="System Monitor">
      {/* ===== STATISTIK ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <GlassPanel className="p-4 text-center">
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-zinc-400">Total Episodes</p>
        </GlassPanel>
        <GlassPanel className="p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{stats.published}</p>
          <p className="text-xs text-zinc-400">Published</p>
        </GlassPanel>
        <GlassPanel className="p-4 text-center">
          <p className="text-2xl font-bold text-indigo-400">{stats.queue}</p>
          <p className="text-xs text-zinc-400">In Queue</p>
        </GlassPanel>
        <GlassPanel className="p-4 text-center">
          <p className="text-2xl font-bold text-cyan-400">{stats.successRate}%</p>
          <p className="text-xs text-zinc-400">Success Rate</p>
        </GlassPanel>
      </div>

      {/* ===== PROGRESS GLOBAL ===== */}
      {isPipelineRunning && (
        <GlassPanel className="p-4 mb-6 border border-indigo-500/30 bg-indigo-950/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-white">Overall Progress</span>
            <span className="text-sm font-bold text-indigo-400">{overallProgress}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-zinc-500">
            <span>Research</span>
            <span>Script</span>
            <span>Audio</span>
            <span>TikTok</span>
          </div>
          <div className="flex justify-between mt-1">
            {agentsState.map((agent) => (
              <span key={agent.id} className={`text-xs font-medium ${
                agent.status === "processing" ? "text-indigo-400 animate-pulse" :
                agent.status === "completed" ? "text-emerald-400" :
                agent.status === "error" ? "text-fuchsia-400" :
                "text-zinc-600"
              }`}>
                {agent.status === "processing" ? "⏳" :
                 agent.status === "completed" ? "✅" :
                 agent.status === "error" ? "❌" :
                 "⬜"}
              </span>
            ))}
          </div>
        </GlassPanel>
      )}

      {/* ===== QUEUE MANAGEMENT ===== */}
      {queue.length > 0 && (
        <GlassPanel className="p-4 mb-6 border border-amber-500/20 bg-amber-950/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-amber-400 text-sm">queue</span>
            <h4 className="text-sm font-semibold text-white">Queue Management</h4>
            <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
              {queue.length} job{queue.length > 1 ? 's' : ''} in queue
            </span>
          </div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {queue.slice(0, 5).map((item, idx) => (
              <div key={item.id} className="flex items-center gap-3 text-xs">
                <span className="text-zinc-500">#{idx + 1}</span>
                <span className="text-zinc-400">{item.keyword}</span>
                <span className="text-indigo-400 animate-pulse">● Processing</span>
              </div>
            ))}
            {queue.length > 5 && (
              <p className="text-xs text-zinc-500">+{queue.length - 5} more...</p>
            )}
          </div>
        </GlassPanel>
      )}

      {/* ===== AGENT STATUS CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {agentsState?.map((agent) => (
          <GlassPanel key={agent.id} className="p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-400 font-medium">{agent.name}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  agent.status === "processing"
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 animate-pulse"
                    : agent.status === "completed"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : agent.status === "error"
                    ? "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400"
                    : "bg-zinc-800 border-zinc-700 text-zinc-500"
                }`}
              >
                {agent.status === "processing" ? "RUNNING" :
                 agent.status === "completed" ? "DONE" :
                 agent.status === "error" ? "ERROR" :
                 "IDLE"}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  agent.status === "processing" ? "bg-indigo-400 animate-pulse" :
                  agent.status === "completed" ? "bg-emerald-400" :
                  agent.status === "error" ? "bg-fuchsia-400" :
                  "bg-zinc-600"
                }`}
                style={{ width: `${agent.progress || 0}%` }}
              />
            </div>
            <p className="text-[10px] text-zinc-500 truncate mt-1.5">
              {agent.status === "processing" ? `${Math.round(agent.progress || 0)}%` :
               agent.status === "completed" ? "✓ Complete" :
               agent.status === "error" ? "✗ Failed" :
               "● Waiting"}
            </p>
          </GlassPanel>
        ))}
      </div>

      {/* ===== PREVIEW ===== */}
      <GlassPanel className={`p-6 mb-8 border ${
        isPipelineRunning ? 'border-indigo-500/30 bg-indigo-950/20' :
        latestEpisode ? 'border-emerald-500/30 bg-emerald-950/10' :
        'border-white/10'
      }`}>
        <h3 className="text-lg font-semibold text-white mb-2">
          {isPipelineRunning ? "⏳ AI Agents Working..." :
           latestEpisode ? "📺 Latest AI Output" :
           "📺 No Output Yet"}
        </h3>

        {isPipelineRunning ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-indigo-400 animate-spin">sync</span>
              <p className="text-sm text-zinc-400">Pipeline sedang berjalan...</p>
              <p className="text-xs text-zinc-500">Polling status setiap 2 detik</p>
            </div>
          </div>
        ) : (latestEpisode || currentJob) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Video Preview */}
            <div className="bg-slate-900 rounded-xl p-3 border border-white/10">
              <p className="text-xs text-zinc-400 mb-2">🎬 Video Preview:</p>
              {videoUrl ? (
                <video controls className="w-full max-h-64 rounded-lg bg-black" src={videoUrl}>
                  Browser tidak mendukung video player.
                </video>
              ) : (
                <div className="w-full max-h-64 bg-black/50 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-zinc-500">Video belum tersedia</p>
                  <p className="text-xs text-zinc-600 ml-2">(Generate video di Audio Engine)</p>
                </div>
              )}
            </div>

            {/* Audio Preview */}
            <div className="bg-slate-900 rounded-xl p-4 border border-white/10 flex flex-col justify-center">
              <p className="text-xs text-zinc-400 mb-2">🎙️ Podcast Audio:</p>
              <p className="text-sm font-semibold text-white truncate">
                {latestEpisode?.keyword || "Episode"}
              </p>
              {audioUrl ? (
                <audio controls className="w-full mt-2" src={audioUrl}>
                  Browser tidak mendukung audio player.
                </audio>
              ) : (
                <div className="w-full py-4 bg-black/30 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-zinc-500">Audio belum tersedia</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-500 py-4 text-center">
            {isLoading ? "⏳ Memuat data..." : "Belum ada episode. Buat project baru di New Project."}
          </p>
        )}
      </GlassPanel>

      {/* ===== METADATA ===== */}
      {latestEpisode?.metadata_json && (
        <section className="mb-8">
          <MetadataCard metadata={latestEpisode.metadata_json} />
        </section>
      )}

      {/* ===== TIKTOK STATUS ===== */}
      {latestEpisode?.tiktok_status && (
        <section className="mb-8">
          <GlassPanel className="p-4 border border-fuchsia-500/20 bg-fuchsia-950/10">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-zinc-400">📱 TikTok:</span>
              <span className={
                latestEpisode.tiktok_status === "success"
                  ? "text-emerald-400 font-bold"
                  : latestEpisode.tiktok_status === "failed"
                  ? "text-fuchsia-400 font-bold"
                  : latestEpisode.tiktok_status === "uploading"
                  ? "text-indigo-400 font-bold animate-pulse"
                  : "text-zinc-500"
              }>
                {latestEpisode.tiktok_status === "success" ? "✅ Uploaded" :
                 latestEpisode.tiktok_status === "failed" ? "❌ Failed" :
                 latestEpisode.tiktok_status === "uploading" ? "⏳ Uploading..." :
                 "⏳ Pending"}
              </span>
              {latestEpisode.tiktok_url && latestEpisode.tiktok_status === "success" && (
                <a
                  href={latestEpisode.tiktok_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline flex items-center gap-1"
                >
                  View on TikTok
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              )}
              {latestEpisode.tiktok_status === "failed" && latestEpisode.tiktok_error && (
                <span className="text-fuchsia-400/70 text-xs">
                  Error: {latestEpisode.tiktok_error}
                </span>
              )}
            </div>
          </GlassPanel>
        </section>
      )}

      {/* ===== HISTORY TABLE ===== */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">📋 Generation History</h3>
          <a
            href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api/v1/podcast/history`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold"
          >
            <span className="material-symbols-outlined text-sm">rss_feed</span>
            View All
          </a>
          <a
  href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api/v1/podcast/rss`}
  target="_blank"
  rel="noreferrer"
  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold"
>
  <span className="material-symbols-outlined text-sm">rss_feed</span>
  RSS Feed
</a>
        </div>
        <EpisodesTable episodes={formattedEpisodes} />
      </section>
    </DashboardLayout>
  );
}