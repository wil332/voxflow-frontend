export default function GlassPanel({ children, className = "" }) {
  return (
    <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}