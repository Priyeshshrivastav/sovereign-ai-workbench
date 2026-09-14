interface RiskBadgeProps {
  level: "low" | "medium" | "high" | null;
}

export default function RiskBadge({ level }: RiskBadgeProps) {
  if (!level) {
    return (
      <span className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-500">
        No risk
      </span>
    );
  }

  return (
    <span className="rounded border border-slate-700 px-2 py-1 text-xs uppercase text-slate-300">
      {level} risk
    </span>
  );
}