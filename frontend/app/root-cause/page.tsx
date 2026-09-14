"use client";

import { useState } from "react";
import { investigateRootCause } from "@/lib/api";
import { RootCauseResponse } from "@/lib/types";
import { DEFAULT_MACHINE_ID } from "@/lib/constants";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function RootCausePage() {
  const [machineId, setMachineId] =
    useState(DEFAULT_MACHINE_ID);

  const [context, setContext] = useState("");

  const [result, setResult] =
    useState<RootCauseResponse | null>(null);

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
        await investigateRootCause(
          machineId,
          context
        );

      setResult(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Root cause investigation failed."
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
          Root Cause Investigation
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Investigate possible causes of machine issues
          using available operational context.
        </p>
      </div>

      {/* Error */}
      {error && <ErrorMessage message={error} />}

      {/* Investigation Form */}
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <div className="mb-5">
          <h2 className="text-sm font-medium text-slate-200">
            Investigation Input
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Provide the machine ID and any relevant
            information about the issue.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Machine ID */}
          <div>
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

          {/* Context */}
          <div>
            <label
              htmlFor="context"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Context
            </label>

            <textarea
              id="context"
              value={context}
              onChange={(event) =>
                setContext(event.target.value)
              }
              rows={5}
              placeholder="Describe the machine issue, symptoms, recent events, or other relevant context..."
              className="w-full resize-y rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-slate-100 px-5 py-2 text-sm font-medium text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Investigating..."
                : "Investigate"}
            </button>
          </div>
        </form>
      </section>

      {/* Results */}
      {result && (
        <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <div className="mb-5">
            <h2 className="text-sm font-medium text-slate-200">
              Ranked Causes
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Possible causes ranked by confidence and
              supporting evidence.
            </p>
          </div>

          {result.ranked_causes.length === 0 ? (
            <div className="rounded-md border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">
                No causes returned.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {result.ranked_causes.map(
                (cause, index) => (
                  <article
                    key={index}
                    className="rounded-md border border-slate-800 bg-slate-950 p-4"
                  >
                    {/* Cause Header */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-700 bg-slate-900 text-xs font-medium text-slate-400">
                          {index + 1}
                        </span>

                        <div>
                          <p className="font-medium text-slate-200">
                            {cause.cause}
                          </p>
                        </div>
                      </div>

                      <span className="w-fit rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300">
                        Confidence:{" "}
                        {(
                          cause.confidence * 100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>

                    {/* Evidence */}
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                        Evidence
                      </p>

                      {cause.evidence.length === 0 ? (
                        <p className="text-sm text-slate-500">
                          No supporting evidence available.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {cause.evidence.map(
                            (
                              evidence,
                              evidenceIndex
                            ) => (
                              <div
                                key={
                                  evidenceIndex
                                }
                                className="rounded-md border border-slate-800 bg-slate-900 p-3"
                              >
                                <p className="text-xs font-medium text-slate-300">
                                  {
                                    evidence.source
                                  }
                                </p>

                                <p className="mt-1 text-sm leading-6 text-slate-400">
                                  {
                                    evidence.detail
                                  }
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}