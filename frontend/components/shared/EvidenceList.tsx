interface Evidence {
  source: string;
  detail: string;
}

interface EvidenceListProps {
  evidence: Evidence[];
}

export default function EvidenceList({
  evidence,
}: EvidenceListProps) {
  if (!evidence.length) {
    return (
      <p className="text-sm text-slate-500">
        No evidence available.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {evidence.map((item, index) => (
        <div
          key={`${item.source}-${index}`}
          className="rounded-md border border-slate-800 bg-slate-950 p-3"
        >
          <p className="text-xs font-medium uppercase text-slate-500">
            {item.source}
          </p>

          <p className="mt-1 text-sm text-slate-300">
            {item.detail}
          </p>
        </div>
      ))}
    </div>
  );
}