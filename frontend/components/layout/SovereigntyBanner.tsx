"use client";

import { useEffect, useState } from "react";
import { getSystemStatus } from "@/lib/api/system";
import type { SystemStatus } from "@/lib/types/system";

export default function SovereigntyBanner() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getSystemStatus()
      .then(setStatus)
      .catch(() => setError(true));
  }, []);

  return (
    <div className="border-b border-slate-800/80 bg-[#0b1220]">
      <div className="flex flex-wrap items-center gap-2 px-5 py-3 md:px-7">

        {/* Label */}
        <div className="mr-2 flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              error
                ? "bg-red-400"
                : status
                ? "bg-emerald-400"
                : "bg-slate-500"
            }`}
          />

          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
            Security Posture
          </span>
        </div>

        {/* Loading */}
        {!status && !error && (
          <span className="rounded-md border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-[9px] font-medium tracking-wider text-slate-500">
            CHECKING SYSTEM
          </span>
        )}

        {/* Error */}
        {error && (
          <span className="rounded-md border border-red-900/50 bg-red-950/20 px-2.5 py-1 text-[9px] font-medium tracking-wider text-red-400">
            STATUS UNAVAILABLE
          </span>
        )}

        {/* Status */}
        {status && (
          <>
            <StatusBadge>
              {status.sovereignty.mode}
            </StatusBadge>

            <StatusBadge active={status.sovereignty.local_processing}>
              {status.sovereignty.local_processing
                ? "LOCAL PROCESSING"
                : "REMOTE PROCESSING"}
            </StatusBadge>

            <StatusBadge active={!status.sovereignty.external_api}>
              {status.sovereignty.external_api
                ? "EXTERNAL API"
                : "NO EXTERNAL API"}
            </StatusBadge>

            <StatusBadge active={status.sovereignty.air_gapped}>
              {status.sovereignty.air_gapped
                ? "AIR-GAPPED"
                : "NETWORK CONNECTED"}
            </StatusBadge>
          </>
        )}
      </div>
    </div>
  );
}

function StatusBadge({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[9px] font-medium tracking-wider ${
        active
          ? "border-slate-700 bg-slate-900 text-slate-300"
          : "border-slate-800 bg-slate-900/50 text-slate-500"
      }`}
    >
      <span
        className={`h-1 w-1 rounded-full ${
          active ? "bg-emerald-400" : "bg-slate-600"
        }`}
      />

      {children}
    </span>
  );
}