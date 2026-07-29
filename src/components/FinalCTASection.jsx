import { Link } from "react-router-dom";
import GlassPanel from "./GlassPanel";

export default function FinalCTASection() {
  return (
    <section className="py-24 px-6 relative">
      <GlassPanel className="max-w-6xl mx-auto p-12 md:p-24 text-center overflow-hidden border-indigo-400/20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-indigo-400/10 blur-[120px] rounded-full" />
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Ready to hit record <br /> without touching a button?
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-10">
            Join 10,000+ creators who have reclaimed 30+ hours a week in production time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-10 py-5 bg-indigo-400 text-white text-lg rounded-xl font-bold hover:scale-105 transition-all shadow-xl shadow-indigo-600/30"
            >
              Go to Dashboard
            </Link>
            <GlassPanel className="w-full sm:w-auto">
              <button className="w-full px-10 py-5 text-lg hover:bg-white/10 transition-all rounded-3xl">
                Talk to Sales
              </button>
            </GlassPanel>
          </div>
          <p className="mt-8 text-xs text-zinc-500">
            No credit card required • Free trial includes 1st episode free
          </p>
        </div>
      </GlassPanel>
    </section>
  );
}
