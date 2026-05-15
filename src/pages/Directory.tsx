import { useState, useMemo } from "react";
import { StatusBadge } from "../components/ui/index";
import { useDebounce, exportCSV } from "../utils/index";
import { Employee } from "../types/employee";

export function DirectoryPage({ employees, onSelectEmployee }: { employees: Employee[]; onSelectEmployee: (emp: Employee) => void }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ employmentStatus: "", officialStation: "", categoryOfEmployment: "", connectedWithCSU: "" });
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState(1);
  const PAGE_SIZE = 10;
  const debouncedSearch = useDebounce(search, 250);

  const statuses = [...new Set(employees.map(e => e.employmentStatus))].filter(Boolean);
  const stations = [...new Set(employees.map(e => e.officialStation))].filter(Boolean);
  const categories = [...new Set(employees.map(e => e.categoryOfEmployment))].filter(Boolean);

  const filtered = useMemo(() => {
    let d = employees;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      d = d.filter(e => Object.values(e).some(v => String(v).toLowerCase().includes(q)));
    }
    if (filters.employmentStatus) d = d.filter(e => e.employmentStatus === filters.employmentStatus);
    if (filters.officialStation) d = d.filter(e => e.officialStation === filters.officialStation);
    if (filters.categoryOfEmployment) d = d.filter(e => e.categoryOfEmployment === filters.categoryOfEmployment);
    if (filters.connectedWithCSU) d = d.filter(e => e.connectedWithCSU === filters.connectedWithCSU);
    d = [...d].sort((a, b) => {
      const av = a[sortKey as keyof Employee], bv = b[sortKey as keyof Employee];
      return typeof av === "number" ? (Number(av) - Number(bv)) * sortDir : String(av).localeCompare(String(bv)) * sortDir;
    });
    return d;
  }, [employees, debouncedSearch, filters, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const maxPageButtons = 7;
  const pageWindowStart = Math.max(1, Math.min(page - Math.floor(maxPageButtons / 2), totalPages - maxPageButtons + 1));
  const pageWindowEnd = Math.min(totalPages, pageWindowStart + maxPageButtons - 1);
  const pageWindow = Array.from({ length: Math.max(0, pageWindowEnd - pageWindowStart + 1) }, (_, i) => pageWindowStart + i);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => -d);
    else { setSortKey(key); setSortDir(1); }
    setPage(1);
  };

  const setFilter = (k: keyof typeof filters, v: string) => { setFilters(f => ({ ...f, [k]: v })); setPage(1); };

  const COLS = [
    { key: "id", label: "#" },
    { key: "currentRank", label: "Rank" },
    { key: "officialStation", label: "Station" },
    { key: "employmentStatus", label: "Status" },
    { key: "categoryOfEmployment", label: "Category" },
    { key: "courseProgram", label: "Program" },
    { key: "schoolingStatus", label: "Schooling" },
    { key: "connectedWithCSU", label: "Connected" },
  ];

  const selStyle = { background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 10px", fontSize: 12, color: "var(--text)", cursor: "pointer" } as React.CSSProperties;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, paddingBottom: 24, flexWrap: "wrap", gap: 12, borderBottom: "1px solid var(--border)" }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text)", margin: 0, letterSpacing: "-0.5px" }}>Employee Directory</h1>
          <p style={{ fontSize: 15, color: "var(--muted)", marginTop: 8, fontWeight: 500 }}>{filtered.length} employees found</p>
        </div>
        <button onClick={() => exportCSV(filtered)} style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }} onMouseEnter={e => {e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(16,185,129,0.4)";}} onMouseLeave={e => {e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(16,185,129,0.3)";}}>↓ Export CSV</button>
      </div>

      <div style={{ background: "var(--card)", borderRadius: 16, padding: 20, marginBottom: 20, border: "1px solid var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="🔍  Search all columns…" style={{ flex: "1 1 200px", ...selStyle, minWidth: 180 }} />
          <select value={filters.employmentStatus} onChange={e => setFilter("employmentStatus", e.target.value)} style={selStyle}>
            <option value="">All Status</option>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filters.officialStation} onChange={e => setFilter("officialStation", e.target.value)} style={selStyle}>
            <option value="">All Stations</option>
            {stations.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filters.categoryOfEmployment} onChange={e => setFilter("categoryOfEmployment", e.target.value)} style={selStyle}>
            <option value="">All Categories</option>
            {categories.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filters.connectedWithCSU} onChange={e => setFilter("connectedWithCSU", e.target.value)} style={selStyle}>
            <option value="">All Connected</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
      </div>

      <div style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)", background: "var(--hover)" }}>
                {COLS.map(col => (
                  <th key={col.key} onClick={() => handleSort(col.key)} style={{ padding: "14px 16px", textAlign: "left", fontWeight: 800, color: "var(--text)", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, cursor: "pointer", whiteSpace: "nowrap", userSelect: "none" }}>
                    {col.label} {sortKey === col.key ? (sortDir === 1 ? "↑" : "↓") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr><td colSpan={COLS.length} style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>No employees match your filters.</td></tr>
              )}
              {paged.map((emp, i) => (
                <tr key={`${emp.id}-${emp.no}-${i}`} onClick={() => onSelectEmployee(emp)}
                  style={{ borderBottom: "1px solid var(--border)", cursor: "pointer", background: i % 2 === 0 ? "transparent" : "var(--bg)", transition: "background 0.12s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--hover)"}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "var(--bg)"}
                >
                  <td style={{ padding: "10px 14px", color: "var(--muted)", fontWeight: 600 }}>{emp.id}</td>
                  <td style={{ padding: "10px 14px", color: "var(--text)", fontWeight: 500 }}>{emp.currentRank}</td>
                  <td style={{ padding: "10px 14px", color: "var(--text)" }}>{emp.officialStation}</td>
                  <td style={{ padding: "10px 14px" }}><StatusBadge status={emp.employmentStatus} small /></td>
                  <td style={{ padding: "10px 14px", color: "var(--text)" }}>{emp.categoryOfEmployment}</td>
                  <td style={{ padding: "10px 14px", color: "var(--muted)" }}>{emp.courseProgram}</td>
                  <td style={{ padding: "10px 14px", color: "var(--muted)" }}>{emp.schoolingStatus}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ color: emp.connectedWithCSU === "Yes" ? "#10b981" : "#ef4444", fontWeight: 700 }}>{emp.connectedWithCSU === "Yes" ? "✓" : "✗"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>Page {page} of {totalPages} · {filtered.length} results</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ ...selStyle, opacity: page === 1 ? 0.4 : 1 }}>← Prev</button>
              {pageWindow.map((p) => (
                <button key={p} onClick={() => setPage(p)} style={{ ...selStyle, background: p === page ? "#10b981" : "var(--bg)", color: p === page ? "#fff" : "var(--text)", fontWeight: p === page ? 700 : 400 }}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ ...selStyle, opacity: page === totalPages ? 0.4 : 1 }}>Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}