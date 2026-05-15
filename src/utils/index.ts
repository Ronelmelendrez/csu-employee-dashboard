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

// ─── Sample Data ──────────────────────────────────────────────────────────────
export const SAMPLE_DATA: Employee[] = [
  { id: 1, currentRank: "Professor I", officialStation: "Main Campus", categoryOfEmployment: "Teaching", employmentStatus: "Permanent", courseProgram: "BSCS", fundingSource: "GAA", universityAttended: "Caraga State University", contractDuration: "N/A", reinstatement: "No", schoolingStatus: "Graduated", graduationDate: "2015-03-01", connectedWithCSU: "Yes" },
  { id: 2, currentRank: "Instructor II", officialStation: "Cabadbaran Campus", categoryOfEmployment: "Teaching", employmentStatus: "Contractual", courseProgram: "BSED", fundingSource: "SUC", universityAttended: "Mindanao State University", contractDuration: "6 months", reinstatement: "No", schoolingStatus: "Graduated", graduationDate: "2018-06-15", connectedWithCSU: "Yes" },
  { id: 3, currentRank: "Administrative Officer", officialStation: "Main Campus", categoryOfEmployment: "Non-Teaching", employmentStatus: "Permanent", courseProgram: "N/A", fundingSource: "GAA", universityAttended: "University of the Philippines", contractDuration: "N/A", reinstatement: "Yes", schoolingStatus: "Graduated", graduationDate: "2010-10-20", connectedWithCSU: "Yes" },
  { id: 4, currentRank: "Lecturer", officialStation: "Butuan Campus", categoryOfEmployment: "Teaching", employmentStatus: "COS", courseProgram: "BSBA", fundingSource: "Income", universityAttended: "Caraga State University", contractDuration: "3 months", reinstatement: "No", schoolingStatus: "On Study Leave", graduationDate: "2023-05-01", connectedWithCSU: "Yes" },
  { id: 5, currentRank: "Instructor I", officialStation: "Main Campus", categoryOfEmployment: "Teaching", employmentStatus: "Permanent", courseProgram: "BSIT", fundingSource: "GAA", universityAttended: "Xavier University", contractDuration: "N/A", reinstatement: "No", schoolingStatus: "Graduated", graduationDate: "2017-04-12", connectedWithCSU: "No" },
  { id: 6, currentRank: "Professor III", officialStation: "Main Campus", categoryOfEmployment: "Teaching", employmentStatus: "Permanent", courseProgram: "MSIT", fundingSource: "GAA", universityAttended: "De La Salle University", contractDuration: "N/A", reinstatement: "No", schoolingStatus: "Graduated", graduationDate: "2008-03-30", connectedWithCSU: "Yes" },
  { id: 7, currentRank: "Associate Professor II", officialStation: "Cabadbaran Campus", categoryOfEmployment: "Teaching", employmentStatus: "Permanent", courseProgram: "PhD Education", fundingSource: "GAA", universityAttended: "Cebu Normal University", contractDuration: "N/A", reinstatement: "No", schoolingStatus: "Graduated", graduationDate: "2020-07-22", connectedWithCSU: "Yes" },
  { id: 8, currentRank: "Casual Employee", officialStation: "Butuan Campus", categoryOfEmployment: "Non-Teaching", employmentStatus: "Casual", courseProgram: "N/A", fundingSource: "Income", universityAttended: "Caraga State University", contractDuration: "1 year", reinstatement: "No", schoolingStatus: "Graduated", graduationDate: "2019-09-15", connectedWithCSU: "No" },
  { id: 9, currentRank: "Instructor III", officialStation: "Main Campus", categoryOfEmployment: "Teaching", employmentStatus: "Contractual", courseProgram: "BSMATH", fundingSource: "SUC", universityAttended: "Ateneo de Manila", contractDuration: "1 year", reinstatement: "Yes", schoolingStatus: "On Study Leave", graduationDate: "2024-12-01", connectedWithCSU: "Yes" },
  { id: 10, currentRank: "Job Order", officialStation: "Main Campus", categoryOfEmployment: "Non-Teaching", employmentStatus: "Job Order", courseProgram: "N/A", fundingSource: "Income", universityAttended: "Caraga State University", contractDuration: "3 months", reinstatement: "No", schoolingStatus: "Graduated", graduationDate: "2021-03-20", connectedWithCSU: "Yes" },
  { id: 11, currentRank: "Assistant Professor I", officialStation: "Cabadbaran Campus", categoryOfEmployment: "Teaching", employmentStatus: "Permanent", courseProgram: "BSED Science", fundingSource: "GAA", universityAttended: "Mindanao State University", contractDuration: "N/A", reinstatement: "No", schoolingStatus: "Graduated", graduationDate: "2013-06-10", connectedWithCSU: "Yes" },
  { id: 12, currentRank: "Instructor II", officialStation: "Butuan Campus", categoryOfEmployment: "Teaching", employmentStatus: "Contractual", courseProgram: "BSCS", fundingSource: "SUC", universityAttended: "Caraga State University", contractDuration: "6 months", reinstatement: "No", schoolingStatus: "Enrolled", graduationDate: "2025-06-01", connectedWithCSU: "Yes" },
  { id: 13, currentRank: "Professor II", officialStation: "Main Campus", categoryOfEmployment: "Teaching", employmentStatus: "Permanent", courseProgram: "PhD CS", fundingSource: "GAA", universityAttended: "University of the Philippines", contractDuration: "N/A", reinstatement: "No", schoolingStatus: "Graduated", graduationDate: "2011-10-05", connectedWithCSU: "No" },
  { id: 14, currentRank: "Administrative Aide", officialStation: "Cabadbaran Campus", categoryOfEmployment: "Non-Teaching", employmentStatus: "Permanent", courseProgram: "N/A", fundingSource: "GAA", universityAttended: "Caraga State University", contractDuration: "N/A", reinstatement: "No", schoolingStatus: "Graduated", graduationDate: "2016-04-18", connectedWithCSU: "Yes" },
  { id: 15, currentRank: "Lecturer", officialStation: "Main Campus", categoryOfEmployment: "Teaching", employmentStatus: "COS", courseProgram: "BSIT", fundingSource: "Income", universityAttended: "Xavier University", contractDuration: "3 months", reinstatement: "No", schoolingStatus: "On Study Leave", graduationDate: "2026-03-01", connectedWithCSU: "Yes" },
];

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
