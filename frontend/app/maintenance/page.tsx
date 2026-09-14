"use client";

import { useState } from "react";
import { predictMaintenance } from "@/lib/api";
import { MaintenancePrediction } from "@/lib/types";
import { DEFAULT_MACHINE_ID } from "@/lib/constants";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function MaintenancePage() {
  const [machineId, setMachineId] =
    useState(DEFAULT_MACHINE_ID);

  const [result, setResult] =
    useState<MaintenancePrediction | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response =
        await predictMaintenance(machineId);

      setResult(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Prediction failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
          Predictive Maintenance
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Analyze machine data and estimate maintenance
          risk using the local AI workflow.
        </p>
      </div>

      {/* Error */}
      {error && <ErrorMessage message={error} />}

      {/* Machine Input */}
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <div className="mb-5">
          <h2 className="text-sm font-medium text-slate-200">
            Machine Analysis
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Enter a machine ID to generate a maintenance
            prediction.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label
              htmlFor="machine-id"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Machine ID
            </label>

            <input
              id="machine-id"
              value={machineId}
              onChange={(event) =>
                setMachineId(event.target.value)
              }
              placeholder="Enter machine ID"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-slate-100 px-5 py-2 text-sm font-medium text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Predicting..."
              : "Predict Maintenance"}
          </button>
        </form>
      </section>

      {/* Prediction Result */}
      {result && (
        <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <div className="mb-5">
            <h2 className="text-sm font-medium text-slate-200">
              Maintenance Prediction
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              AI-generated assessment for {machineId}.
            </p>
          </div>

          {/* Risk + Confidence */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Risk Level
              </p>

              <p className="mt-2 text-xl font-semibold text-slate-100">
                {result.risk_level}
              </p>
            </div>

            <div className="rounded-md border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Confidence
              </p>

              <p className="mt-2 text-xl font-semibold text-slate-100">
                {(result.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Recommendation */}
          <div className="mt-4 rounded-md border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Recommendation
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              {result.recommendation}
            </p>
          </div>

          {/* Evidence */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-slate-200">
              Evidence
            </h3>

            {result.evidence.length === 0 ? (
              <div className="mt-3 rounded-md border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">
                  No evidence available.
                </p>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                {result.evidence.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="rounded-md border border-slate-800 bg-slate-950 p-4"
                    >
                      <p className="text-sm font-medium text-slate-200">
                        {item.source}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {item.detail}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}