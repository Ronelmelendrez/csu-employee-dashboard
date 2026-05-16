import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie, Treemap } from "recharts";
import { ChartCard } from "../components/ui/index";
import { groupBy, toChartData, CHART_PALETTE } from "../utils/index";
import { Employee } from "../types/employee";
import { isConnectedWithCSU } from "../utils/csuConnectionStatus";

export function AnalyticsPage({ employees }: { employees: Employee[] }) {
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
    <div>
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-4xl font-black text-gray-900 m-0 tracking-tight">Advanced Analytics</h1>
        <p className="text-base text-gray-600 mt-2 font-medium">Deep insights into employee data and trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <ChartCard title="Funding Source Breakdown">
          <ResponsiveContainer width="100%" height={240}>
            <Treemap data={fundingTreemapData} dataKey="value" stroke="#fff" fill="#8884d8" isAnimationActive={true}>
              {fundingTreemapData[0]?.children?.map((_, i) => <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />)}
              <Tooltip 
                contentStyle={{ backgroundColor: "transparent", border: "none", padding: 0 }}
                content={({ payload }) => {
                  if (payload && payload.length > 0) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border border-gray-300 rounded px-3 py-2 shadow-md">
                        <div className="text-sm font-semibold text-black mb-1">{data.name}</div>
                        <div className="text-xs text-gray-600">Employees: {data.value}</div>
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
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={schoolingData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}\n${value}`} fontSize={11}>
                {schoolingData.map((_, i) => <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Universities / DHEI">
          <ResponsiveContainer width="100%" height={240}>
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
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={connectedData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} dataKey="value" label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`} fontSize={11}>
                <Cell fill="#10b981" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Reinstatement Distribution">
          <ResponsiveContainer width="100%" height={240}>
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
          <div className="flex flex-col gap-3">
            {[
              { label: "Most Common Rank", val: toChartData(groupBy(employees, "currentRank"))[0]?.name || "—" },
              { label: "Top Station", val: toChartData(groupBy(employees, "officialStation"))[0]?.name || "—" },
              { label: "Top Funding Source", val: toChartData(groupBy(employees, "fundingSource"))[0]?.name || "—" },
              { label: "Most Common Program", val: toChartData(groupBy(employees, "courseProgram")).filter(d => d.name !== "N/A")[0]?.name || "—" },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between items-center p-3.5 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-xs text-gray-600 font-medium">{label}</span>
                <span className="text-sm text-gray-900 font-bold">{val}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}