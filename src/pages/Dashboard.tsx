import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { ChartCard, SummaryCard } from '../components/ui/index';
import { ScholarSummaryWidget } from '../components/ui/ScholarSummaryWidget';
import { groupBy, toChartData, CHART_PALETTE } from '../utils/index';
import { Employee } from '../types/employee';

export function DashboardPage({ employees }: { employees: Employee[] }) {
  const total = employees.length;
  const permanent = employees.filter(e => e.employmentStatus === "Permanent").length;
  const contractual = employees.filter(e => ["Contractual", "COS", "Job Order", "Casual"].includes(e.employmentStatus)).length;
  const connected = employees.filter(e => e.connectedWithCSU === "Yes").length;

  const statusData = toChartData(groupBy(employees, "employmentStatus"));
  const stationData = toChartData(groupBy(employees, "officialStation")).slice(0, 8);
  const uniqueByName = Array.from(
    employees.reduce((map, emp) => {
      const key = (emp.name || "").toString().trim().toLowerCase();
      if (key && !map.has(key)) {
        map.set(key, emp);
      }
      return map;
    }, new Map<string, Employee>()).values()
  );
  const categoryData = toChartData(groupBy(uniqueByName, "categoryOfEmployment"));

  // graduation year trend
  const gradYears: Record<string, number> = {};
  employees.forEach(e => {
    if (e.graduationDate) {
      const yr = String(e.graduationDate).slice(0, 4);
      if (yr.match(/^\d{4}$/) && Number(yr) > 1990 && Number(yr) <= 2026) {
        gradYears[yr] = (gradYears[yr] || 0) + 1;
      }
    }
  });
  const gradTrend = Object.entries(gradYears).sort((a, b) => Number(a[0]) - Number(b[0])).map(([year, count]) => ({ year, count }));

  return (
    <div>
      <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text)", margin: 0, letterSpacing: "-0.5px" }}>Dashboard Overview</h1>
        <p style={{ fontSize: 15, color: "var(--muted)", marginTop: 8, fontWeight: 500 }}>Caraga State University · Real-time Employee Analytics</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20, marginBottom: 32 }}>
        <SummaryCard label="Total Employees" value={total} icon="👥" color="#6366f1" />
        <SummaryCard label="Permanent" value={permanent} icon="✅" color="#10b981" sub={`${((permanent / total) * 100 || 0).toFixed(1)}% of total`} />
        <SummaryCard label="Contractual / COS" value={contractual} icon="📋" color="#f59e0b" sub={`${((contractual / total) * 100 || 0).toFixed(1)}% of total`} />
        <SummaryCard label="Connected with CSU" value={connected} icon="🏫" color="#0ea5e9" sub={`${((connected / total) * 100 || 0).toFixed(1)}% of total`} />
      </div>

      <ScholarSummaryWidget />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20, marginBottom: 20 }}>
        <ChartCard title="Employment Status Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {statusData.map((_, i) => <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Employees by Official Station">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stationData} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" fontSize={10} tick={{ fill: "var(--muted)" }} />
              <YAxis fontSize={10} tick={{ fill: "var(--muted)" }} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20 }}>
        <ChartCard title="Category of Employment">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={11}>
                {categoryData.map((_, i) => <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Graduation Year Trend">
          {gradTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={gradTrend} margin={{ left: -10 }}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="year" fontSize={10} tick={{ fill: "var(--muted)" }} />
                <YAxis fontSize={10} tick={{ fill: "var(--muted)" }} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#10b981" fill="url(#grad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: 13 }}>No graduation date data</div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}