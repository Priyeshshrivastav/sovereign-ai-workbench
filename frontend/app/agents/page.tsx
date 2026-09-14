"use client";

import { useEffect, useState } from "react";
import {
  getAgents,
  runAgentQuery,
} from "@/lib/api";
import {
  Agent,
  AgentQueryResponse,
} from "@/lib/types";
import {
  DEFAULT_MACHINE_ID,
  DEMO_QUERY,
} from "@/lib/constants";
import Loading from "@/components/ui/Loading";
import ErrorMessage from "@/components/ui/ErrorMessage";
import AgentResult from "@/components/workflow/AgentResult";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("");

  const [query, setQuery] = useState(DEMO_QUERY);

  const [machineId, setMachineId] =
    useState(DEFAULT_MACHINE_ID);

  const [result, setResult] =
    useState<AgentQueryResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [queryLoading, setQueryLoading] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await getAgents();

        setAgents(response.agents);

        const maintenanceAgent =
          response.agents.find(
            (agent) =>
              agent.id === "maint_assist" ||
              agent.name === "Maintenance Assistant"
          );

        if (maintenanceAgent) {
          setSelectedAgent(maintenanceAgent.id);
        } else if (response.agents.length > 0) {
          setSelectedAgent(response.agents[0].id);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load agents."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!selectedAgent) {
      setError("Select an agent.");
      return;
    }

    setQueryLoading(true);
    setError("");

    try {
      const response = await runAgentQuery({
        agent_id: selectedAgent,
        query,
        machine_id: machineId,
      });

      setResult(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Agent query failed."
      );
    } finally {
      setQueryLoading(false);
    }
  }

  if (loading) {
    return <Loading message="Loading agents..." />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
          Agent Workspace
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          View available agents and execute agent workflows.
        </p>
      </div>

      {/* Error */}
      {error && <ErrorMessage message={error} />}

      {/* Available Agents */}
      <section className="card">
        <div className="mb-4">
          <h2 className="section-title">
            Available Agents
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Agents available for local workflow execution.
          </p>
        </div>

        {agents.length === 0 ? (
          <p className="muted">
            No agents available.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="rounded-md border border-slate-800 bg-slate-950 p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-slate-100">
                      {agent.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {agent.id}
                    </p>
                  </div>

                  <span className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-400">
                    {agent.assigned_model}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500">
                      Tools:{" "}
                    </span>

                    <span className="text-slate-300">
                      {agent.tools.join(", ") || "None"}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">
                      Sources:{" "}
                    </span>

                    <span className="text-slate-300">
                      {agent.knowledge_sources.join(", ") ||
                        "None"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Run Agent */}
      <section className="card">
        <div className="mb-5">
          <h2 className="section-title">
            Run Agent
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Send a query to the selected agent.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Agent */}
          <div>
            <label
              htmlFor="agent"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Agent
            </label>

            <select
              id="agent"
              value={selectedAgent}
              onChange={(event) =>
                setSelectedAgent(event.target.value)
              }
              className="input"
            >
              {agents.map((agent) => (
                <option
                  key={agent.id}
                  value={agent.id}
                >
                  {agent.name}
                </option>
              ))}
            </select>
          </div>

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
              className="input"
              placeholder="Enter machine ID"
            />
          </div>

          {/* Query */}
          <div>
            <label
              htmlFor="query"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Query
            </label>

            <textarea
              id="query"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              rows={8}
              className="input resize-y"
              placeholder="Enter your agent query..."
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={queryLoading}
              className="button-primary"
            >
              {queryLoading
                ? "Running..."
                : "Run Agent"}
            </button>
          </div>
        </form>
      </section>

      {/* Result */}
      {result && (
        <section className="card">
          <div className="mb-4">
            <h2 className="section-title">
              Agent Result
            </h2>
          </div>

          <AgentResult result={result} />
        </section>
      )}
    </div>
  );
}