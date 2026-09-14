"use client";

import { useEffect, useState } from "react";

import { getSystemStatus } from "@/lib/api";
import type { SystemStatus } from "@/lib/types";

const USE_MOCKS =
  process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

export default function Header() {
  const [status, setStatus] =
    useState<SystemStatus | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    getSystemStatus()
      .then((data) => {
        if (!mounted) return;

        setStatus(data);
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;

        setStatus(null);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load system status."
        );
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#080d18]/95 backdrop-blur">
      <div className="flex min-h-[72px] items-center justify-between gap-6 px-5 md:px-7">
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

        <div className="hidden items-center gap-2 md:flex">
          {status ? (
            <>
              {USE_MOCKS && (
                <StatusPill
                  label="ENV"
                  value="MOCK"
                  active
                />
              )}

              <StatusPill
                label="PROCESSING"
                value={
                  status.sovereignty.local_processing
                    ? "LOCAL"
                    : "REMOTE"
                }
                active={
                  status.sovereignty.local_processing
                }
              />

              <StatusPill
                label="MODELS"
                value={status.models.status}
                active={
                  status.models.status === "online"
                }
              />

              <StatusPill
                label="RAG"
                value={status.rag_engine.status}
                active={
                  status.rag_engine.status === "online"
                }
              />
            </>
          ) : (
            <div className="max-w-sm rounded-lg border border-red-900/50 bg-red-950/20 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />

                <span className="text-[10px] font-medium uppercase tracking-wider text-red-300">
                  Backend unavailable
                </span>
              </div>

              {error && (
                <p className="mt-1 text-[9px] text-red-400/80">
                  {error}
                </p>
              )}
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
          active
            ? "bg-emerald-400"
            : "bg-slate-500"
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