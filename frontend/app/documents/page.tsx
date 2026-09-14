"use client";

import { useEffect, useState } from "react";
import {
  getDocuments,
  uploadDocument
} from "@/lib/api";
import {
  Document,
  DocumentUploadResponse
} from "@/lib/types";
import Loading from "@/components/ui/Loading";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] =
    useState<DocumentUploadResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function loadDocuments() {
    try {
      const response = await getDocuments();
      setDocuments(response.documents);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load documents."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  async function handleUpload(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!file) {
      setError("Please select a file.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const response = await uploadDocument(file);

      setUploadResult(response);
      setFile(null);

      await loadDocuments();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return <Loading message="Loading documents..." />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">
          Document Management
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Upload and manage documents indexed in the
          Sovereign AI knowledge base.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Upload Section */}
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-200">
            Upload Document
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Supported formats: PDF, DOCX, CSV, JPG, JPEG, PNG
          </p>
        </div>

        <form
          onSubmit={handleUpload}
          className="flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label
              htmlFor="document"
              className="mb-2 block text-xs font-medium text-slate-400"
            >
              Select document
            </label>

            <input
              id="document"
              type="file"
              accept=".pdf,.docx,.csv,.jpg,.jpeg,.png"
              onChange={(event) =>
                setFile(event.target.files?.[0] || null)
              }
              className="block w-full cursor-pointer rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-200 hover:file:bg-slate-700"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="rounded-md bg-slate-100 px-5 py-2 text-sm font-medium text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {file && (
          <p className="mt-3 text-xs text-slate-400">
            Selected:{" "}
            <span className="text-slate-200">
              {file.name}
            </span>
          </p>
        )}
      </section>

      {/* Upload Result */}
      {uploadResult && (
        <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-200">
            Upload Result
          </h2>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md bg-slate-950 p-3">
              <p className="text-xs text-slate-500">
                Document ID
              </p>
              <p className="mt-1 break-all text-sm text-slate-200">
                {uploadResult.document_id}
              </p>
            </div>

            <div className="rounded-md bg-slate-950 p-3">
              <p className="text-xs text-slate-500">
                Status
              </p>
              <p className="mt-1 text-sm text-slate-200">
                {uploadResult.status}
              </p>
            </div>

            <div className="rounded-md bg-slate-950 p-3">
              <p className="text-xs text-slate-500">
                Classification
              </p>
              <p className="mt-1 text-sm text-slate-200">
                {uploadResult.security_classification}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Documents Table */}
      <section className="rounded-lg border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-200">
            Indexed Documents
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Documents currently available in the knowledge base.
          </p>
        </div>

        {documents.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-slate-400">
              No documents found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-800 bg-slate-950/50">
                <tr>
                  <th className="px-5 py-3 text-xs font-medium text-slate-400">
                    ID
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-slate-400">
                    Filename
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-slate-400">
                    Type
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-slate-400">
                    Classification
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-slate-400">
                    Indexed At
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {documents.map((document) => (
                  <tr
                    key={document.document_id}
                    className="transition hover:bg-slate-800/40"
                  >
                    <td className="max-w-[180px] truncate px-5 py-3 text-xs text-slate-400">
                      {document.document_id}
                    </td>

                    <td className="px-5 py-3 font-medium text-slate-200">
                      {document.filename}
                    </td>

                    <td className="px-5 py-3 text-slate-400">
                      {document.type}
                    </td>

                    <td className="px-5 py-3 text-slate-300">
                      {document.security_classification}
                    </td>

                    <td className="px-5 py-3 text-slate-400">
                      {document.indexed_at}
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