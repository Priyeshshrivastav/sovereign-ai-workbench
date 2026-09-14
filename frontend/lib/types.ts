export type RiskLevel = "low" | "medium" | "high";

export type DemoDataStatus =
  | "not_loaded"
  | "loading"
  | "loaded";

export type WorkflowStatus =
  | "done"
  | "running"
  | "pending";

export interface ErrorResponse {
  error?: {
    code?: string;
    message?: string;
  };
}

export interface SovereigntyStatus {
  mode: string;
  local_processing: boolean;
  external_api: boolean;
  air_gapped: boolean;
}

export interface ModelsStatus {
  text_llm: string;
  vision_llm: string;
  coding_llm: string;
  status: string;
}

export interface RagEngineStatus {
  status: string;
}

export interface VectorDatabaseStatus {
  status: string;
  backend: string;
}

export interface SystemStatus {
  sovereignty: SovereigntyStatus;
  models: ModelsStatus;
  rag_engine: RagEngineStatus;
  vector_database: VectorDatabaseStatus;
  indexed_documents: number;
  recent_workflows: unknown[];
  recent_audit_activity: unknown[];
}

export interface Document {
  document_id: string;
  filename: string;
  type: "pdf" | "docx" | "csv" | "image" | string;
  security_classification: string;
  indexed_at: string;
}

export interface DocumentListResponse {
  documents: Document[];
}

export interface DocumentUploadResponse {
  document_id: string;
  filename: string;
  status: "processing" | "indexed" | string;
  security_classification: string;
}

export interface KnowledgeSearchRequest {
  query: string;
  top_k?: number;
}

export interface KnowledgeResult {
  document_id: string;
  chunk_text: string;
  page: number;
  score: number;
}

export interface KnowledgeSearchResponse {
  results: KnowledgeResult[];
}

export interface TelemetryPoint {
  timestamp: string;
  value: number;
  anomaly: boolean;
}

export interface TelemetrySignals {
  temperature: TelemetryPoint[];
  vibration: TelemetryPoint[];
  pressure: TelemetryPoint[];
}

export interface ThresholdViolation {
  signal?: string;
  timestamp?: string;
  value?: number;
  threshold?: number;
  detail?: string;
  [key: string]: unknown;
}

export interface TelemetryAnalysis {
  machine_id: string;
  signals: TelemetrySignals;
  threshold_violations: ThresholdViolation[];
}

export interface VisionFinding {
  defect_type: string;
  location: string;
  severity: "low" | "medium" | "high" | string;
}

export interface VisionInspectionResponse {
  machine_id: string | null;
  findings: VisionFinding[];
  annotated_image_url: string | null;
}

export interface Evidence {
  source: string;
  detail: string;
}

export interface MaintenancePrediction {
  machine_id: string;
  risk_level: RiskLevel;
  recommendation: string;
  evidence: Evidence[];
  confidence: number;
}

export interface MaintenanceHistoryItem {
  date: string;
  action: string;
  notes: string;
}

export interface MaintenanceHistoryResponse {
  history: MaintenanceHistoryItem[];
}

export interface RootCause {
  cause: string;
  confidence: number;
  evidence: Evidence[];
}

export interface RootCauseResponse {
  machine_id: string;
  ranked_causes: RootCause[];
}

export interface Agent {
  id: string;
  name: string;
  assigned_model: string;
  permissions: string[];
  tools: string[];
  knowledge_sources: string[];
}

export interface AgentsResponse {
  agents: Agent[];
}

export interface AgentWorkflowStep {
  step: string;
  status: WorkflowStatus;
  detail: string;
}

export interface AgentQueryRequest {
  agent_id: string;
  query: string;
  machine_id?: string;
  attachments?: string[];
}

export interface AgentQueryResponse {
  machine_status: string | null;
  risk_level: RiskLevel | null;
  evidence: Evidence[];
  citations: Citation[];
  confidence: number;
  recommended_action: string;
  workflow_steps: AgentWorkflowStep[];
}

export interface Citation {
  document_id: string;
  page: number;
}

export interface DemoDataResponse {
  status: DemoDataStatus;
}

export interface AuditEvent {
  id: string;
  type: string;
  timestamp: string;
  actor: string;
  detail: string;
}

export interface AuditLogsResponse {
  events: AuditEvent[];
}