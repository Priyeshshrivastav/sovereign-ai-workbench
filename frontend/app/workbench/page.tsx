"use client";

import { useEffect, useState } from "react";

import {
  getAgents,
  getAuditLogs,
  getDemoDataStatus,
  getSystemStatus,
  loadDemoData,
  runAgentQuery,
} from "@/lib/api";

import {
  Agent,
  AgentQueryResponse,
  AuditEvent,
  DemoDataStatus,
  SystemStatus,
} from "@/lib/types";

import {
  DEFAULT_MACHINE_ID,
  DEMO_QUERY,
} from "@/lib/constants";

import Loading from "@/components/ui/Loading";
import ErrorMessage from "@/components/ui/ErrorMessage";
import AgentResult from "@/components/workflow/AgentResult";

export default function DashboardPage() {
  const [system, setSystem] = useState<SystemStatus | null>(null);

  const [demoStatus, setDemoStatus] =
    useState<DemoDataStatus>("not_loaded");

  const [agents, setAgents] = useState<Agent[]>([]);

  const [result, setResult] =
    useState<AgentQueryResponse | null>(null);

  const [auditEvents, setAuditEvents] =
    useState<AuditEvent[]>([]);

  const [loading, setLoading] = useState(true);
  const [demoLoading, setDemoLoading] = useState(false);
  const [queryLoading, setQueryLoading] = useState(false);

  const [error, setError] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");

    try {
      const [
        systemData,
        demoData,
        agentsData,
        auditData,
      ] = await Promise.all([
        getSystemStatus(),
        getDemoDataStatus(),
        getAgents(),
        getAuditLogs(),
      ]);

      setSystem(systemData);
      setDemoStatus(demoData.status);
      setAgents(agentsData.agents);
      setAuditEvents(auditData.events);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleLoadDemoData() {
    setDemoLoading(true);
    setError("");

    try {
      const response = await loadDemoData();

      setDemoStatus(response.status);

      await refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load demo data."
      );
    } finally {
      setDemoLoading(false);
    }
  }

  async function handleRunDemo() {
    setQueryLoading(true);
    setError("");

    try {
      let currentDemoStatus = demoStatus;

      if (currentDemoStatus !== "loaded") {
        const loaded = await loadDemoData();

        currentDemoStatus = loaded.status;

        setDemoStatus(currentDemoStatus);
      }

      const agentsResponse = await getAgents();

      const maintenanceAgent =
        agentsResponse.agents.find(
          (agent) =>
            agent.id === "maint_assist" ||
            agent.name === "Maintenance Assistant"
        );

      if (!maintenanceAgent) {
        throw new Error(
          "Maintenance Assistant was not returned by the backend."
        );
      }

      const agentResult = await runAgentQuery({
        agent_id: maintenanceAgent.id,
        query: DEMO_QUERY,
        machine_id: DEFAULT_MACHINE_ID,
      });

      setAgents(agentsResponse.agents);
      setResult(agentResult);

      const auditResponse =
        await getAuditLogs("ai_workflow_execution");

      setAuditEvents(auditResponse.events);

      const systemResponse = await getSystemStatus();

      setSystem(systemResponse);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Demo workflow failed."
      );
    } finally {
      setQueryLoading(false);
    }
  }

  if (loading) {
    return (
      <Loading message="Loading Sovereign AI Workbench..." />
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Page Header */}

      <div>
        <h1 className="text-2xl font-semibold text-slate-100">
          System Overview
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Monitor the local AI workbench and run the end-to-end demo.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-md border border-red-900/60 bg-red-950/30 p-4">
          <ErrorMessage message={error} />
        </div>
      )}

      {/* System Status */}

      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-100">
            System Status
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Current backend and AI infrastructure state.
          </p>
        </div>

        {system ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatusItem
              label="Mode"
              value={system.sovereignty.mode}
            />

            <StatusItem
              label="Local Processing"
              value={
                system.sovereignty.local_processing
                  ? "YES"
                  : "NO"
              }
            />

            <StatusItem
              label="External API"
              value={
                system.sovereignty.external_api
                  ? "YES"
                  : "NO"
              }
            />

            <StatusItem
              label="Air-Gapped"
              value={
                system.sovereignty.air_gapped
                  ? "YES"
                  : "NO"
              }
            />

            <StatusItem
              label="Models"
              value={system.models.status}
            />

            <StatusItem
              label="RAG"
              value={system.rag_engine.status}
            />

            <StatusItem
              label="Vector DB"
              value={`${system.vector_database.backend} (${system.vector_database.status})`}
            />

            <StatusItem
              label="Indexed Documents"
              value={String(system.indexed_documents)}
            />
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            No system status available.
          </p>
        )}
      </section>

      {/* Demo Dataset */}

      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-100">
            Demo Dataset
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Load the Smart Industrial Hub demo dataset.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300">
            Status:{" "}
            <span className="font-medium text-slate-100">
              {demoStatus}
            </span>
          </span>

          <button
            onClick={handleLoadDemoData}
            disabled={demoLoading}
            className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {demoLoading
              ? "Loading..."
              : "Load SIH Demo Data"}
          </button>
        </div>
      </section>

      {/* Agents */}

      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-100">
            Available Agents
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Agents currently available from the backend.
          </p>
        </div>

        {agents.length === 0 ? (
          <p className="text-sm text-slate-400">
            No agents available.
          </p>
        ) : (
          <div className="space-y-2">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="flex flex-col justify-between gap-1 rounded-md border border-slate-800 bg-slate-950 px-4 py-3 sm:flex-row sm:items-center"
              >
                <span className="text-sm font-medium text-slate-200">
                  {agent.name}
                </span>

                <span className="text-xs text-slate-500">
                  {agent.assigned_model}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* End-to-End Demo */}

      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-100">
            End-to-End Demo
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Run the complete maintenance-agent workflow.
          </p>
        </div>

        <div className="rounded-md border border-slate-800 bg-slate-950 p-4">
          <p className="text-sm leading-6 text-slate-300">
            {DEMO_QUERY}
          </p>
        </div>

        <button
          onClick={handleRunDemo}
          disabled={queryLoading}
          className="mt-4 rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {queryLoading
            ? "Running Agent Workflow..."
            : "Run Complete Demo"}
        </button>
      </section>

      {/* Agent Result */}

      {result && (
        <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <AgentResult result={result} />
        </section>
      )}

      {/* Audit Events */}

      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-100">
            Recent AI Workflow Audit Events
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Latest recorded AI workflow activity.
          </p>
        </div>

        {auditEvents.length === 0 ? (
          <p className="text-sm text-slate-400">
            No audit events found.
          </p>
        ) : (
          <div className="space-y-2">
            {auditEvents.slice(0, 10).map((event) => (
              <div
                key={event.id}
                className="rounded-md border border-slate-800 bg-slate-950 px-4 py-3"
              >
                <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:gap-2">
                  <span className="text-slate-500">
                    {event.timestamp}
                  </span>

                  <span className="font-medium text-slate-300">
                    {event.type}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-400">
                  {event.detail}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatusItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-slate-800 bg-slate-950 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-200">
        {value}
      </p>
    </div>
  );
}