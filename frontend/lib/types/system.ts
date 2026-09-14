export interface SovereigntyStatus {
  mode: string;
  local_processing: boolean;
  external_api: boolean;
  air_gapped: boolean;
}

export interface ModelStatus {
  text_llm: string;
  vision_llm: string;
  coding_llm: string;
  status: "online" | "offline";
}

export interface SystemStatus {
  sovereignty: SovereigntyStatus;
  models: ModelStatus;
  rag_engine: {
    status: "online" | "offline";
  };
  vector_database: {
    status: "online" | "offline";
    backend: "faiss" | "qdrant";
  };
  indexed_documents: number;
  recent_workflows: unknown[];
  recent_audit_activity: unknown[];
}