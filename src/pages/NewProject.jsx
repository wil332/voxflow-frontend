import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import GlassPanel from "../components/GlassPanel";
import { usePipeline } from "../context/usePipeline";
import { validateTopic } from "../utils/validation";

export default function NewProject() {
  const [keyword, setKeyword] = useState("");
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("indonesian");
  const [tone, setTone] = useState("professional");
  const [voice, setVoice] = useState("mixed");
  const [duration, setDuration] = useState("5-10");
  const [platform, setPlatform] = useState(["spotify"]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { triggerGenerate, isLoading } = usePipeline();
  const navigate = useNavigate();


  // ============================================================
  // DEBUG: Pantau perubahan isLoading
  // ============================================================
  useEffect(() => {
    console.log("[NEWPROJECT] Loading state:", isLoading);
  }, [isLoading]);

  // ============================================================
  // DEBUG: Pantau perubahan keyword
  // ============================================================
  useEffect(() => {
    console.log("[NEWPROJECT] Keyword:", keyword);
  }, [keyword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi keyword
    const validationError = validateTopic(keyword);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      // Panggil API generate
      const result = await triggerGenerate({
    keyword,
    language,
    tone,
    voice,
    duration,
    platforms: platform
});
      console.log("[NewProject] Generate result:", result);

      // Navigasi ke Dashboard dengan state
      navigate("/dashboard", {
        state: {
          jobStarted: true,
          keyword,
          jobId: result?.job_id
        }
      });
    } catch (err) {
      console.error("[NewProject] Error:", err);
      alert("❌ Gagal memproses podcast: " + (err.message || "Unknown error"));
      setError(err.message || "Gagal memulai pipeline");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real-time validation on change
  const handleKeywordChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    // Hapus error saat user mengetik
    if (error) {
      const validation = validateTopic(value);
      if (!validation) setError(null);
    }
  };

  // Validation on blur
  const handleKeywordBlur = () => {
    const validationError = validateTopic(keyword);
    setError(validationError);
  };

  // Toggle platform selection
  const togglePlatform = (plat) => {
    setPlatform(prev =>
      prev.includes(plat) ? prev.filter(p => p !== plat) : [...prev, plat]
    );
  };

  return (
    <DashboardLayout title="New Project" breadcrumb="Generative Pipeline">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Utama */}
        <GlassPanel className="lg:col-span-2 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-indigo-400 text-2xl">auto_awesome</span>
            <h3 className="text-xl font-semibold text-white">Create New Podcast</h3>
          </div>
          <p className="text-sm text-zinc-400 mb-6">
            Isi detail podcast yang ingin dibuat. AI akan menangani riset, naskah, audio, dan video secara otomatis.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Title & Topic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Podcast Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul podcast..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Topic (Wajib) */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Topic <span className="text-fuchsia-400">*</span>
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={handleKeywordChange}
                  onBlur={handleKeywordBlur}
                  placeholder="misal: AI Inovasi Kesehatan 2026"
                  className={`w-full bg-slate-900 border rounded-xl px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition ${
                    error ? "border-fuchsia-400/60" : "border-white/10"
                  }`}
                />
                {error && (
                  <p className="text-fuchsia-400 text-xs mt-1.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {error}
                  </p>
                )}
                <p className="text-[10px] text-zinc-500 mt-1">
                  Minimal 5 karakter, maksimal 120 karakter
                </p>
              </div>
            </div>

            {/* Row 2: Language, Tone, Voice */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Language */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="indonesian">🇮🇩 Indonesian</option>
                  <option value="english">🇬🇧 English</option>
                  <option value="sunda">🌾 Sunda</option>
                  <option value="jawa">🌾 Jawa</option>
                </select>
              </div>

              {/* Tone */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="professional">💼 Professional</option>
                  <option value="casual">😊 Casual</option>
                  <option value="humorous">😂 Humorous</option>
                  <option value="inspirational">🌟 Inspirational</option>
                  <option value="educational">📚 Educational</option>
                </select>
              </div>

              {/* Voice */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Voice</label>
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="male">👨 Male (Budi)</option>
                  <option value="female">👩 Female (Richel)</option>
                  <option value="mixed">👫 Mixed (Budi & Richel)</option>
                </select>
              </div>
            </div>

            {/* Row 3: Duration & Platform */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Duration */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="3-5">⏱️ 3-5 minutes</option>
                  <option value="5-10">⏱️ 5-10 minutes</option>
                  <option value="10-15">⏱️ 10-15 minutes</option>
                  <option value="15-20">⏱️ 15-20 minutes</option>
                </select>
              </div>

              {/* Platform */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Platform</label>
                <div className="flex gap-2 flex-wrap">
                  {["spotify", "youtube", "tiktok", "apple"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        platform.includes(p)
                          ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                          : "bg-white/5 text-zinc-500 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">
                  {platform.length} platform selected
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSubmitting || !keyword.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {isLoading || isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                  <span>AI Agents Working...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  <span>🚀 Generate Podcast</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-4 text-[10px] text-zinc-500 justify-center">
              <span>⚡ AI Research → Script → Audio → Video</span>
              <span className="w-px h-3 bg-white/10" />
              <span>⏱️ ~1-3 minutes</span>
              <span className="w-px h-3 bg-white/10" />
              <span>🎯 Multi-platform ready</span>
            </div>
          </form>
        </GlassPanel>

        {/* Info Sidebar */}
        <GlassPanel className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">💡 Quick Guide</h3>

          <div className="space-y-4 text-sm">
            {/* Tip 1 */}
            <div className="p-3 bg-slate-900/50 rounded-xl border border-white/5">
              <p className="text-zinc-400 font-semibold flex items-center gap-2">
                <span>📝</span> Best Topic
              </p>
              <p className="text-zinc-500 text-xs mt-1">
                Gunakan keyword spesifik untuk hasil riset lebih akurat dan mendalam.
              </p>
            </div>

            {/* Tip 2 */}
            <div className="p-3 bg-slate-900/50 rounded-xl border border-white/5">
              <p className="text-zinc-400 font-semibold flex items-center gap-2">
                <span>🎤</span> Voice Selection
              </p>
              <p className="text-zinc-500 text-xs mt-1">
                Pilih "Mixed" untuk dialog dua host (Budi & Richel) yang lebih natural.
              </p>
            </div>

            {/* Tip 3 */}
            <div className="p-3 bg-slate-900/50 rounded-xl border border-white/5">
              <p className="text-zinc-400 font-semibold flex items-center gap-2">
                <span>📱</span> Platform Support
              </p>
              <p className="text-zinc-500 text-xs mt-1">
                Metadata dioptimalkan untuk SEO di setiap platform yang dipilih.
              </p>
            </div>

            {/* Note */}
            <div className="p-3 bg-amber-950/20 rounded-xl border border-amber-500/20">
              <p className="text-amber-400 font-semibold flex items-center gap-2">
                <span>⚡</span> Note
              </p>
              <p className="text-zinc-400 text-xs mt-1">
                Parameter tambahan (voice, duration, platform) akan diaktifkan sepenuhnya di update berikutnya.
                Saat ini semua parameter dikirim dengan value default ke backend.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-zinc-500">Pipeline Summary</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-slate-900/50 p-2 rounded-lg">
                <p className="text-[10px] text-zinc-500">Research</p>
                <p className="text-xs text-zinc-300">Qwen AI</p>
              </div>
              <div className="bg-slate-900/50 p-2 rounded-lg">
                <p className="text-[10px] text-zinc-500">Script</p>
                <p className="text-xs text-zinc-300">Agnes AI</p>
              </div>
              <div className="bg-slate-900/50 p-2 rounded-lg">
                <p className="text-[10px] text-zinc-500">Audio</p>
                <p className="text-xs text-zinc-300">ElevenLabs</p>
              </div>
              <div className="bg-slate-900/50 p-2 rounded-lg">
                <p className="text-[10px] text-zinc-500">Video</p>
                <p className="text-xs text-zinc-300">FFmpeg</p>
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>
    </DashboardLayout>
  );
}