// frontend/lib/api/system.ts

import { apiFetch } from "./client";
import { mockSystemStatus } from "@/lib/mocks/system";
import type { SystemStatus } from "@/lib/types";

const USE_MOCKS =
  process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

export async function getSystemStatus(): Promise<SystemStatus> {
  if (USE_MOCKS) {
    return mockSystemStatus;
  }

  return apiFetch<SystemStatus>("/api/system/status");
}