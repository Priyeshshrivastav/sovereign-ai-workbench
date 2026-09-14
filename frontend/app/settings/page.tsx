"use client";

import { useEffect, useState } from "react";
import {
  getDemoDataStatus,
  loadDemoData
} from "@/lib/api";
import { DemoDataStatus } from "@/lib/types";
import Loading from "@/components/ui/Loading";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function SettingsPage() {
  const [status, setStatus] =
    useState<DemoDataStatus>("not_loaded");

  const [loading, setLoading] = useState(true);
  const [loadingDemo, setLoadingDemo] =
    useState(false);

  const [error, setError] = useState("");

  async function refreshStatus() {
    try {
      const response = await getDemoDataStatus();
      setStatus(response.status);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load demo status."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshStatus();
  }, []);

  async function handleLoad() {
    setLoadingDemo(true);
    setError("");

    try {
      const response = await loadDemoData();
      setStatus(response.status);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load demo data."
      );
    } finally {
      setLoadingDemo(false);
    }
  }

  if (loading) {
    return <Loading message="Loading settings..." />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Manage local demo data and workbench configuration.
        </p>
      </div>

      {/* Error */}
      {error && <ErrorMessage message={error} />}

      {/* Demo Dataset */}
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-medium text-slate-200">
              SIH Demo Dataset
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              Load the predefined dataset used to demonstrate
              the end-to-end AI workflow.
            </p>
          </div>

          <span
            className={`w-fit rounded-md border px-3 py-1.5 text-xs font-medium ${
              status === "loaded"
                ? "border-slate-600 bg-slate-800 text-slate-200"
                : "border-slate-700 bg-slate-950 text-slate-400"
            }`}
          >
            {status}
          </span>
        </div>

        <div className="mt-5 border-t border-slate-800 pt-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-300">
                Current status
              </p>

              <p className="mt-1 text-xs text-slate-500">
                The dataset remains within the local
                environment.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLoad}
              disabled={loadingDemo}
              className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingDemo
                ? "Loading..."
                : "1-Click Load SIH Demo Data"}
            </button>
          </div>
        </div>
      </section>

      {/* Sovereignty Information */}
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-sm font-medium text-slate-200">
          Data Sovereignty
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Deployment
            </p>

            <p className="mt-2 text-sm font-medium text-slate-200">
              On-Premise
            </p>
          </div>

          <div className="rounded-md border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Data Processing
            </p>

            <p className="mt-2 text-sm font-medium text-slate-200">
              Local
            </p>
          </div>

          <div className="rounded-md border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              External Cloud API
            </p>

            <p className="mt-2 text-sm font-medium text-slate-200">
              Disabled
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}