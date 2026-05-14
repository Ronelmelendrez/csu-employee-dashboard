import { motion, AnimatePresence } from 'framer-motion';
import { Employee } from '../../types/employee';
import { Badge } from './Badge';
import { FiX } from 'react-icons/fi';

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
    return connected.toLowerCase() === 'yes' ? 'success' : 'danger';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Employee Details</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Employee ID</h3>
                <p className="text-lg font-semibold mt-1">{employee.no}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Rank</h3>
                <p className="text-lg mt-1">{employee.currentRank || 'N/A'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Employment Status</h3>
                <div className="mt-2">
                  <Badge variant={getStatusVariant(employee.employmentStatus)}>
                    {employee.employmentStatus || 'N/A'}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Connection Status</h3>
                <div className="mt-2">
                  <Badge variant={getConnectionVariant(employee.connectedWithCSU)}>
                    {employee.connectedWithCSU || 'N/A'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Official Station</h3>
                  <p className="mt-1">{employee.officialStation || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h3>
                  <p className="mt-1">{employee.categoryOfEmployment || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Course/Program</h3>
                  <p className="mt-1">{employee.courseProgram || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Funding Source</h3>
                  <p className="mt-1">{employee.fundingSource || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">University Attended</h3>
                <p className="mt-1">{employee.universityAttended || 'N/A'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contract Duration</h3>
                  <p className="mt-1">{employee.contractDuration || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Schooling Status</h3>
                  <p className="mt-1">{employee.schoolingStatus || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Graduation Date</h3>
                  <p className="mt-1">{employee.graduationDate || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Reinstatement</h3>
                  <p className="mt-1">{employee.reinstatement || 'N/A'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};