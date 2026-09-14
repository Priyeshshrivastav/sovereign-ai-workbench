"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Overview", href: "/" },
  { name: "AI Workbench", href: "/workbench" },
  { name: "Knowledge Base", href: "/knowledge-base" },
  { name: "Documents", href: "/documents" },
  { name: "Telemetry", href: "/telemetry" },
  { name: "Visual Inspection", href: "/inspection" },
  { name: "Predictive Maintenance", href: "/maintenance" },
  { name: "Root Cause", href: "/root-cause" },
  { name: "Agent Workspace", href: "/agents" },
  { name: "Settings", href: "/settings" },
  { name: "Audit Trail", href: "/audit-logs" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[260px] shrink-0 border-r border-slate-800/80 bg-[#080d18] lg:flex lg:flex-col">
      {/* Brand */}
      <div className="border-b border-slate-800/80 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900">
            <span className="text-sm font-bold tracking-tight text-white">
              SA
            </span>
          </div>

          <div>
            <h1 className="text-sm font-semibold tracking-wide text-white">
              Sovereign AI
            </h1>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Industrial Workbench
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
          Workspace
        </p>

        <div className="space-y-1">
          {navigation.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center rounded-lg px-3 py-2.5 text-[13px] transition-all ${
                  active
                    ? "border border-slate-700/80 bg-slate-800/80 text-white shadow-sm"
                    : "border border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <span
                  className={`mr-3 h-1.5 w-1.5 rounded-full transition ${
                    active
                      ? "bg-slate-200"
                      : "bg-slate-700 group-hover:bg-slate-500"
                  }`}
                />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800/80 p-4">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-xs font-medium text-slate-300">
              Local Environment
            </span>
          </div>

          <p className="mt-1.5 pl-4 text-[10px] text-slate-600">
            Sovereign processing enabled
          </p>
        </div>
      </div>
    </aside>
  );
}