"use client";

import { useState } from "react";
import { searchKnowledgeBase } from "@/lib/api";
import { KnowledgeResult } from "@/lib/types";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function KnowledgePage() {
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(5);
  const [results, setResults] =
    useState<KnowledgeResult[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!query.trim()) {
      setError("Enter a search query.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await searchKnowledgeBase({
        query,
        top_k: topK
      });

      setResults(response.results);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Knowledge search failed."
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
          Knowledge Search
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Search indexed technical documents using the
          local knowledge base.
        </p>
      </div>

      {/* Error */}
      {error && <ErrorMessage message={error} />}

      {/* Search Form */}
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <div className="mb-5">
          <h2 className="text-sm font-medium text-slate-200">
            Search Knowledge Base
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Enter a question or technical keyword to find
            relevant document sections.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="knowledge-query"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Query
            </label>

            <input
              id="knowledge-query"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="e.g. What are the recommended maintenance intervals?"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="w-full sm:w-32">
              <label
                htmlFor="top-k"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Top K
              </label>

              <input
                id="top-k"
                type="number"
                min={1}
                value={topK}
                onChange={(event) =>
                  setTopK(Number(event.target.value))
                }
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-slate-100 px-5 py-2 text-sm font-medium text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>
      </section>

      {/* Results */}
      <section className="rounded-lg border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-medium text-slate-200">
            Results
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {results.length} result
            {results.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {results.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-slate-400">
              No results.
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Search the knowledge base to view relevant
              document sections.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {results.map((result, index) => (
              <article
                key={`${result.document_id}-${index}`}
                className="p-5 transition hover:bg-slate-800/30"
              >
                {/* Result Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      Result {index + 1}
                    </p>

                    <p className="mt-1 break-all text-xs text-slate-500">
                      {result.document_id}
                    </p>
                  </div>

                  <span className="w-fit rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-400">
                    Score: {result.score}
                  </span>
                </div>

                {/* Metadata */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-400">
                    Document: {result.document_id}
                  </span>

                  <span className="rounded border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-400">
                    Page: {result.page}
                  </span>
                </div>

                {/* Chunk */}
                <div className="mt-4 rounded-md border border-slate-800 bg-slate-950 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
                    {result.chunk_text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}