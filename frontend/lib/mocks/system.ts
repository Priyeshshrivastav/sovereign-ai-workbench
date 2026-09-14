import type { SystemStatus } from "@/lib/types/system";

export const mockSystemStatus: SystemStatus = {
  sovereignty: {
    mode: "SOVEREIGN_MODE",
    local_processing: true,
    external_api: false,
    air_gapped: true,
  },

  models: {
    text_llm: "Qwen2.5",
    vision_llm: "LLaVA",
    coding_llm: "Llama3.2",
    status: "online",
  },

  rag_engine: {
    status: "online",
  },

  vector_database: {
    status: "online",
    backend: "faiss",
  },

  indexed_documents: 4,

  recent_workflows: [],

  recent_audit_activity: [],
};