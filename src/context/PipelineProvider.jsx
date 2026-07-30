import { useState, useEffect, useCallback, useRef } from "react";
import { PipelineContext } from "./PipelineContext";
import {
  generatePodcast,
  getPodcastHistory,
  getHealthStatus,
  getJobStatus,
  getAudioDownloadUrl,
  getVideoStreamUrl,
  mergeAudio,
  generateVideo,
  publishToTikTok
} from "../services/api";

// ============================================================
// NORMALISASI STATUS AGENT DARI BACKEND
// ============================================================
function normalizeAgentStatus(rawStatus) {
  const s = String(rawStatus || "").trim().toLowerCase();

  if (["running", "processing", "in_progress", "active", "started", "uploading"].includes(s)) {
    return "processing";
  }
  if (["done", "success", "completed", "complete", "finished", "ok"].includes(s)) {
    return "completed";
  }
  if (["failed", "error", "failure"].includes(s)) {
    return "error";
  }
  return "idle";
}

// Key "metadata" (SEO metadata agent) dan "tiktok" (upload/publish) DIPISAH.
// Sebelumnya keduanya dipetakan ke key "metadata" yang sama, jadi kartu
// "TikTok Publisher" di UI sebenarnya cuma menampilkan status metadata agent,
// bukan status publish TikTok yang sebenarnya.
const AGENT_KEY_CANDIDATES = {
  research: ["research", "research_agent", "researcher"],
  script: ["script", "script_agent", "scriptwriter", "dialogue", "dialogue_agent"],
  audio: ["audio", "audio_agent", "audio_engine"],
  metadata: ["metadata", "metadata_agent", "seo"],
  tiktok: ["tiktok", "tiktok_agent", "publisher", "distribution", "publish"],
};

function getRawAgentStatus(agentStatusObj, agentKey) {
  if (!agentStatusObj) return undefined;
  const candidates = AGENT_KEY_CANDIDATES[agentKey] || [agentKey];
  for (const key of candidates) {
    if (agentStatusObj[key] !== undefined) return agentStatusObj[key];
  }
  return undefined;
}

function defaultAgentsState() {
  return [
    { id: 1, key: "research", name: "Research Engine", role: "Crawler & Topic Expansion", status: "idle", progress: 0 },
    { id: 2, key: "script", name: "Dialogue Scriptwriter", role: "Multi-speaker Script Generation", status: "idle", progress: 0 },
    { id: 3, key: "audio", name: "Audio Engine", role: "TTS ElevenLabs & BGM Mixing", status: "idle", progress: 0 },
    { id: 4, key: "metadata", name: "Metadata & Distribution", role: "SEO Title, Tags & Description", status: "idle", progress: 0 },
    { id: 5, key: "tiktok", name: "TikTok Publisher", role: "Merge, Render & Auto-Upload", status: "idle", progress: 0 },
  ];
}

export function PipelineProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [systemHealth, setSystemHealth] = useState(null);
  const [currentJob, setCurrentJob] = useState(null);
  const [updateCounter, setUpdateCounter] = useState(0);
  const pollingIntervalRef = useRef(null);

  const [agentsState, setAgentsState] = useState(defaultAgentsState());

  const resetAgents = useCallback(() => {
    console.log("[RESET] Resetting agents...");
    setAgentsState(defaultAgentsState());
    setUpdateCounter(prev => prev + 1);
  }, []);

  const getLatestEpisode = useCallback(() => {
    const data = Array.isArray(history) ? history : [];
    return data.length > 0 ? data[data.length - 1] : null;
  }, [history]);

  const forceUpdateAgents = useCallback(() => {
    console.log("[FORCE UPDATE] 🔄 Force updating agents from history...");
    const latest = getLatestEpisode();

    if (latest) {
      if (latest.status === "completed") {
        setAgentsState(prev => {
          const allCompleted = prev.every(a => a.status === "completed" && a.progress === 100);
          if (allCompleted) return prev;
          const newState = prev.map(agent => ({
            ...agent,
            status: "completed",
            progress: 100
          }));
          console.log("[FORCE UPDATE] ✅ All agents set to COMPLETED");
          return newState;
        });
      } else if (latest.status === "processing") {
        setAgentsState(prev => {
          if (prev[0]?.status === "processing") return prev;
          const newState = [...prev];
          if (newState[0]) {
            newState[0].status = "processing";
            newState[0].progress = 30;
          }
          console.log("[FORCE UPDATE] ⏳ Research agent set to PROCESSING");
          return newState;
        });
      }
    } else {
      console.log("[FORCE UPDATE] ℹ️ No episode found");
    }
  }, [getLatestEpisode]);

  const fetchHistory = useCallback(async () => {
    try {
      const data = await getPodcastHistory();
      const historyData = data?.data || [];
      setHistory(historyData);

      if (historyData.length > 0) {
        const latest = historyData[historyData.length - 1];
        if (latest.status === "completed") {
          setAgentsState(prev => {
            const newState = prev.map(agent => ({ ...agent, status: "completed", progress: 100 }));
            setUpdateCounter(prev => prev + 1);
            return newState;
          });
        } else if (latest.status === "processing") {
          setAgentsState(prev => {
            const newState = [...prev];
            if (newState[0]) {
              newState[0].status = "processing";
              newState[0].progress = 30;
            }
            setUpdateCounter(prev => prev + 1);
            return newState;
          });
        }
      }

      return historyData;
    } catch (err) {
      console.error("Gagal mengambil history:", err);
      setHistory([]);
      return [];
    }
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      const health = await getHealthStatus();
      setSystemHealth(health);
    } catch {
      setSystemHealth({ status: "offline" });
    }
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      console.log("[POLLING] ⏹️ Polling stopped");
    }
  }, []);

  const pollJobStatus = useCallback(async (jobId) => {
    try {
      const status = await getJobStatus(jobId);

      console.log("[POLLING] 📡 Status received:", {
        jobId: status.id,
        status: status.status,
        progress: status.progress,
        agent_status: status.agent_status,
        tiktok_status: status.tiktok_status,
        hasVideo: !!status.video_url,
        hasAudio: !!status.audio_url,
      });

      if (status.agent_status) {
        setAgentsState(prev => {
          const newState = prev.map(agent => {
            const rawStatus = getRawAgentStatus(status.agent_status, agent.key);
            const newStatus = normalizeAgentStatus(rawStatus);

            let progress = 0;
            if (newStatus === "processing") progress = status.progress || 50;
            else if (newStatus === "completed") progress = 100;

            return { ...agent, status: newStatus, progress };
          });
          return newState;
        });
      }

      // Selalu simpan status/url/error TikTok terbaru ke currentJob,
      // bukan hanya saat job sudah "completed" -- supaya UI bisa
      // menampilkan "uploading..." secara real-time.
      setCurrentJob(prev => ({
        ...prev,
        id: jobId,
        status: status.status,
        tiktokStatus: status.tiktok_status,
        tiktokUrl: status.tiktok_url,
        tiktokError: status.tiktok_error,
      }));

      if (status.status === "completed") {
        console.log("[POLLING] ✅ Pipeline completed! 🎉");

        setAgentsState(prev => {
          const newState = prev.map(agent => ({ ...agent, status: "completed", progress: 100 }));
          setUpdateCounter(prev => prev + 1);
          return newState;
        });

`       setCurrentJob(null);`

        stopPolling();
        setIsLoading(false);
        await fetchHistory();



      } else if (status.status === "failed") {
        console.log("[POLLING] ❌ Pipeline failed!");

        setAgentsState(prev => {
          const newState = prev.map(agent => ({ ...agent, status: "error", progress: 0 }));
          setUpdateCounter(prev => prev + 1);
          return newState;
        });

        stopPolling();
        setIsLoading(false);
        setCurrentJob(prev => ({ ...prev, status: "failed", error: status.error_message }));
      }

      return status;
    } catch (error) {
      console.error("[POLLING] ❌ Error:", error);
      return null;
    }
  }, [fetchHistory, stopPolling]);

  const startPolling = useCallback((jobId) => {
    console.log("[START POLLING] 🚀 Starting for job:", jobId);

    stopPolling();
    setCurrentJob({ id: jobId, status: "processing" });
    resetAgents();

    setTimeout(() => {
      setAgentsState(prev => {
        const newState = [...prev];
        if (newState[0]) {
          newState[0].status = "processing";
          newState[0].progress = 10;
        }
        setUpdateCounter(prev => prev + 1);
        return newState;
      });
    }, 100);

    pollingIntervalRef.current = setInterval(async () => {
      await pollJobStatus(jobId);
    }, 2000);
  }, [pollJobStatus, stopPolling, resetAgents]);

  const triggerGenerate = useCallback(async (keyword, options = {}) => {
    console.log("[TRIGGER] 🚀 Generating for keyword:", keyword, "options:", options);
    setIsLoading(true);
    resetAgents();

    try {
      const result = await generatePodcast(keyword, options);
      if (result.job_id) {
        startPolling(result.job_id);
        return result;
      } else {
        throw new Error("Tidak ada job_id dari backend");
      }
    } catch (error) {
      console.error("[TRIGGER] ❌ Error:", error);
      setIsLoading(false);
      setAgentsState(prev => prev.map(a =>
        a.status === "processing" ? { ...a, status: "error", progress: 0 } : a
      ));
      throw error;
    }
  }, [startPolling, resetAgents]);

  const handleMergeAudio = useCallback(async (id) => {
    try {
      const result = await mergeAudio(id);
      await fetchHistory();
      return result;
    } catch (error) {
      console.error("[MERGE ERROR]", error);
      throw error;
    }
  }, [fetchHistory]);

  const handleGenerateVideo = useCallback(async (id) => {
    try {
      const result = await generateVideo(id);
      await fetchHistory();
      return result;
    } catch (error) {
      console.error("[VIDEO ERROR]", error);
      throw error;
    }
  }, [fetchHistory]);

  // ============================================================
  // PUBLISH / RETRY PUBLISH KE TIKTOK
  // ============================================================
  // Upload TikTok normalnya sudah otomatis di backend setelah pipeline
  // selesai. Fungsi ini dipakai untuk retry manual kalau auto-publish
  // gagal (misal webhook TikTok sempat down).
  const handlePublishToTikTok = useCallback(async (id) => {
    try {
      setCurrentJob(prev => ({ ...prev, tiktokStatus: "uploading" }));
      const result = await publishToTikTok(id);
      setCurrentJob(prev => ({
        ...prev,
        tiktokStatus: result.status,
        tiktokUrl: result.tiktok_url,
        tiktokError: result.error,
      }));
      await fetchHistory();
      return result;
    } catch (error) {
      console.error("[TIKTOK PUBLISH ERROR]", error);
      setCurrentJob(prev => ({ ...prev, tiktokStatus: "failed", tiktokError: error.message }));
      throw error;
    }
  }, [fetchHistory]);

  const handleRetry = useCallback(async (id, keyword) => {
    try {
      setIsLoading(true);
      const result = await generatePodcast(keyword);
      if (result.job_id) {
        startPolling(result.job_id);
      }
      return result;
    } catch (error) {
      console.error("[RETRY ERROR]", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [startPolling]);

  const getQueue = useCallback(() => {
    const data = Array.isArray(history) ? history : [];
    return data.filter(item => item.status === "processing" || item.status === "pending");
  }, [history]);

  const getStatistics = useCallback(() => {
    const data = Array.isArray(history) ? history : [];
    const total = data.length;
    const published = data.filter(item => item.tiktok_status === "success").length;
    const failed = data.filter(item => item.status === "failed").length;
    const queue = data.filter(item => item.status === "processing" || item.status === "pending").length;
    const successRate = total > 0 ? Math.round(((total - failed) / total) * 100) : 0;
    return { total, published, failed, queue, successRate };
  }, [history]);

  useEffect(() => {
    if (history.length > 0) {
      const latest = history[history.length - 1];
      if (latest.status === "completed") {
        setAgentsState(prev => {
          const newState = prev.map(agent => ({ ...agent, status: "completed", progress: 100 }));
          setUpdateCounter(prev => prev + 1);
          return newState;
        });
      }
    }
  }, [history]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchHistory(), checkHealth()]);
    };
    init();
  }, []);

  const value = {
    history,
    isLoading,
    systemHealth,
    agentsState,
    currentJob,
    triggerGenerate,
    fetchHistory,
    checkHealth,
    getAudioDownloadUrl,
    getVideoStreamUrl,
    getLatestEpisode,
    getQueue,
    getStatistics,
    handleMergeAudio,
    handleGenerateVideo,
    handlePublishToTikTok,
    handleRetry,
    resetAgents,
    stopPolling,
    forceUpdateAgents,
    updateCounter,
  };

  return (
    <PipelineContext.Provider value={value}>
      {children}
    </PipelineContext.Provider>
  );
}