import { useState, useEffect } from "react";
import { Employee } from "../types/employee";

// ─── Types & Constants ───────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "directory", label: "Directory", icon: "☰" },
  { id: "analytics", label: "Analytics", icon: "◈" },
];

export const STATUS_COLORS: Record<string, string> = {
  Permanent: "#10b981",
  Contractual: "#f59e0b",
  Casual: "#6366f1",
  COS: "#ec4899",
  "Job Order": "#8b5cf6",
  default: "#64748b",
};

export const CHART_PALETTE = ["#10b981", "#6366f1", "#f59e0b", "#ec4899", "#0ea5e9", "#8b5cf6", "#f97316", "#14b8a6"];

// ─── Utility Functions ────────────────────────────────────────────────────────
export function groupBy(arr: Employee[], key: keyof Employee): Record<string, number> {
  return arr.reduce((acc, item) => {
    const val = String(item[key]) || "Unknown";
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export function toChartData(obj: Record<string, number>): Array<{ name: string; value: number }> {
  return Object.entries(obj)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function exportCSV(data: Employee[]): void {
  const headers = ["No.", "Current Rank", "Official Station", "Category", "Employment Status", "Program", "Funding Source", "Schooling Status", "Connected with CSU"];
  const rows = data.map(e => [e.id, e.currentRank, e.officialStation, e.categoryOfEmployment, e.employmentStatus, e.courseProgram, e.fundingSource, e.schoolingStatus, e.connectedWithCSU]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "csu_employees.csv";
  a.click();
}

export function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
