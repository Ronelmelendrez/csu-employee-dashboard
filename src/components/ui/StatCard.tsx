import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
}

export const StatCard = ({ title, value, icon, trend }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="dashboard-stat group"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{title}</p>
          <p className="stat-number mt-3 mb-2">{value}</p>
          {trend !== undefined && (
            <div className={`inline-flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full ${
              trend >= 0 
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              {trend >= 0 ? <span>↑</span> : <span>↓</span>}
              <span>{Math.abs(trend)}% from last month</span>
            </div>
          )}
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
          <div className="relative p-4 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
};