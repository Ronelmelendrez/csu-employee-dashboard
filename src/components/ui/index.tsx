import { useState, useCallback, useRef } from "react";
import { parseExcel, STATUS_COLORS } from "../../utils/index";
import { Employee } from "../../types/employee";

// ─── StatusBadge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status, small }: { status: string; small?: boolean }) {
  const color = STATUS_COLORS[status] || STATUS_COLORS.default;
  return (
    <span style={{ background: color + "22", color, border: `1px solid ${color}55`, borderRadius: 6, padding: small ? "2px 8px" : "3px 10px", fontSize: small ? 11 : 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}

// ─── SummaryCard ─────────────────────────────────────────────────────────────
export function SummaryCard({ label, value, icon, color, sub }: { label: string; value: number; icon: string; color: string; sub?: string }) {
  return (
    <div style={{ background: "var(--card)", borderRadius: 16, padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s ease", cursor: "default", position: "relative", overflow: "hidden" }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
        e.currentTarget.style.borderColor = color + "40";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
        e.currentTarget.style.borderColor = "var(--border)";
      }}
    >
      <div style={{ width: 56, height: 56, borderRadius: 14, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0, border: `1px solid ${color}30` }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", lineHeight: 1.1, letterSpacing: "-0.3px" }}>{value}</div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.3 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color, marginTop: 6, fontWeight: 700 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── ChartCard ────────────────────────────────────────────────────────────────
export function ChartCard({ title, children, span }: { title: string; children: React.ReactNode; span?: number }) {
  return (
    <div style={{ background: "var(--card)", borderRadius: 16, padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", border: "1px solid var(--border)", gridColumn: span ? `span ${span}` : "span 1", transition: "all 0.2s ease" }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", marginBottom: 20, letterSpacing: 0.2, textTransform: "uppercase", opacity: 0.95 }}>{title}</div>
      {children}
    </div>
  );
}

// ─── Employee Drawer ──────────────────────────────────────────────────────────
export function EmployeeDrawer({ employee, onClose }: { employee: Employee | null; onClose: () => void }) {
  if (!employee) return null;
  const fields = [
    ["Current Rank", employee.currentRank],
    ["Official Station", employee.officialStation],
    ["Category", employee.categoryOfEmployment],
    ["Employment Status", employee.employmentStatus],
    ["Course / Program", employee.courseProgram],
    ["Funding Source", employee.fundingSource],
    ["University Attended", employee.universityAttended],
    ["Contract Duration", employee.contractDuration],
    ["Reinstatement", employee.reinstatement],
    ["Schooling Status", employee.schoolingStatus],
    ["Graduation Date", employee.graduationDate],
    ["Connected with CSU", employee.connectedWithCSU],
  ];
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50, backdropFilter: "blur(3px)" }} />
      <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: "min(420px, 100vw)", background: "var(--card)", zIndex: 51, boxShadow: "-8px 0 32px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "24px 24px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>Employee #{employee.id}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{employee.currentRank}</div>
          </div>
          <button onClick={onClose} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ padding: "16px 24px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <StatusBadge status={employee.employmentStatus} />
          <span style={{ background: employee.connectedWithCSU === "Yes" ? "#10b98122" : "#ef444422", color: employee.connectedWithCSU === "Yes" ? "#10b981" : "#ef4444", border: `1px solid ${employee.connectedWithCSU === "Yes" ? "#10b98155" : "#ef444455"}`, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
            {employee.connectedWithCSU === "Yes" ? "✓ Connected" : "✗ Not Connected"}
          </span>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "0 24px 24px" }}>
          {fields.map(([label, value]) => (
            <div key={label} style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>{value || "—"}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Upload Banner ────────────────────────────────────────────────────────────
export function UploadBanner({ onUpload, hasData }: { onUpload: (data: Employee[]) => void; hasData: boolean }) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = useCallback(async (file: File | null) => {
    if (!file) return;
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setError("Please upload an Excel file (.xlsx or .xls)");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await parseExcel(file);
      onUpload(data);
    } catch {
      setError("Failed to parse file. Check the format.");
    } finally {
      setLoading(false);
    }
  }, [onUpload]);

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files[0]); }}
      onClick={() => inputRef.current?.click()}
      style={{ border: `2px dashed ${dragging ? "#10b981" : "var(--border)"}`, borderRadius: 14, padding: "32px 24px", textAlign: "center", cursor: "pointer", background: dragging ? "#10b98108" : "var(--card)", transition: "all 0.2s", margin: "0 0 24px" }}
    >
      <input ref={inputRef} type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={e => handle(e.target.files?.[0] || null)} />
      <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
      <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{loading ? "Parsing spreadsheet…" : hasData ? "Upload a different Excel file" : "Upload Employee Spreadsheet"}</div>
      <div style={{ fontSize: 12, color: "var(--muted)" }}>Drag & drop or click · .xlsx / .xls</div>
      {error && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 8 }}>{error}</div>}
    </div>
  );
}
