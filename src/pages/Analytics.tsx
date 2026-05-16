import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie, Treemap, Legend } from "recharts";
import { ChartCard } from "../components/ui/index";
import { groupBy, toChartData, CHART_PALETTE } from "../utils/index";
import { Employee } from "../types/employee";
import { isConnectedWithCSU } from "../utils/csuConnectionStatus";

export function AnalyticsPage({ employees }: { employees: Employee[] }) {
  const {
    CSU_GREEN,
    CSU_GOLD,
  } = {
    CSU_GREEN: "#006B3F",
    CSU_GOLD: "#FFC72C",
  };
  const fundingData = toChartData(groupBy(employees, "fundingSource"));
  const fundingTreemapData = [
    {
      name: "Funding Sources",
      children: fundingData.map(item => ({
        name: item.name,
        value: item.value
      }))
    }
  ];
  const schoolingData = toChartData(groupBy(employees, "schoolingStatus"));
  const universityData = toChartData(groupBy(employees, "universityAttended")).slice(0, 8);
  const connectedData = [
    { name: "Connected", value: employees.filter(e => isConnectedWithCSU(e.connectedWithCSU)).length },
    { name: "Not Connected", value: employees.filter(e => !isConnectedWithCSU(e.connectedWithCSU)).length },
  ];
  const reinstatementData = toChartData(groupBy(employees, "reinstatement"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="mb-10 pb-8 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1.5 h-8 rounded-full" style={{ background: CSU_GREEN }}></div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent m-0 tracking-tight">Advanced Analytics</h1>
        </div>
        <p className="text-lg text-gray-600 mt-3 font-medium leading-relaxed max-w-2xl">Comprehensive insights and deep analysis of employee data, trends, and organizational metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChartCard title="Funding Source Breakdown">
          <ResponsiveContainer width="100%" height={240}>
            <Treemap data={fundingTreemapData} dataKey="value" stroke="#fff" fill="#8884d8" isAnimationActive={true}>
              {fundingTreemapData[0]?.children?.map((_, i) => <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />)}
              <Tooltip 
                content={({ payload }) => {
                  if (payload && payload.length > 0) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
                        <div className="text-sm font-bold text-gray-900">{data.name}</div>
                        <div className="text-xs text-blue-600 font-semibold mt-1">{data.value} employees</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </Treemap>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Schooling Status">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={schoolingData} cx="50%" cy="40%" outerRadius={85} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={10} labelLine={false}>
                {schoolingData.map((_, i) => <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />)}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-xs font-medium text-gray-700">{entry.payload.name}</span>
                )}
                wrapperStyle={{ paddingTop: "16px" }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 12px" }}
                formatter={(value: any) => [<span className="font-bold text-gray-900">{value}</span>, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Universities / DHEI">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={universityData} layout="vertical" margin={{ left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" fontSize={10} tick={{ fill: "var(--muted)" }} />
              <YAxis type="category" dataKey="name" fontSize={10} tick={{ fill: "var(--text)" }} width={130} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 12px" }}
                formatter={(value: any) => [<span className="font-bold text-gray-900">{value} employees</span>, ""]}
              />
              <Bar dataKey="value" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Connected vs Not Connected">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={connectedData} cx="50%" cy="40%" innerRadius={50} outerRadius={85} dataKey="value" label={({ name, value, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} fontSize={10} labelLine={false}>
                <Cell fill="#10b981" />
                <Cell fill="#ef4444" />
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-xs font-medium text-gray-700">{entry.payload.name}</span>
                )}
                wrapperStyle={{ paddingTop: "16px" }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 12px" }}
                formatter={(value: any) => [<span className="font-bold text-gray-900">{value}</span>, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Reinstatement Distribution">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={reinstatementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" fontSize={11} tick={{ fill: "var(--text)" }} />
              <YAxis fontSize={10} tick={{ fill: "var(--muted)" }} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 12px" }}
                formatter={(value: any) => [<span className="font-bold text-gray-900">{value} employees</span>, ""]}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Summary Insights">
          <div className="flex flex-col gap-3.5">
            {[
              { label: "Most Common Rank", val: toChartData(groupBy(employees, "currentRank"))[0]?.name || "—" },
              { label: "Top Station", val: toChartData(groupBy(employees, "officialStation"))[0]?.name || "—" },
              { label: "Top Funding Source", val: toChartData(groupBy(employees, "fundingSource"))[0]?.name || "—" },
              { label: "Most Common Program", val: toChartData(groupBy(employees, "courseProgram")).filter(d => d.name !== "N/A")[0]?.name || "—" },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-all duration-200">
                <span className="text-sm text-gray-600 font-semibold">{label}</span>
                <span className="text-base text-gray-900 font-bold truncate ml-2">{val}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}