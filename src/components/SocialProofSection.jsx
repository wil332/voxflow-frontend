import { trustedBrands } from "../data/landingContent";

export default function SocialProofSection() {
  return (
    <section className="py-16 px-6 border-y border-white/10">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs text-zinc-500 uppercase tracking-widest mb-10">
          Trusted by 10,000+ top-tier creators
        </p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 items-center opacity-50">
          {trustedBrands.map((name) => (
            <span key={name} className="text-zinc-400 font-bold text-lg">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
