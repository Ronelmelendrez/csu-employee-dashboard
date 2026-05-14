import { useFilteredEmployees } from '../hooks/useFilteredEmployees';
import { computeStats, getEmploymentStatusDistribution, getGraduationTrends } from '../utils/analyticsHelpers';
import { StatCard } from '../components/ui/StatCard';
import { PieChartCard } from '../components/charts/PieChartCard';
import { BarChartCard } from '../components/charts/BarChartCard';
import { LineChartCard } from '../components/charts/LineChartCard';
import { FiUsers, FiUserCheck, FiUserX, FiUserPlus, FiMapPin, FiAward } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const employees = useFilteredEmployees();
  const stats = computeStats(employees);
  const statusDistribution = getEmploymentStatusDistribution(employees);
  const graduationTrends = getGraduationTrends(employees);

  // Prepare station data (top 5)
  const stationData = Object.entries(stats.byStation)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="section-title text-4xl">Dashboard Overview</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">Welcome to Caraga State University Employee Dashboard</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Employees" value={stats.total} icon={<FiUsers size={24} />} trend={2.5} />
        <StatCard title="Active Employees" value={stats.active} icon={<FiUserCheck size={24} />} trend={1.8} />
        <StatCard title="Contractual" value={stats.contractual} icon={<FiUserX size={24} />} trend={-0.5} />
        <StatCard title="Permanent" value={stats.permanent} icon={<FiUserPlus size={24} />} trend={3.2} />
        <StatCard title="Connected with CSU" value={stats.connected} icon={<FiMapPin size={24} />} />
        <StatCard title="Official Stations" value={Object.keys(stats.byStation).length} icon={<FiAward size={24} />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartCard title="Employment Status Distribution" data={statusDistribution} />
        <BarChartCard title="Top Official Stations" data={stationData} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <LineChartCard title="Graduation Trends Over Years" data={graduationTrends} />
      </div>
    </motion.div>
  );
};