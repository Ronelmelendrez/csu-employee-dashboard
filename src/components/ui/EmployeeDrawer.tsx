import { motion, AnimatePresence } from 'framer-motion';
import { Employee } from '../../types/employee';
import { Badge } from './Badge';
import { FiX, FiUser, FiBriefcase, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getCSUConnectionStatusLabel, isConnectedWithCSU, isDeceased } from '../../utils/csuConnectionStatus';

interface EmployeeDrawerProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeDrawer = ({ employee, isOpen, onClose }: EmployeeDrawerProps) => {
  if (!employee) return null;

  const getStatusVariant = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('permanent')) return 'success';
    if (s.includes('contract')) return 'warning';
    if (s.includes('casual')) return 'info';
    return 'default';
  };

  const getConnectionVariant = (connected: string) => {
    if (isConnectedWithCSU(connected as any)) return 'success';
    if (isDeceased(connected as any)) return 'danger';
    return 'warning';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center"
                >
                  <FiUser size={24} />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold">Employee Details</h2>
                  <p className="text-sm text-white/70">ID: {employee.no}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <FiX size={20} />
              </motion.button>
            </div>

            <div className="p-6 space-y-6">
              {/* Header Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-800 dark:to-slate-800/50 rounded-xl p-5 border border-primary-200/50 dark:border-slate-700/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Current Rank</p>
                    <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">{employee.currentRank || 'N/A'}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <FiBriefcase className="text-white" size={24} />
                  </div>
                </div>
              </motion.div>

              {/* Status Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Employment Type</p>
                    <Badge variant={getStatusVariant(employee.employmentStatus)} className="mt-2">
                      {employee.employmentStatus || 'N/A'}
                    </Badge>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">CSU Connected</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant={getConnectionVariant(employee.connectedWithCSU)}>
                        {getCSUConnectionStatusLabel(employee.connectedWithCSU)}
                      </Badge>
                      {isConnectedWithCSU(employee.connectedWithCSU) && (
                        <FiCheckCircle className="text-emerald-500" size={18} />
                      )}
                      {isDeceased(employee.connectedWithCSU) && (
                        <FiAlertCircle className="text-red-500" size={18} />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Location & Category */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Assignment</h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-800/50 rounded-lg p-4 border border-blue-200/50 dark:border-slate-700">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Official Station</p>
                    <p className="text-lg font-semibold mt-2 text-slate-900 dark:text-white">{employee.officialStation || 'N/A'}</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-800/50 rounded-lg p-4 border border-purple-200/50 dark:border-slate-700">
                    <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider">Category</p>
                    <p className="text-lg font-semibold mt-2 text-slate-900 dark:text-white">{employee.categoryOfEmployment || 'N/A'}</p>
                  </div>
                </div>
              </motion.div>

              {/* Educational */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Education</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Program</p>
                    <p className="text-sm font-semibold mt-2 text-slate-900 dark:text-white">{employee.courseProgram || 'N/A'}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">University</p>
                    <p className="text-sm font-semibold mt-2 text-slate-900 dark:text-white">{employee.universityAttended || 'N/A'}</p>
                  </div>
                </div>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Details</h3>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Funding Source</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{employee.fundingSource || 'N/A'}</p>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between items-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Graduation Date</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{employee.graduationDate || 'N/A'}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};