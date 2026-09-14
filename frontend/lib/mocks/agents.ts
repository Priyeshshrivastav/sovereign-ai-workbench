import type { Agent, AgentsResponse } from "@/lib/types";

const mockAgents: Agent[] = [
  {
    id: "maint_assist",
    name: "Maintenance Assistant",
    assigned_model: "local-llm",
    tools: [
      "telemetry",
      "maintenance_history",
      "knowledge_search",
    ],
    knowledge_sources: [
      "Maintenance Manuals",
      "Failure Reports",
      "Maintenance Records",
    ],
    permissions: [
      "read_telemetry",
      "read_maintenance_history",
      "search_knowledge",
    ],
  },
  {
    id: "root_cause",
    name: "Root Cause Analyst",
    assigned_model: "local-llm",
    tools: [
      "telemetry",
      "knowledge_search",
      "root_cause_analysis",
    ],
    knowledge_sources: [
      "Failure Reports",
      "Incident Reports",
      "Maintenance Records",
    ],
    permissions: [
      "read_telemetry",
      "search_knowledge",
      "analyze_root_cause",
    ],
  },
  {
    id: "inspection",
    name: "Visual Inspection Agent",
    assigned_model: "vision-model",
    tools: [
      "image_analysis",
      "knowledge_search",
    ],
    knowledge_sources: [
      "Inspection Manuals",
      "Failure Reports",
    ],
    permissions: [
      "inspect_images",
      "search_knowledge",
    ],
  },
];

export async function getAgents(): Promise<AgentsResponse> {
  return {
    agents: mockAgents,
  };
}