import { FiMenu } from 'react-icons/fi';
import { useAppStore } from '../store/appStore';
import { ThemeToggle } from './ui/ThemeToggle';
import { FileUploader } from './ui/FileUploader';

export const Navbar = () => {
  const { toggleSidebar } = useAppStore();

  return (
    <nav className="glass-effect sticky top-0 z-10 px-4 py-4 border-b border-white/20 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <FiMenu size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <FileUploader />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};