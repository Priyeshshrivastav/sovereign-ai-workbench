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
  VisionInspectionResponse
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options?.body instanceof FormData
        ? {}
        : {
            "Content-Type": "application/json"
          }),
      ...(options?.headers || {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const data = await response.json();

      if (data?.error?.message) {
        message = data.error.message;
      }
    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function getSystemStatus(): Promise<SystemStatus> {
  return request<SystemStatus>("/api/system/status");
}

export async function uploadDocument(
  file: File
): Promise<DocumentUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return request<DocumentUploadResponse>("/api/documents/upload", {
    method: "POST",
    body: formData
  });
}

export async function getDocuments(): Promise<DocumentListResponse> {
  return request<DocumentListResponse>("/api/documents");
}

export async function getDocument(
  documentId: string
): Promise<unknown> {
  return request(`/api/documents/${encodeURIComponent(documentId)}`);
}

export async function searchKnowledgeBase(
  payload: KnowledgeSearchRequest
): Promise<KnowledgeSearchResponse> {
  return request<KnowledgeSearchResponse>(
    "/api/knowledge-base/search",
    {
      method: "POST",
      body: JSON.stringify(payload)
    }
  );
}

export async function getTelemetryAnalysis(
  machineId: string
): Promise<TelemetryAnalysis> {
  return request<TelemetryAnalysis>(
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

  return request<VisionInspectionResponse>(
    "/api/vision/inspect",
    {
      method: "POST",
      body: formData
    }
  );
}

export async function predictMaintenance(
  machineId: string
): Promise<MaintenancePrediction> {
  return request<MaintenancePrediction>(
    "/api/maintenance/predict",
    {
      method: "POST",
      body: JSON.stringify({
        machine_id: machineId
      })
    }
  );
}

export async function getMaintenanceHistory(
  machineId: string
): Promise<MaintenanceHistoryResponse> {
  return request<MaintenanceHistoryResponse>(
    `/api/maintenance/history/${encodeURIComponent(machineId)}`
  );
}

export async function investigateRootCause(
  machineId: string,
  context?: string
): Promise<RootCauseResponse> {
  return request<RootCauseResponse>(
    "/api/root-cause/investigate",
    {
      method: "POST",
      body: JSON.stringify({
        machine_id: machineId,
        ...(context ? { context } : {})
      })
    }
  );
}

export async function getAgents(): Promise<AgentsResponse> {
  return request<AgentsResponse>("/api/agents");
}

export async function runAgentQuery(
  payload: AgentQueryRequest
): Promise<AgentQueryResponse> {
  return request<AgentQueryResponse>(
    "/api/agents/query",
    {
      method: "POST",
      body: JSON.stringify(payload)
    }
  );
}

export async function loadDemoData(): Promise<DemoDataResponse> {
  return request<DemoDataResponse>(
    "/api/settings/demo-data/load",
    {
      method: "POST"
    }
  );
}

export async function getDemoDataStatus(): Promise<DemoDataResponse> {
  return request<DemoDataResponse>(
    "/api/settings/demo-data/status"
  );
}

export async function getAuditLogs(
  eventType?: string
): Promise<AuditLogsResponse> {
  const query = eventType
    ? `?event_type=${encodeURIComponent(eventType)}`
    : "";

  return request<AuditLogsResponse>(
    `/api/audit-logs${query}`
  );
}