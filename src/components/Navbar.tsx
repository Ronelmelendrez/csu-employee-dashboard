import { FiMenu } from 'react-icons/fi';
import { useAppStore } from '../store/appStore';
import { ThemeToggle } from './ui/ThemeToggle';
import { FileUploader } from './ui/FileUploader';

export const Navbar = () => {
  const { toggleSidebar } = useAppStore();

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 sticky top-0 z-10 shadow-sm">
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