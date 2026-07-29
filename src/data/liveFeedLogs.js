export const liveFeedLogs = [
  { time: "14:32:01", agent: "Research Engine", message: "Started scraping trend data from Reddit, X, and news portals.", type: "info" },
  { time: "14:32:45", agent: "Research Engine", message: "8 relevant articles found and filtered for accuracy.", type: "success" },
  { time: "14:33:02", agent: "Dialogue Scriptwriter", message: "Started generating dialogue script from research data.", type: "info" },
  { time: "14:33:40", agent: "Dialogue Scriptwriter", message: "Host A opening line generated.", type: "info" },
  { time: "14:34:12", agent: "Dialogue Scriptwriter", message: "Refining host transition for Segment 3...", type: "info" },
  { time: "14:34:20", agent: "Audio Production", message: "Waiting for script finalization before starting voice synthesis.", type: "pending" },
  { time: "14:34:25", agent: "Metadata & Distribution", message: "Queued for SEO title and description generation.", type: "pending" },
  { time: "14:34:30", agent: "TikTok Publisher", message: "Waiting for final audio and metadata.", type: "pending" },
];

export const logTypeColor = {
  info: "text-indigo-400",
  success: "text-cyan-400",
  pending: "text-zinc-500",
  error: "text-fuchsia-400",
};