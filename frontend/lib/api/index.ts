// frontend/lib/api/index.ts

import {
  AgentQueryRequest,
  AgentQueryResponse,
  AgentsResponse,
  AuditLogsResponse,
  DemoDataResponse,
  DocumentListResponse,
  DocumentUploadResponse,
  KnowledgeSearchRequest,
  KnowledgeSearchResponse,
  MaintenanceHistoryResponse,
  MaintenancePrediction,
  RootCauseResponse,
  SystemStatus,
  TelemetryAnalysis,
  VisionInspectionResponse,
} from "@/lib/types";

import { apiFetch, apiUpload } from "./client";

export async function getSystemStatus(): Promise<SystemStatus> {
  return apiFetch<SystemStatus>("/api/system/status");
}

export async function uploadDocument(
  file: File
): Promise<DocumentUploadResponse> {
  const formData = new FormData();

  formData.append("file", file);

  return apiUpload<DocumentUploadResponse>(
    "/api/documents/upload",
    formData
  );
}

export async function getDocuments(): Promise<DocumentListResponse> {
  return apiFetch<DocumentListResponse>("/api/documents");
}

export async function getDocument(
  documentId: string
): Promise<unknown> {
  return apiFetch<unknown>(
    `/api/documents/${encodeURIComponent(documentId)}`
  );
}

export async function searchKnowledgeBase(
  payload: KnowledgeSearchRequest
): Promise<KnowledgeSearchResponse> {
  return apiFetch<KnowledgeSearchResponse>(
    "/api/knowledge-base/search",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function getTelemetryAnalysis(
  machineId: string
): Promise<TelemetryAnalysis> {
  return apiFetch<TelemetryAnalysis>(
    `/api/telemetry/${encodeURIComponent(machineId)}/analysis`
  );
}

export async function inspectImage(
  image: File,
  machineId?: string
): Promise<VisionInspectionResponse> {
  const formData = new FormData();

  formData.append("image", image);

  if (machineId) {
    formData.append("machine_id", machineId);
  }

  return apiUpload<VisionInspectionResponse>(
    "/api/vision/inspect",
    formData
  );
}

export async function predictMaintenance(
  machineId: string
): Promise<MaintenancePrediction> {
  return apiFetch<MaintenancePrediction>(
    "/api/maintenance/predict",
    {
      method: "POST",
      body: JSON.stringify({
        machine_id: machineId,
      }),
    }
  );
}

export async function getMaintenanceHistory(
  machineId: string
): Promise<MaintenanceHistoryResponse> {
  return apiFetch<MaintenanceHistoryResponse>(
    `/api/maintenance/history/${encodeURIComponent(machineId)}`
  );
}

export async function investigateRootCause(
  machineId: string,
  context?: string
): Promise<RootCauseResponse> {
  return apiFetch<RootCauseResponse>(
    "/api/root-cause/investigate",
    {
      method: "POST",
      body: JSON.stringify({
        machine_id: machineId,
        ...(context ? { context } : {}),
      }),
    }
  );
}

export async function getAgents(): Promise<AgentsResponse> {
  return apiFetch<AgentsResponse>("/api/agents");
}

export async function runAgentQuery(
  payload: AgentQueryRequest
): Promise<AgentQueryResponse> {
  return apiFetch<AgentQueryResponse>(
    "/api/agents/query",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function loadDemoData(): Promise<DemoDataResponse> {
  return apiFetch<DemoDataResponse>(
    "/api/settings/demo-data/load",
    {
      method: "POST",
    }
  );
}

export async function getDemoDataStatus(): Promise<DemoDataResponse> {
  return apiFetch<DemoDataResponse>(
    "/api/settings/demo-data/status"
  );
}

export async function getAuditLogs(
  eventType?: string
): Promise<AuditLogsResponse> {
  const query = eventType
    ? `?event_type=${encodeURIComponent(eventType)}`
    : "";

  return apiFetch<AuditLogsResponse>(
    `/api/audit-logs${query}`
  );
}