import { FiAward, FiBookOpen, FiBriefcase, FiCheckCircle } from 'react-icons/fi';
import { computeEmployeeScholarStats } from '../../utils/analyticsHelpers';
import { Employee } from '../../types/employee';
import { StatCard } from './StatCard';

export const ScholarSummaryWidget = ({ employees }: { employees: Employee[] }) => {
  const stats = computeEmployeeScholarStats(employees);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">Employee-Scholar Summary</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Ongoing and completed study status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard
          title="On Going Teaching"
          value={stats.ongoingTeaching}
          icon={<FiBookOpen className="w-6 h-6" />}
        />
        <StatCard
          title="On Going Teaching (Reinstated/Part-time)"
          value={stats.ongoingTeachingReinstatedPartTime}
          icon={<FiCheckCircle className="w-6 h-6" />}
        />
        <StatCard
          title="On Going Admin"
          value={stats.ongoingAdmin}
          icon={<FiBriefcase className="w-6 h-6" />}
        />
        <StatCard
          title="Total On Going"
          value={stats.totalOngoing}
          icon={<FiBookOpen className="w-6 h-6" />}
        />
        <StatCard
          title="Completed Teaching"
          value={stats.completedTeaching}
          icon={<FiAward className="w-6 h-6" />}
        />
        <StatCard
          title="Completed Admin"
          value={stats.completedAdmin}
          icon={<FiBriefcase className="w-6 h-6" />}
        />
        <StatCard
          title="Total Completed"
          value={stats.totalCompleted}
          icon={<FiAward className="w-6 h-6" />}
        />
      </div>
    </section>
  );
};
