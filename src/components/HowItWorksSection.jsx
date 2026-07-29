import GlassPanel from "./GlassPanel";
import { productionSteps } from "../data/landingContent";

function StepCard({ step }) {
  return (
    <div className="relative">
      <div className="absolute -top-4 -left-4 text-6xl font-black text-white/5">{step.n}</div>
      <GlassPanel className="p-8 hover:bg-white/10 transition-all h-full flex flex-col">
        <span className={`material-symbols-outlined mb-6 text-4xl ${step.color}`}>{step.icon}</span>
        <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
      </GlassPanel>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-semibold mb-4">
            Zero Effort, <span className="text-cyan-400 italic">Peak Quality.</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Our multi-agent system mimics a professional production team in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {productionSteps.map((step) => (
            <StepCard key={step.n} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
