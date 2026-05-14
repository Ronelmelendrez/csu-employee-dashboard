import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { useAppStore } from '../store/appStore';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen } = useAppStore();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
