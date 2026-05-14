import { motion } from 'framer-motion';
import { FiMenu } from 'react-icons/fi';
import { useAppStore } from '../store/appStore';
import { ThemeToggle } from './ui/ThemeToggle';
import { FileUploader } from './ui/FileUploader';

export const Navbar = () => {
  const { toggleSidebar } = useAppStore();

  return (
    <nav className="glass-effect sticky top-0 z-10 px-4 py-4 border-b border-white/20 dark:border-slate-700/50 shadow-glow">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className="p-2.5 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/20 lg:hidden transition-colors"
          >
            <FiMenu size={20} className="text-primary-600 dark:text-primary-400" />
          </motion.button>
        </div>

        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <FileUploader />
            <div className="w-px h-8 bg-white/20 dark:bg-slate-700/50" />
            <ThemeToggle />
          </motion.div>
        </div>
      </div>
    </nav>
  );
};