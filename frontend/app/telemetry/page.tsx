"use client";

import { useState } from "react";
import { getTelemetryAnalysis } from "@/lib/api";
import { TelemetryAnalysis } from "@/lib/types";
import { DEFAULT_MACHINE_ID } from "@/lib/constants";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function TelemetryPage() {
  const [machineId, setMachineId] =
    useState(DEFAULT_MACHINE_ID);

  const [data, setData] =
    useState<TelemetryAnalysis | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response =
        await getTelemetryAnalysis(machineId);

      setData(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Telemetry analysis failed."
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
          Telemetry Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Analyze machine sensor signals and identify
          possible anomalies.
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
            Enter a machine ID to retrieve its telemetry
            data.
          </p>
        </div>

        <form
          onSubmit={handleAnalyze}
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
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>
      </section>

      {/* Telemetry Results */}
      {data && (
        <section className="space-y-5">
          {/* Machine */}
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Machine
            </p>

            <h2 className="mt-1 text-lg font-semibold text-slate-100">
              {data.machine_id}
            </h2>
          </div>

          {/* Signals */}
          {(
            Object.entries(data.signals) as [
              string,
              {
                timestamp: string;
                value: number;
                anomaly: boolean;
              }[]
            ][]
          ).map(([signal, points]) => (
            <div
              key={signal}
              className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900"
            >
              <div className="border-b border-slate-800 px-5 py-4">
                <h3 className="text-sm font-medium text-slate-200">
                  {signal}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {points.length} data point
                  {points.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-800 bg-slate-950/50">
                    <tr>
                      <th className="px-5 py-3 font-medium text-slate-400">
                        Timestamp
                      </th>

                      <th className="px-5 py-3 font-medium text-slate-400">
                        Value
                      </th>

                      <th className="px-5 py-3 font-medium text-slate-400">
                        Anomaly
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {points.map((point, index) => (
                      <tr
                        key={index}
                        className="transition hover:bg-slate-800/30"
                      >
                        <td className="whitespace-nowrap px-5 py-3 text-slate-400">
                          {point.timestamp}
                        </td>

                        <td className="px-5 py-3 font-medium text-slate-200">
                          {point.value}
                        </td>

                        <td className="px-5 py-3">
                          <span
                            className={`rounded border px-2 py-1 text-xs font-medium ${
                              point.anomaly
                                ? "border-slate-600 bg-slate-800 text-slate-100"
                                : "border-slate-800 bg-slate-950 text-slate-500"
                            }`}
                          >
                            {point.anomaly
                              ? "YES"
                              : "NO"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Threshold Violations */}
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-slate-200">
                Threshold Violations
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Threshold checks returned by the telemetry
                analysis.
              </p>
            </div>

            <pre className="overflow-x-auto rounded-md border border-slate-800 bg-slate-950 p-4 text-xs leading-5 text-slate-400">
              {JSON.stringify(
                data.threshold_violations,
                null,
                2
              )}
            </pre>
          </div>
        </section>
      )}
    </div>
  );
}