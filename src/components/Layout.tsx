import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { useAppStore } from '../store/appStore';
import { clsx } from 'clsx';

export const MainLayout = () => {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div
        className={clsx(
          'transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        )}
      >
        <Navbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};