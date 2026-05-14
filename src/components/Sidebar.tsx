import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiUsers, FiBarChart2 } from 'react-icons/fi';
import { useAppStore } from '../store/appStore';
import { clsx } from 'clsx';

const navItems = [
  { path: '/', label: 'Dashboard', icon: FiHome },
  { path: '/directory', label: 'Employee Directory', icon: FiUsers },
  { path: '/analytics', label: 'Analytics', icon: FiBarChart2 },
];

export const Sidebar = () => {
  const { sidebarCollapsed } = useAppStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 80 : 280 }}
      className="h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed left-0 top-0 z-20 transition-all duration-300 shadow-lg"
    >
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed ? (
            <div>
              <h1 className="text-xl font-bold text-csu-green">CSU</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Employee Dashboard</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="text-2xl font-bold text-csu-green">C</span>
            </div>
          )}
        </div>

        <nav className="flex-1 py-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-6 py-3 mx-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                  sidebarCollapsed && 'justify-center px-0 mx-2'
                )
              }
            >
              <item.icon size={20} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </motion.aside>
  );
};