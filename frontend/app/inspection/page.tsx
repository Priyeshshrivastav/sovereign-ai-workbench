"use client";

import { useState } from "react";
import { inspectImage } from "@/lib/api";
import { VisionInspectionResponse } from "@/lib/types";
import { DEFAULT_MACHINE_ID } from "@/lib/constants";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function InspectionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [machineId, setMachineId] =
    useState(DEFAULT_MACHINE_ID);

  const [result, setResult] =
    useState<VisionInspectionResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!file) {
      setError("Please select an image.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await inspectImage(
        file,
        machineId
      );

      setResult(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Inspection failed."
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
          Visual Inspection
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Upload an inspection image to identify possible
          equipment defects.
        </p>
      </div>

      {/* Error */}
      {error && <ErrorMessage message={error} />}

      {/* Inspection Form */}
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <div className="mb-5">
          <h2 className="text-sm font-medium text-slate-200">
            Inspection Input
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Provide the machine ID and inspection image.
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

          {/* Image */}
          <div>
            <label
              htmlFor="inspection-image"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Inspection Image
            </label>

            <input
              id="inspection-image"
              type="file"
              accept="image/*"
              onChange={(event) =>
                setFile(
                  event.target.files?.[0] || null
                )
              }
              className="block w-full cursor-pointer rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-200 hover:file:bg-slate-700"
            />

            {file && (
              <p className="mt-2 text-xs text-slate-500">
                Selected:{" "}
                <span className="text-slate-300">
                  {file.name}
                </span>
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-slate-100 px-5 py-2 text-sm font-medium text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Inspecting..."
                : "Inspect Image"}
            </button>
          </div>
        </form>
      </section>

      {/* Results */}
      {result && (
        <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <div className="mb-5">
            <h2 className="text-sm font-medium text-slate-200">
              Inspection Findings
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Results returned by the vision inspection workflow.
            </p>
          </div>

          {/* Findings */}
          {result.findings.length === 0 ? (
            <div className="rounded-md border border-slate-800 bg-slate-950 px-4 py-5">
              <p className="text-sm text-slate-400">
                No findings.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {result.findings.map(
                (finding, index) => (
                  <div
                    key={index}
                    className="rounded-md border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-slate-200">
                          {finding.defect_type}
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Location:{" "}
                          {finding.location}
                        </p>
                      </div>

                      <span className="w-fit rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300">
                        {finding.severity}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* Annotated Image */}
          {result.annotated_image_url && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-medium text-slate-200">
                Annotated Image
              </h3>

              <div className="overflow-hidden rounded-md border border-slate-800 bg-slate-950 p-2">
                <img
                  src={result.annotated_image_url}
                  alt="Annotated inspection"
                  className="h-auto max-h-[600px] max-w-full rounded object-contain"
                />
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}