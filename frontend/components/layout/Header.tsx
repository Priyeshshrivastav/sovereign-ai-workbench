"use client";

import { useEffect, useState } from "react";
import { getSystemStatus } from "@/lib/api";
import { SystemStatus } from "@/lib/types";

export default function Header() {
  const [status, setStatus] = useState<SystemStatus | null>(null);

  useEffect(() => {
    getSystemStatus()
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#080d18]/95 backdrop-blur">
      <div className="flex min-h-[72px] items-center justify-between gap-6 px-5 md:px-7">
        {/* Title */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Industrial AI Platform
            </p>
          </div>

          <h2 className="mt-1 truncate text-sm font-semibold text-slate-100">
            Sovereign On-Premise AI Workbench
          </h2>
        </div>

        {/* System indicators */}
        <div className="hidden items-center gap-2 md:flex">
          {status ? (
            <>
              <StatusPill
                label="PROCESSING"
                value={
                  status.sovereignty.local_processing
                    ? "LOCAL"
                    : "REMOTE"
                }
                active={status.sovereignty.local_processing}
              />

              <StatusPill
                label="MODELS"
                value={status.models.status}
              />

              <StatusPill
                label="RAG"
                value={status.rag_engine.status}
              />
            </>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-red-900/50 bg-red-950/20 px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />

              <span className="text-[10px] font-medium uppercase tracking-wider text-red-300">
                Backend unavailable
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function StatusPill({
  label,
  value,
  active = false,
}: {
  label: string;
  value: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-400" : "bg-slate-500"
        }`}
      />

      <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </span>

      <span className="text-[10px] font-medium uppercase tracking-wide text-slate-300">
        {value}
      </span>
    </div>
  );
}