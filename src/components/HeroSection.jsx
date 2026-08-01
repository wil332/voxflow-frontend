import { Link } from "react-router-dom";
import GlassPanel from "./GlassPanel";

export default function HeroSection({
  badge = "V2.0 RELEASED: MULTI-AGENT COLLABORATION",
  headline = "Your Podcast,",
  headlineAccent = "Fully Autonomous.",
  subheadline = "The first AI production house that handles research, high-fidelity script generation, voice cloning, and global distribution. Record once, reach everywhere.",
}) {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-400/5 via-transparent to-transparent" />
        <div className="h-full w-full flex items-center justify-center">
          <div className="w-[800px] h-[400px] opacity-20 blur-[100px] bg-indigo-600 rounded-full" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-zinc-950 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <GlassPanel className="inline-flex items-center gap-2 px-4 py-1.5 mb-8">
          <span className="material-symbols-outlined text-indigo-400 text-sm">auto_awesome</span>
          <span className="text-xs tracking-wide text-zinc-300">{badge}</span>
        </GlassPanel>

        <h1 className="text-5xl md:text-7xl font-bold leading-[0.95] mb-6 tracking-tighter drop-shadow-[0_0_20px_rgba(216,180,254,0.35)]">
          {headline} <br />
          <span className="text-indigo-400 italic">{headlineAccent}</span>
        </h1>

        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10">{subheadline}</p>

        <div className="flex items-center justify-center">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-4 bg-indigo-400 text-white text-lg rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
          >
            Go to Dashboard <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>

        <GlassPanel className="hero-mockup mt-20 p-4 md:p-8 max-w-4xl mx-auto">
          <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-indigo-600/30 via-zinc-900 to-cyan-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-indigo-400/60">graphic_eq</span>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}