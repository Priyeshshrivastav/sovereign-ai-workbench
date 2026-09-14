export const DEFAULT_MACHINE_ID = "MACHINE-001";

export const DEMO_QUERY =
  "Analyze the current condition of MACHINE-001 using the inspection image, sensor data, and maintenance documentation. Identify possible issues and recommend the next maintenance action.";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000";

export const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/",
  },
  {
    label: "Documents",
    href: "/documents",
  },
  {
    label: "Knowledge Search",
    href: "/knowledge",
  },
  {
    label: "Telemetry",
    href: "/telemetry",
  },
  {
    label: "Visual Inspection",
    href: "/inspection",
  },
  {
    label: "Predictive Maintenance",
    href: "/maintenance",
  },
  {
    label: "Maintenance History",
    href: "/history",
  },
  {
    label: "Root Cause",
    href: "/root-cause",
  },
  {
    label: "Agents",
    href: "/agents",
  },
  {
    label: "Audit Logs",
    href: "/audit-logs",
  },
  {
    label: "Settings",
    href: "/settings",
  },
] as const;