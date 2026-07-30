import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import GlassPanel from "../components/GlassPanel";
import { usePipeline } from "../context/usePipeline";

export default function AudioEngine() {
  const {
    history,
    isLoading,
    currentJob,
    getAudioDownloadUrl,
    getVideoStreamUrl,
    getLatestEpisode,
    handleMergeAudio,
    handleGenerateVideo
  } = usePipeline();

  const [isMerging, setIsMerging] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [mergeResult, setMergeResult] = useState(null);
  const [renderResult, setRenderResult] = useState(null);

  const latestEpisode = getLatestEpisode();


    console.log("currentJob =", currentJob);
console.log("latestEpisode =", latestEpisode);
console.log("merged_audio_filename =", latestEpisode?.merged_audio_filename);


  const audioUrl = latestEpisode?.merged_audio_filename
  ? getAudioDownloadUrl(latestEpisode.merged_audio_filename)
  : currentJob?.audioUrl || null;

const videoUrl = latestEpisode?.video_filename
  ? getVideoStreamUrl(latestEpisode.video_filename)
  : currentJob?.videoUrl || null;

    console.log("video_filename =", latestEpisode?.video_filename);
console.log("videoUrl =", videoUrl);

  const onMergeAudio = async () => {
    if (!latestEpisode) {
      alert("Tidak ada episode yang bisa di-merge. Generate episode dulu di New Project.");
      return;
    }
    setIsMerging(true);
    try {
      const result = await handleMergeAudio(latestEpisode.id);
      setMergeResult(result);
      alert("✅ Audio berhasil digabung!");
    } catch (error) {
      alert("❌ Gagal merge audio: " + error.message);
    } finally {
      setIsMerging(false);
    }
  };

  const onRenderVideo = async () => {
    if (!latestEpisode) {
      alert("Tidak ada episode yang bisa di-render. Generate episode dulu.");
      return;
    }
    if (!latestEpisode.merged_audio_filename && !mergeResult) {
      alert("⚠️ Merge audio dulu sebelum render video!");
      return;
    }
    setIsRendering(true);
    try {
      const result = await handleGenerateVideo(latestEpisode.id);
      setRenderResult(result);
      alert("✅ Video berhasil dirender!");
    } catch (error) {
      alert("❌ Gagal render video: " + error.message);
    } finally {
      setIsRendering(false);
    }
  };

  const steps = [
    { label: "1. Research & Script", status: latestEpisode ? "done" : "pending", icon: latestEpisode ? "check_circle" : "radio_button_unchecked" },
    { label: "2. Audio Generation", status: latestEpisode?.audio_segments ? "done" : "pending", icon: latestEpisode?.audio_segments ? "check_circle" : "radio_button_unchecked" },
    { label: "3. Merge Audio", status: mergeResult ? "done" : (isMerging ? "processing" : "pending"), icon: mergeResult ? "check_circle" : (isMerging ? "sync" : "radio_button_unchecked") },
    { label: "4. Render Video", status: renderResult ? "done" : (isRendering ? "processing" : "pending"), icon: renderResult ? "check_circle" : (isRendering ? "sync" : "radio_button_unchecked") },
  ];

  const stepStyle = {
    done: { icon: "check_circle", color: "text-emerald-400" },
    processing: { icon: "sync", color: "text-indigo-400 animate-spin" },
    pending: { icon: "radio_button_unchecked", color: "text-zinc-600" },
  };

  return (
    <DashboardLayout title="Audio Engine" breadcrumb="Voice & Sound Production">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player */}
        <GlassPanel className="lg:col-span-2 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white">🎙️ Audio Studio</h3>
              <p className="text-zinc-400 text-sm truncate max-w-xs">
                {latestEpisode?.keyword || "Belum ada episode aktif"}
              </p>
            </div>
            {latestEpisode && (
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                latestEpisode.status === "completed"
                  ? "bg-emerald-400/10 text-emerald-400"
                  : latestEpisode.status === "failed"
                  ? "bg-fuchsia-400/10 text-fuchsia-400"
                  : "bg-indigo-400/10 text-indigo-400 animate-pulse"
              }`}>
                {latestEpisode.status?.toUpperCase() || "PROCESSING"}
              </span>
            )}
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
            {/* Waveform Placeholder */}
            <div className="w-full flex items-end justify-center gap-0.5 h-20">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    audioUrl ? "bg-indigo-400" : "bg-zinc-700"
                  }`}
                  style={{
                    height: audioUrl ? `${20 + Math.random() * 60}%` : '30%',
                    animation: audioUrl ? `pulse 1.5s ease-in-out infinite ${i * 0.05}s` : 'none'
                  }}
                />
              ))}
            </div>

            {/* Audio Player */}
            {audioUrl ? (
              <audio controls className="w-full" src={audioUrl}>
                Browser tidak mendukung audio player.
              </audio>
            ) : (
              <div className="w-full text-center py-4 bg-slate-800/50 rounded-xl border border-white/5">
                <span className="material-symbols-outlined text-3xl text-zinc-600">music_off</span>
                <p className="text-sm text-zinc-400 mt-1">Audio belum tersedia</p>
                <p className="text-xs text-zinc-500">Generate episode atau klik "Merge Audio"</p>
              </div>
            )}

            {/* Video Preview */}
            {videoUrl && (
              <div className="w-full mt-4">
                <p className="text-xs text-zinc-400 mb-2">🎬 Video Preview:</p>
                <video controls className="w-full max-h-64 rounded-lg bg-black" src={videoUrl}>
                  Browser tidak mendukung video player.
                </video>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-2 flex-wrap justify-center">
              <button
                onClick={onMergeAudio}
                disabled={!latestEpisode || isMerging || isLoading}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition"
              >
                {isMerging ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                    Merging...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">combine</span>
                    Merge Audio
                  </>
                )}
              </button>

              <button
                onClick={onRenderVideo}
                disabled={!latestEpisode || isRendering || isLoading}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition"
              >
                {isRendering ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                    Rendering...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">movie</span>
                    Render Video
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Episode Info */}
          {latestEpisode && (
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-900/50 p-2 rounded-lg border border-white/5">
                <p className="text-zinc-500">Episode ID</p>
                <p className="text-white font-mono">EP-{String(latestEpisode.id).padStart(3, '0')}</p>
              </div>
              <div className="bg-slate-900/50 p-2 rounded-lg border border-white/5">
                <p className="text-zinc-500">Segments</p>
                <p className="text-white font-bold">{latestEpisode.audio_segments?.length || 0}</p>
              </div>
              <div className="bg-slate-900/50 p-2 rounded-lg border border-white/5">
                <p className="text-zinc-500">Status</p>
                <p className={`font-bold ${
                  latestEpisode.status === "completed" ? "text-emerald-400" :
                  latestEpisode.status === "failed" ? "text-fuchsia-400" :
                  "text-indigo-400"
                }`}>
                  {latestEpisode.status?.toUpperCase() || "PENDING"}
                </p>
              </div>
            </div>
          )}
        </GlassPanel>

        {/* Processing Pipeline */}
        <GlassPanel className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">⚙️ Processing Pipeline</h3>
          <div className="space-y-3">
            {steps.map((step) => {
              const style = stepStyle[step.status] || stepStyle.pending;
              return (
                <div
                  key={step.label}
                  className={`flex items-center gap-3 p-2 rounded-lg transition ${
                    step.status === "processing" ? "bg-indigo-950/20 border border-indigo-500/20" :
                    step.status === "done" ? "bg-emerald-950/10" :
                    ""
                  }`}
                >
                  <span className={`material-symbols-outlined text-lg ${style.color}`}>
                    {style.icon}
                  </span>
                  <span className={`text-sm ${
                    step.status === "pending" ? "text-zinc-500" :
                    step.status === "processing" ? "text-indigo-300" :
                    "text-zinc-200"
                  }`}>
                    {step.label}
                  </span>
                  {step.status === "processing" && (
                    <span className="ml-auto text-xs text-indigo-400 animate-pulse">●</span>
                  )}
                  {step.status === "done" && (
                    <span className="ml-auto text-xs text-emerald-400">✓</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-3 bg-slate-900/50 rounded-xl border border-white/5">
            <p className="text-xs text-zinc-400">💡 Tips</p>
            <p className="text-xs text-zinc-500 mt-1">
              {!latestEpisode ? "Generate episode dulu di New Project" :
               !audioUrl ? "Klik 'Merge Audio' untuk menggabungkan semua segmen" :
               !videoUrl ? "Klik 'Render Video' untuk membuat MP4 dengan subtitle" :
               "✅ Selesai! Audio dan video siap."}
            </p>
          </div>
        </GlassPanel>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </DashboardLayout>
  );
}