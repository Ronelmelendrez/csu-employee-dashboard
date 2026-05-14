import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie } from "recharts";
import { ChartCard } from "../components/ui/index";
import { groupBy, toChartData, CHART_PALETTE } from "../utils/index";
import { Employee } from "../types/employee";

export function AnalyticsPage({ employees }: { employees: Employee[] }) {
  const fundingData = toChartData(groupBy(employees, "fundingSource"));
  const schoolingData = toChartData(groupBy(employees, "schoolingStatus"));
  const universityData = toChartData(groupBy(employees, "universityAttended")).slice(0, 8);
  const connectedData = [
    { name: "Connected", value: employees.filter(e => e.connectedWithCSU === "Yes").length },
    { name: "Not Connected", value: employees.filter(e => e.connectedWithCSU !== "Yes").length },
  ];
  const reinstatementData = toChartData(groupBy(employees, "reinstatement"));

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", margin: 0 }}>Analytics</h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Deep insights into employee data</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        <ChartCard title="Funding Source Breakdown">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={fundingData} layout="vertical" margin={{ left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" fontSize={10} tick={{ fill: "var(--muted)" }} />
              <YAxis type="category" dataKey="name" fontSize={11} tick={{ fill: "var(--text)" }} width={80} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {fundingData.map((_, i) => <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Schooling Status">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={schoolingData} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({ name, value }) => `${name}\n${value}`} fontSize={11}>
                {schoolingData.map((_, i) => <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Universities / DHEI">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={universityData} layout="vertical" margin={{ left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" fontSize={10} tick={{ fill: "var(--muted)" }} />
              <YAxis type="category" dataKey="name" fontSize={10} tick={{ fill: "var(--text)" }} width={130} />
              <Tooltip />
              <Bar dataKey="value" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Connected vs Not Connected">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={connectedData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`} fontSize={11}>
                <Cell fill="#10b981" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Reinstatement Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={reinstatementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" fontSize={11} tick={{ fill: "var(--text)" }} />
              <YAxis fontSize={10} tick={{ fill: "var(--muted)" }} />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Summary Insights">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Most Common Rank", val: toChartData(groupBy(employees, "currentRank"))[0]?.name || "—" },
              { label: "Top Station", val: toChartData(groupBy(employees, "officialStation"))[0]?.name || "—" },
              { label: "Top Funding Source", val: toChartData(groupBy(employees, "fundingSource"))[0]?.name || "—" },
              { label: "Most Common Program", val: toChartData(groupBy(employees, "courseProgram")).filter(d => d.name !== "N/A")[0]?.name || "—" },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--bg)", borderRadius: 10, border: "1px solid var(--border)" }}>
                <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 700 }}>{val}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}