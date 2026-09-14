"use client";

import { useState } from "react";
import { getMaintenanceHistory } from "@/lib/api";
import { MaintenanceHistoryItem } from "@/lib/types";
import { DEFAULT_MACHINE_ID } from "@/lib/constants";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function HistoryPage() {
  const [machineId, setMachineId] =
    useState(DEFAULT_MACHINE_ID);

  const [history, setHistory] =
    useState<MaintenanceHistoryItem[]>([]);

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
        await getMaintenanceHistory(machineId);

      setHistory(response.history);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load history."
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
          Maintenance History
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          View maintenance records for a specific machine.
        </p>
      </div>

      {/* Error */}
      {error && <ErrorMessage message={error} />}

      {/* Search Form */}
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-sm font-medium text-slate-200">
          Machine Lookup
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label
              htmlFor="machineId"
              className="mb-1.5 block text-sm text-slate-400"
            >
              Machine ID
            </label>

            <input
              id="machineId"
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
            className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load History"}
          </button>
        </form>
      </section>

      {/* History */}
      <section className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-medium text-slate-200">
            Maintenance Records
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {history.length} record
            {history.length !== 1 ? "s" : ""}
          </p>
        </div>

        {history.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-slate-400">
              No maintenance history.
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Enter a machine ID and load its history.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-800 bg-slate-950/50">
                <tr>
                  <th className="px-5 py-3 font-medium text-slate-400">
                    Date
                  </th>

                  <th className="px-5 py-3 font-medium text-slate-400">
                    Action
                  </th>

                  <th className="px-5 py-3 font-medium text-slate-400">
                    Notes
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {history.map((item, index) => (
                  <tr
                    key={index}
                    className="transition hover:bg-slate-800/40"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-slate-300">
                      {item.date}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-200">
                      {item.action}
                    </td>

                    <td className="px-5 py-4 text-slate-400">
                      {item.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}