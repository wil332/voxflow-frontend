export const agents = [
  {
    id: "research",
    icon: "travel_explore",
    name: "Research Engine",
    tag: "Qwen 2.5",
    note: "Topic extraction and cross-referencing complete.",
    status: "done",
    updated: "2m ago",
    progress: null,
    resultUrl: null,
  },
  {
    id: "script",
    icon: "edit_note",
    name: "Dialogue Scriptwriter",
    tag: "Agnes AI",
    note: "Refining host transition for Segment 3...",
    status: "processing",
    updated: "Just now",
    progress: 74,
    resultUrl: null,
  },
  {
    id: "audio",
    icon: "equalizer",
    name: "Audio Production",
    tag: "ElevenLabs + FFmpeg",
    note: "Waiting for script finalization.",
    status: "pending",
    updated: "--",
    progress: null,
    resultUrl: null,
  },
  {
    id: "distribution",
    icon: "share",
    name: "Metadata & Distribution",
    tag: "Auto-Publisher",
    note: "Queue position: #42",
    status: "pending",
    updated: "--",
    progress: null,
    resultUrl: null,
  },
  {
    id: "tiktok",
    icon: "music_video",
    name: "TikTok Publisher",
    tag: "TikTok Content API",
    note: "Waiting for final audio and metadata.",
    status: "pending",
    updated: "--",
    progress: null,
    // resultUrl diisi backend begitu upload berhasil, dipakai buat tombol "View on TikTok"
    resultUrl: null,
  },
];

export const statusStyle = {
  done: { label: "Done", icon: "check_circle", classes: "text-cyan-400 bg-cyan-400/10" },
  processing: { label: "Processing", icon: "sync", classes: "text-indigo-400 bg-indigo-400/10 animate-pulse" },
  pending: { label: "Pending", icon: "schedule", classes: "text-zinc-400 bg-white/5" },
  failed: { label: "Failed", icon: "error", classes: "text-fuchsia-400 bg-fuchsia-400/10" },
};

export const sidebarLinks = [
  { path: "/dashboard", icon: "dashboard", label: "Overview" },
  { path: "/dashboard/live-feed", icon: "sensors", label: "Live Feed" },
  { path: "/dashboard/audio-engine", icon: "settings_voice", label: "Audio Engine" },
  { path: "/dashboard/analytics", icon: "leaderboard", label: "Analytics" },
  { path: "/dashboard/settings", icon: "settings", label: "Settings" },
];