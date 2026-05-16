import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, Legend } from 'recharts';
import { ChartCard, SummaryCard } from '../components/ui/index';
import { ScholarSummaryWidget } from '../components/ui/ScholarSummaryWidget';
import { groupBy, toChartData, CHART_PALETTE } from '../utils/index';
import { Employee } from '../types/employee';
import { isConnectedWithCSU, isDeceased } from '../utils/csuConnectionStatus';

export function DashboardPage({ employees }: { employees: Employee[] }) {
  const total = employees.length;
  const permanent = employees.filter(e => e.employmentStatus === "Permanent").length;
  const contractual = employees.filter(e => ["Contractual", "COS", "Job Order", "Casual"].includes(e.employmentStatus)).length;
  const connected = employees.filter(e => isConnectedWithCSU(e.connectedWithCSU)).length;
  const deceased = employees.filter(e => isDeceased(e.connectedWithCSU)).length;

  // Debug logging
  console.log(`Dashboard: Total employees=${total}, Connected=${connected}, Deceased=${deceased}`);
  console.log(`Connected status values in data:`, employees.map(e => e.connectedWithCSU).slice(0, 10));
  console.log(`Employees with connectedWithCSU="YES":`, employees.filter(e => e.connectedWithCSU === "YES").length);
  console.log(`Employees with connectedWithCSU="NO":`, employees.filter(e => e.connectedWithCSU === "NO").length);
  console.log(`Employees with connectedWithCSU="DECEASED":`, employees.filter(e => e.connectedWithCSU === "DECEASED").length);

  const statusData = toChartData(groupBy(employees, "employmentStatus"));
  const stationData = toChartData(groupBy(employees, "officialStation")).slice(0, 8);
  const uniqueByName = Array.from(
    employees.reduce((map, emp, idx) => {
      const key = (emp.name || "").toString().trim().toLowerCase() || `emp_${idx}`;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mb-10 pb-8 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1.5 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent m-0 tracking-tight">Dashboard Overview</h1>
        </div>
        <p className="text-lg text-gray-600 mt-3 font-medium">Caraga State University • Real-time Employee Analytics & Insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <SummaryCard label="Total Employees" value={total} icon="👥" color="#6366f1" />
        <SummaryCard label="Permanent Staff" value={permanent} icon="✅" color="#10b981" sub={`${((permanent / total) * 100 || 0).toFixed(1)}% of workforce`} />
        <SummaryCard label="Contractual / COS" value={contractual} icon="📋" color="#f59e0b" sub={`${((contractual / total) * 100 || 0).toFixed(1)}% of workforce`} />
        <SummaryCard label="Connected with CSU" value={connected} icon="🏫" color="#0ea5e9" sub={`${((connected / total) * 100 || 0).toFixed(1)}% still active`} />
      </div>

      <ScholarSummaryWidget employees={employees} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Employment Status Distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="40%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                {statusData.map((_, i) => <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />)}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-xs font-medium text-gray-700">{entry.payload.name}</span>
                )}
                wrapperStyle={{ paddingTop: "12px" }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 12px" }}
                formatter={(value: any) => [<span className="font-bold text-gray-900">{value}</span>, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Employees by Official Station">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stationData} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" fontSize={10} tick={{ fill: "var(--muted)" }} />
              <YAxis fontSize={10} tick={{ fill: "var(--muted)" }} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 12px" }}
                formatter={(value: any) => [<span className="font-bold text-gray-900">{value} employees</span>, ""]}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Category of Employment">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="40%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={10}>
                {categoryData.map((_, i) => <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />)}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-xs font-medium text-gray-700">{entry.payload.name}</span>
                )}
                wrapperStyle={{ paddingTop: "12px" }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 12px" }}
                formatter={(value: any) => [<span className="font-bold text-gray-900">{value}</span>, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Graduation Year Trend">
          {gradTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
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
                <Tooltip 
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 12px" }}
                  formatter={(value: any) => [<span className="font-bold text-gray-900">{value} graduates</span>, ""]}
                />
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