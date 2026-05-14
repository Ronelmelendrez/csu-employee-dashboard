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
      className="h-screen glass-effect fixed left-0 top-0 z-20 transition-all duration-300 shadow-lg border-r"
    >
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
          {!sidebarCollapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-1"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">C</span>
                </div>
                <div>
                  <h1 className="text-lg font-black bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">CSU</h1>
                </div>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 pl-12">Employee Hub</p>
            </motion.div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center hover:scale-110 transition-transform">
                <span className="text-lg font-bold text-white">C</span>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 py-8 space-y-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-4 px-4 py-3.5 mx-3 rounded-xl transition-all duration-300 group relative overflow-hidden',
                    isActive
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50',
                    sidebarCollapsed && 'justify-center px-3 mx-0'
                  )
                }
              >
                <div className={clsx(
                  'p-2 rounded-lg transition-all duration-300',
                  'group-hover:scale-110'
                )}>
                  <item.icon size={20} />
                </div>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-semibold text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>
      </div>
    </motion.aside>
  );
};