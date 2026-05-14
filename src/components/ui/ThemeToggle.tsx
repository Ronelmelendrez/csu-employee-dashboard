import { FiSun, FiMoon } from 'react-icons/fi';
import { useAppStore } from '../../store/appStore';

export const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useAppStore();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2.5 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 hover:shadow-lg text-primary-600 dark:text-primary-400 transition-all duration-300 hover:scale-110"
      aria-label="Toggle dark mode"
    >
      {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
};