const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Helper internal untuk menangani error response dari fetch
 */
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

// 1. Cek Server Status — GET /
export async function checkServerStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/`);
    return await handleResponse(res, "Server tidak merespons");
  } catch (err) {
    console.error("checkServerStatus Error:", err);
    throw err;
  }
}

// 2. Health Check Endpoint Internal
export async function getHealthStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/`);
    return res.ok ? { status: "online" } : { status: "degraded" };
  } catch (err) {
    console.warn("Health check offline:", err.message);
    return { status: "offline" };
  }
}

// 3. Trigger Pipeline Podcast — POST /api/v1/podcast/generate?keyword=...&language=...&tone=...&voice=...
// CATATAN: sebelumnya fungsi ini menerima (keyword, hostCount, languageStyle)
// tapi backend endpoint-nya cuma menerima "keyword" -- jadi host_count dan
// language_style yang dikirim selalu diabaikan diam-diam oleh FastAPI karena
// tidak dideklarasikan di endpoint. Sekarang disamakan persis dengan
// parameter yang benar-benar diterima backend: language, tone, voice.
export async function generatePodcast(keyword, options = {}) {
  if (!keyword || !keyword.trim()) {
    throw new Error("Keyword tidak boleh kosong");
  }

  const {
    language = "indonesian",
    tone = "professional",
    voice = "mixed",
  } = options;

  const params = new URLSearchParams({
    keyword: keyword.trim(),
    language,
    tone,
    voice,
  });

  const url = `${API_BASE_URL}/api/v1/podcast/generate?${params.toString()}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "application/json",
    },
  });

  return handleResponse(res, "Gagal memulai pipeline podcast");
}

// 4. Ambil Riwayat Podcast — GET /api/v1/podcast/history
export async function getPodcastHistory() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/podcast/history`);
    return await handleResponse(res, "Gagal mengambil riwayat podcast");
  } catch (err) {
    console.error("getPodcastHistory Error:", err);
    return [];
  }
}

// 5. Cek status job — GET /api/v1/podcast/status/{job_id}
export async function getJobStatus(jobId) {
  const res = await fetch(`${API_BASE_URL}/api/v1/podcast/status/${jobId}`);
  return handleResponse(res, "Gagal mengambil status job");
}

// 6. Helper URL Audio — GET /api/v1/podcast/download/{filename}
export function getAudioDownloadUrl(filename) {
  if (!filename) return "";
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }
  return `${API_BASE_URL}/api/v1/podcast/download/${encodeURIComponent(filename)}`;
}

// 7. Helper URL Video — GET /api/v1/podcast/video/{video_filename}
export function getVideoStreamUrl(videoFilename) {
  if (!videoFilename) return "";
  if (videoFilename.startsWith("http://") || videoFilename.startsWith("https://")) {
    return videoFilename;
  }
  return `${API_BASE_URL}/api/v1/podcast/video/${encodeURIComponent(videoFilename)}`;
}

// 8. Merge Audio manual — POST /api/v1/podcast/merge-audio/{id}
export async function mergeAudio(id) {
  const res = await fetch(`${API_BASE_URL}/api/v1/podcast/merge-audio/${id}`, {
    method: "POST",
  });
  return handleResponse(res, "Gagal menggabungkan audio");
}

// 9. Generate Video manual — POST /api/v1/podcast/generate-video/{id}
export async function generateVideo(id) {
  const res = await fetch(`${API_BASE_URL}/api/v1/podcast/generate-video/${id}`, {
    method: "POST",
  });
  return handleResponse(res, "Gagal merender video");
}

// 10. Publish / retry publish ke TikTok — POST /api/v1/podcast/publish-tiktok/{id}
// Upload TikTok normalnya jalan OTOMATIS di backend setelah pipeline selesai.
// Fungsi ini dipakai untuk retry manual kalau auto-publish gagal, tanpa perlu
// generate ulang dari awal.
export async function publishToTikTok(id) {
  const res = await fetch(`${API_BASE_URL}/api/v1/podcast/publish-tiktok/${id}`, {
    method: "POST",
  });
  return handleResponse(res, "Gagal publish ke TikTok");
}