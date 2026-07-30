// src/services/api.js

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://voxflow-backend-production.up.railway.app";

async function handleResponse(res, errorMessage) {
  if (!res.ok) {
    let detail = errorMessage;
    try {
      const errorData = await res.json();
      detail = errorData.detail || errorData.message || JSON.stringify(errorData) || errorMessage;
    } catch {
      detail = `${errorMessage} (Status: ${res.status})`;
    }
    throw new Error(detail);
  }
  return res.json();
}

function extractCleanFilename(raw) {
  if (!raw) return "";
  let value = raw;
  let previous;
  do {
    previous = value;
    try {
      value = decodeURIComponent(value);
    } catch {
      break;
    }
  } while (value !== previous);
  const segments = value.split("/").filter(Boolean);
  return segments[segments.length - 1] || "";
}

// GET /
export async function checkServerStatus() {
  const res = await fetch(`${API_BASE_URL}/`);
  return handleResponse(res, "Server tidak merespons");
}

export async function getHealthStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/`);
    return res.ok ? { status: "online" } : { status: "degraded" };
  } catch (err) {
    console.warn("Health check offline:", err.message);
    return { status: "offline" };
  }
}

// POST /api/v1/podcast/generate
export async function generatePodcast(keyword) {
  if (!keyword || !keyword.trim()) {
    throw new Error("Keyword tidak boleh kosong");
  }
  const params = new URLSearchParams({ keyword: keyword.trim() });
  const res = await fetch(`${API_BASE_URL}/api/v1/podcast/generate?${params.toString()}`, {
    method: "POST",
    headers: { Accept: "application/json" },
  });
  return handleResponse(res, "Gagal memulai pipeline podcast");
}

// GET /api/v1/podcast/history
export async function getPodcastHistory() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/podcast/history`);
    return await handleResponse(res, "Gagal mengambil riwayat podcast");
  } catch (err) {
    console.error("getPodcastHistory Error:", err);
    return { status: "error", total: 0, data: [] };
  }
}

// POST /api/v1/podcast/merge-audio
export async function mergeAudio(databaseId) {
  const res = await fetch(`${API_BASE_URL}/api/v1/podcast/merge-audio/${databaseId}`, {
    method: "POST",
  });
  return handleResponse(res, "Gagal menggabungkan audio");
}

// POST /api/v1/podcast/generate-video
export async function generateVideo(databaseId) {
  const res = await fetch(`${API_BASE_URL}/api/v1/podcast/generate-video/${databaseId}`, {
    method: "POST",
  });
  return handleResponse(res, "Gagal merender video");
}

// GET /api/v1/podcast/download/{filename}
export function getAudioDownloadUrl(filename) {
  const cleanName = extractCleanFilename(filename);
  if (!cleanName) return "";
  return `${API_BASE_URL}/api/v1/podcast/download/${cleanName}`;
}

// GET /api/v1/podcast/video/{video_filename}
export function getVideoStreamUrl(filename) {
  const cleanName = extractCleanFilename(filename);
  if (!cleanName) return "";
  return `${API_BASE_URL}/api/v1/podcast/video/${cleanName}`;
}

// POST /api/v1/podcast/upload-tiktok
export async function uploadToTikTok({ videoFilename, title, description, tags, cta }) {
  const res = await fetch(`${API_BASE_URL}/api/v1/podcast/upload-tiktok`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      video_filename: videoFilename,
      title,
      description,
      tags: tags || [],
      cta: cta || "Jangan lupa follow!",
    }),
  });
  return handleResponse(res, "Gagal upload ke TikTok");
}