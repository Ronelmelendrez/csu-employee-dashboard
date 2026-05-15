import { useState, useEffect } from "react";
import { DashboardPage } from "./pages/Dashboard";
import { DirectoryPage } from "./pages/Directory";
import { AnalyticsPage } from "./pages/Analytics";
import { EmployeeDrawer } from "./components/ui/index";
import { NAV_ITEMS } from "./utils/index";
import { useGoogleSheetsSync } from "./hooks/useGoogleSheetsSync";
import { Employee } from "./types/employee";

export default function App() {
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [selected, setSelected] = useState<Employee | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Initialize Google Sheets sync
  const { employees, loading, error, syncFromSheet } = useGoogleSheetsSync({
    webAppUrl: import.meta.env.VITE_GOOGLE_SHEETS_URL || "",
    defaultSheetName: "Masterlist",
    onSuccess: (data) => console.log(`✓ Synced ${data.length} employees`),
    onError: (err) => console.error(`✗ Sync failed: ${err}`),
  });

  // Fetch data on mount
  useEffect(() => {
    if (import.meta.env.VITE_GOOGLE_SHEETS_URL) {
      syncFromSheet("Masterlist");
    } else {
      console.warn("⚠️  VITE_GOOGLE_SHEETS_URL not configured in .env.local");
    }
  }, [syncFromSheet]);

  const theme = {
    "--bg": dark ? "#0f172a" : "#f8fafc",
    "--card": dark ? "#1e293b" : "#ffffff",
    "--text": dark ? "#f1f5f9" : "#0f172a",
    "--muted": dark ? "#94a3b8" : "#64748b",
    "--border": dark ? "#334155" : "#e2e8f0",
    "--hover": dark ? "#334155" : "#f1f5f9",
    "--sidebar": dark ? "#1e293b" : "#ffffff",
    "--accent": "#10b981",
  } as React.CSSProperties;

  return (
    <div style={{ ...theme, minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", display: "flex" }}>
      {/* Sidebar */}
      <aside style={{ width: sidebarOpen ? 220 : 64, background: "var(--sidebar)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", transition: "width 0.22s", flexShrink: 0, overflow: "hidden" }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🎓</div>
          {sidebarOpen && <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", whiteSpace: "nowrap" }}>CSU Portal</div>
            <div style={{ fontSize: 10, color: "var(--muted)", whiteSpace: "nowrap" }}>Employee Dashboard</div>
          </div>}
        </div>
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: page === item.id ? "#10b98118" : "transparent", color: page === item.id ? "#10b981" : "var(--muted)", fontWeight: page === item.id ? 700 : 500, fontSize: 13, transition: "all 0.15s", marginBottom: 2, whiteSpace: "nowrap" }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "12px 8px", borderTop: "1px solid var(--border)" }}>
          <button onClick={() => setDark(d => !d)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: "transparent", color: "var(--muted)", fontSize: 13, whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 18 }}>{dark ? "☀️" : "🌙"}</span>
            {sidebarOpen && (dark ? "Light Mode" : "Dark Mode")}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "12px 24px", display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 10 }}>
          <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, width: 34, height: 34, cursor: "pointer", fontSize: 16, color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>☰</button>
          <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Caraga State University — Employee Management System</div>
          <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{loading ? "Syncing..." : error ? "❌ Sync Error" : `${employees.length} records loaded`}</div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: "28px 28px", overflowY: "auto" }}>
          {page === "dashboard" && <DashboardPage employees={employees} />}
          {page === "directory" && <DirectoryPage employees={employees} onSelectEmployee={setSelected} />}
          {page === "analytics" && <AnalyticsPage employees={employees} />}
        </main>
      </div>

      {selected && <EmployeeDrawer employee={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}