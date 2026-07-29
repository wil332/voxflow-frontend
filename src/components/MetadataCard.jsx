import GlassPanel from "./GlassPanel";

export default function MetadataCard({ metadata }) {
  // Jika metadata tidak ada atau kosong, tampilkan placeholder
  if (!metadata) {
    return (
      <GlassPanel className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📝 Generated Metadata (SEO)</h3>
        <p className="text-sm text-zinc-500 text-center py-4">
          Belum ada metadata. Generate episode terlebih dahulu.
        </p>
      </GlassPanel>
    );
  }

  // Ekstrak data dari metadata dengan fallback
  const {
    title = "Untitled Episode",
    description = "No description available",
    tags = [],
    target_audience = "General audience",
    cta = "Subscribe and share!",
    // Untuk kompatibilitas dengan struktur Spotify/TikTok
    spotify,
    tiktok
  } = metadata;

  // Jika metadata menggunakan struktur Spotify/TikTok (dari backend yang sudah diperbaiki)
  const spotifyData = spotify || null;
  const tiktokData = tiktok || null;

  // Jika ada struktur spotify/tiktok, gunakan itu
  const hasStructuredMetadata = !!(spotifyData || tiktokData);

  return (
    <GlassPanel className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">📝 Generated Metadata (SEO)</h3>

      {hasStructuredMetadata ? (
        // Tampilan dengan struktur Spotify & TikTok
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Spotify Metadata */}
          {spotifyData && (
            <div className="p-4 bg-emerald-950/10 rounded-xl border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-emerald-400 text-sm font-bold">🎵</span>
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wide">Spotify</span>
              </div>
              <p className="text-sm font-semibold text-zinc-100 mt-2">{spotifyData.episode_title || title}</p>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-3">{spotifyData.show_notes || description}</p>
              {spotifyData.tags && spotifyData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {spotifyData.tags.map((tag) => (
                    <span key={tag} className="text-[10px] bg-white/5 text-zinc-400 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TikTok Metadata */}
          {tiktokData && (
            <div className="p-4 bg-fuchsia-950/10 rounded-xl border border-fuchsia-500/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-fuchsia-400 text-sm font-bold">🎬</span>
                <span className="text-xs text-fuchsia-400 font-bold uppercase tracking-wide">TikTok</span>
              </div>
              <p className="text-sm font-semibold text-zinc-100 mt-2">{tiktokData.title || title}</p>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-3">{tiktokData.description || description}</p>
              {tiktokData.tags && tiktokData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tiktokData.tags.map((tag) => (
                    <span key={tag} className="text-[10px] bg-white/5 text-zinc-400 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // Tampilan flat (metadata biasa dari metadata_agent.py)
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <span className="text-xs text-cyan-400 font-bold uppercase tracking-wide">Title</span>
            <p className="text-sm font-semibold text-zinc-100 mt-1">{title}</p>

            <span className="text-xs text-cyan-400 font-bold uppercase tracking-wide block mt-4">Description</span>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-4">{description}</p>

            <span className="text-xs text-cyan-400 font-bold uppercase tracking-wide block mt-4">Target Audience</span>
            <p className="text-xs text-zinc-400 mt-1">{target_audience}</p>
          </div>

          {/* Right Column */}
          <div>
            <span className="text-xs text-fuchsia-400 font-bold uppercase tracking-wide">Tags</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags && tags.length > 0 ? (
                tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-white/5 text-zinc-400 px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-zinc-500">No tags</span>
              )}
            </div>

            <span className="text-xs text-fuchsia-400 font-bold uppercase tracking-wide block mt-4">Call to Action (CTA)</span>
            <p className="text-xs text-zinc-400 mt-1 italic">"{cta}"</p>

            {/* Preview Card */}
            <div className="mt-4 p-3 bg-slate-900/50 rounded-xl border border-white/5">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Preview</p>
              <p className="text-xs text-zinc-300 mt-1 line-clamp-2">
                {title} — {description.slice(0, 80)}...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer / Info */}
      <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-[10px] text-zinc-500">
        <span>Generated by AI Metadata Engine</span>
        <span>SEO Optimized</span>
      </div>
    </GlassPanel>
  );
}