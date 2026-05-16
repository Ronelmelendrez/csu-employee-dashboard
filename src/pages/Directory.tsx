import { useState, useMemo } from "react";
import { StatusBadge } from "../components/ui/index";
import { useDebounce, exportCSV } from "../utils/index";
import { Employee } from "../types/employee";
import { isConnectedWithCSU, isDeceased } from "../utils/csuConnectionStatus";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="mb-10 pb-8 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1.5 h-8 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600"></div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 to-emerald-900 bg-clip-text text-transparent m-0 tracking-tight">Employee Directory</h1>
          </div>
          <p className="text-lg text-gray-600 mt-3 font-medium">{filtered.length} employees found • Search, filter, and manage organization staff</p>
        </div>
        <button onClick={() => exportCSV(filtered)} className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0">
          <span>↓</span>
          <span>Export CSV</span>
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex gap-3 flex-wrap">
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="🔍 Search all columns…" className="flex-1 min-w-[200px] px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium" />
          <select value={filters.employmentStatus} onChange={e => setFilter("employmentStatus", e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer hover:border-gray-300">
            <option value="">All Status</option>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filters.officialStation} onChange={e => setFilter("officialStation", e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer hover:border-gray-300">
            <option value="">All Stations</option>
            {stations.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filters.categoryOfEmployment} onChange={e => setFilter("categoryOfEmployment", e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer hover:border-gray-300">
            <option value="">All Categories</option>
            {categories.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filters.connectedWithCSU} onChange={e => setFilter("connectedWithCSU", e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer hover:border-gray-300">
            <option value="">All Connected</option>
            <option>YES</option>
            <option>NO</option>
            <option>DECEASED</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                {COLS.map(col => (
                  <th key={col.key} onClick={() => handleSort(col.key)} className="px-5 py-4 text-left font-bold text-gray-700 text-xs uppercase tracking-wider cursor-pointer hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200 whitespace-nowrap select-none group">
                    <div className="flex items-center gap-1">
                      {col.label}
                      <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">{sortKey === col.key ? (sortDir === 1 ? "↑" : "↓") : ""}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr><td colSpan={COLS.length} className="py-16 text-center text-gray-400 text-sm font-medium">No employees match your filters</td></tr>
              )}
              {paged.map((emp, i) => (
                <tr key={`${emp.id}-${emp.no}-${i}`} onClick={() => onSelectEmployee(emp)}
                  className={`border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="px-5 py-3.5 text-gray-500 font-semibold text-sm">{emp.id}</td>
                  <td className="px-5 py-3.5 text-gray-900 font-semibold text-sm">{emp.currentRank}</td>
                  <td className="px-5 py-3.5 text-gray-800 text-sm">{emp.officialStation}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={emp.employmentStatus} small /></td>
                  <td className="px-5 py-3.5 text-gray-800 text-sm">{emp.categoryOfEmployment}</td>
                  <td className="px-5 py-3.5 text-gray-600 text-sm">{emp.courseProgram}</td>
                  <td className="px-5 py-3.5 text-gray-600 text-sm font-medium">{emp.schoolingStatus}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-lg font-bold ${isConnectedWithCSU(emp.connectedWithCSU) ? "text-emerald-600" : isDeceased(emp.connectedWithCSU) ? "text-purple-600" : "text-red-600"}`}>
                      {isConnectedWithCSU(emp.connectedWithCSU) ? "✓" : isDeceased(emp.connectedWithCSU) ? "†" : "✗"}
                    </span>
                  </td>
                </tr>
              ))}\n            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between flex-wrap gap-4">
            <span className="text-sm text-gray-600 font-medium">Page <span className="font-bold text-gray-900">{page}</span> of <span className="font-bold text-gray-900">{totalPages}</span> • <span className="text-blue-600">{filtered.length} results</span></span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">← Prev</button>
              {pageWindow.map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${p === page ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"}`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}