import { useState, useEffect, useCallback } from "react";
import { PipelineContext } from "./PipelineContext";
import { generatePodcast, getPodcastHistory, getHealthStatus, mergeAudio, generateVideo, uploadToTikTok } from "../services/api";

function defaultAgentsState() {
  return [
    { id: 1, name: "Research Engine", role: "Crawler & Topic Expansion", status: "idle" },
    { id: 2, name: "Dialogue Scriptwriter", role: "Multi-speaker Script Generation", status: "idle" },
    { id: 3, name: "Metadata & SEO", role: "Judul, Deskripsi, Tags Multi-platform", status: "idle" },
    { id: 4, name: "Audio Engine", role: "TTS ElevenLabs per Segmen", status: "idle" },
  ];
}

export function PipelineProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [systemHealth, setSystemHealth] = useState(null);
  const [agentsState, setAgentsState] = useState(defaultAgentsState());

  const fetchHistory = useCallback(async () => {
    const response = await getPodcastHistory();
    setHistory(response.data || []);
    return response.data || [];
  }, []);

  const checkHealth = useCallback(async () => {
    const health = await getHealthStatus();
    setSystemHealth(health);
  }, []);

  const getLatestEpisode = useCallback(() => {
    return history.length > 0 ? history[history.length - 1] : null;
  }, [history]);

  // Backend SINKRON: request ini nunggu sampai SELURUH pipeline selesai
  // (bisa lama). Karena tidak ada job_id/status granular dari backend,
  // semua agent ditandai "processing" bareng selama nunggu, lalu
  // "completed" bareng begitu response balik.
  const triggerGenerate = useCallback(async (keyword) => {
    setIsLoading(true);
    setAgentsState((prev) => prev.map((a) => ({ ...a, status: "processing" })));

    try {
      const result = await generatePodcast(keyword);
      setAgentsState((prev) => prev.map((a) => ({ ...a, status: "completed" })));
      await fetchHistory();
      return result;
    } catch (error) {
      setAgentsState((prev) => prev.map((a) => ({ ...a, status: "error" })));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchHistory]);

  const handleMergeAudio = useCallback(async (id) => {
    const result = await mergeAudio(id);
    await fetchHistory();
    return result;
  }, [fetchHistory]);

  const handleGenerateVideo = useCallback(async (id) => {
    const result = await generateVideo(id);
    await fetchHistory();
    return result;
  }, [fetchHistory]);

  const handlePublishToTikTok = useCallback(async (payload) => {
    const result = await uploadToTikTok(payload);
    await fetchHistory();
    return result;
  }, [fetchHistory]);

  useEffect(() => {
    Promise.all([fetchHistory(), checkHealth()]);
  }, [fetchHistory, checkHealth]);

  const value = {
    history,
    isLoading,
    systemHealth,
    agentsState,
    triggerGenerate,
    fetchHistory,
    getLatestEpisode,
    handleMergeAudio,
    handleGenerateVideo,
    handlePublishToTikTok,
  };

  return <PipelineContext.Provider value={value}>{children}</PipelineContext.Provider>;
}