"use client";

import { useEffect, useState } from "react";
import { getAuditLogs } from "@/lib/api";
import { AuditEvent } from "@/lib/types";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Loading from "@/components/ui/Loading";

export default function AuditLogsPage() {
  const [events, setEvents] =
    useState<AuditEvent[]>([]);

  const [eventType, setEventType] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLogs(type?: string) {
    setLoading(true);
    setError("");

    try {
      const response = await getAuditLogs(type);
      setEvents(response.events);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load audit logs."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();
    await loadLogs(eventType || undefined);
  }

  if (loading) {
    return <Loading message="Loading audit logs..." />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
          Audit Logs
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Review recorded system and AI workflow events.
        </p>
      </div>

      {/* Error */}
      {error && <ErrorMessage message={error} />}

      {/* Filter */}
      <section className="card">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label
              htmlFor="event-type"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Event Type
            </label>

            <input
              id="event-type"
              value={eventType}
              onChange={(event) =>
                setEventType(event.target.value)
              }
              placeholder="ai_workflow_execution"
              className="input"
            />
          </div>

          <button
            type="submit"
            className="button-primary"
          >
            Filter
          </button>
        </form>
      </section>

      {/* Audit Events */}
      <section className="card overflow-hidden p-0">
        <div className="border-b border-slate-800 px-5 py-4">
          <h2 className="section-title">
            Audit Events
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {events.length} event
            {events.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {events.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="muted">
              No audit events found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-slate-800 bg-slate-950">
                <tr>
                  <th className="px-5 py-3 font-medium text-slate-400">
                    ID
                  </th>

                  <th className="px-5 py-3 font-medium text-slate-400">
                    Type
                  </th>

                  <th className="px-5 py-3 font-medium text-slate-400">
                    Timestamp
                  </th>

                  <th className="px-5 py-3 font-medium text-slate-400">
                    Actor
                  </th>

                  <th className="px-5 py-3 font-medium text-slate-400">
                    Detail
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="transition hover:bg-slate-800/40"
                  >
                    <td className="whitespace-nowrap px-5 py-3 text-xs text-slate-500">
                      {event.id}
                    </td>

                    <td className="whitespace-nowrap px-5 py-3">
                      <span className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300">
                        {event.type}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-3 text-slate-400">
                      {event.timestamp}
                    </td>

                    <td className="whitespace-nowrap px-5 py-3 text-slate-300">
                      {event.actor}
                    </td>

                    <td className="max-w-md px-5 py-3 text-slate-400">
                      {event.detail}
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