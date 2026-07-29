import { statusStyle } from "../data/agents";

export default function StatusBadge({ status }) {
  const style = statusStyle[status] || statusStyle.pending;

  return (
    <span className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-full ${style.classes}`}>
      <span className="material-symbols-outlined text-[16px]">{style.icon}</span>
      {style.label}
    </span>
  );
}