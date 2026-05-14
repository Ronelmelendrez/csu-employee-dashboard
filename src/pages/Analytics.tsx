import { useFilteredEmployees } from '../hooks/useFilteredEmployees';
import { 
  getEmploymentStatusDistribution, 
  getFundingSourceBreakdown, 
  getUniversityStatistics,
  computeStats 
} from '../utils/analyticsHelpers';
import { PieChartCard } from '../components/charts/PieChartCard';
import { BarChartCard } from '../components/charts/BarChartCard';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';

export const Analytics = () => {
  const employees = useFilteredEmployees();
  const statusDistribution = getEmploymentStatusDistribution(employees);
  const fundingBreakdown = getFundingSourceBreakdown(employees);
  const universityStats = getUniversityStatistics(employees);
  const stats = computeStats(employees);

  // Prepare category distribution
  const categoryDistribution = Object.entries(
    employees.reduce((acc, emp) => {
      const cat = emp.categoryOfEmployment || 'Unknown';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Connected vs disconnected
  const connectionData = [
    { name: 'Connected', value: stats.connected },
    { name: 'Not Connected', value: stats.total - stats.connected },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="section-title text-4xl">Advanced Analytics</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">Deep dive into employee metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartCard title="Employment Status Distribution" data={statusDistribution} />
        <PieChartCard title="Funding Source Breakdown" data={fundingBreakdown} />
        <PieChartCard title="Category of Employment" data={categoryDistribution} />
        <PieChartCard title="CSU Connection Status" data={connectionData} colors={['#10b981', '#ef4444']} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <BarChartCard title="Top 10 Universities Attended" data={universityStats} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Total Employees</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.total}</p>
        </Card>
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Unique Stations</h3>
          <p className="text-3xl font-bold text-primary-600">{Object.keys(stats.byStation).length}</p>
        </Card>
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Unique Ranks</h3>
          <p className="text-3xl font-bold text-primary-600">{Object.keys(stats.byRank).length}</p>
        </Card>
      </div>
    </motion.div>
  );
};