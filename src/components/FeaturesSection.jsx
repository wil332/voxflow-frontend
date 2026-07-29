import GlassPanel from "./GlassPanel";

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-zinc-900/40">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <GlassPanel className="lg:col-span-8 p-10 relative overflow-hidden">
          <div className="bg-indigo-400/20 text-indigo-400 px-3 py-1 rounded-full w-fit text-xs mb-6">
            PREMIUM FEATURE
          </div>
          <h3 className="text-3xl font-semibold mb-4">Multi-Agent AI Studio</h3>
          <p className="text-zinc-400 max-w-md mb-8">
            Collaborate with multiple specialized AI agents. One researches, one writes, and one
            fact-checks simultaneously to ensure accuracy and engagement.
          </p>
          <button className="text-indigo-400 font-bold flex items-center gap-2 hover:translate-x-1 transition-transform">
            Learn more about Agents <span className="material-symbols-outlined">north_east</span>
          </button>
        </GlassPanel>

        <GlassPanel className="lg:col-span-4 p-8 flex flex-col justify-between hover:border-indigo-400/50 transition-colors">
          <div>
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-cyan-400">graphic_eq</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Auto SEO &amp; Meta</h3>
            <p className="text-zinc-400 text-sm">
              Auto-generated titles, tags, and show notes optimized for podcast search engines.
            </p>
          </div>
        </GlassPanel>

        <GlassPanel className="lg:col-span-4 p-8 flex flex-col justify-between hover:border-indigo-400/50 transition-colors">
          <div>
            <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-indigo-400">waves</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Noise Cancellation</h3>
            <p className="text-zinc-400 text-sm">
              Studio quality audio even in a coffee shop. AI removes background hum and echo in one tap.
            </p>
          </div>
        </GlassPanel>

        <GlassPanel className="lg:col-span-8 p-10 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <h3 className="text-2xl font-semibold mb-4">ElevenLabs Powered</h3>
            <p className="text-zinc-400">
              Industry leading voice cloning that captures the subtle nuances of your personality.
              No robotic tones — just pure, professional audio.
            </p>
          </div>
          <div className="md:w-1/2 p-6 rounded-2xl border border-white/10 bg-zinc-950/40">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">play_arrow</span>
              </div>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-indigo-400 animate-pulse" />
              </div>
            </div>
            <p className="text-sm text-indigo-400 italic">
              "Welcome back to the Tech Mindset podcast..."
            </p>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
