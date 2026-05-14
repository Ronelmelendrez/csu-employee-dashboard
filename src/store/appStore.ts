import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Employee } from '../types/employee';

interface FilterState {
  searchTerm: string;
  employmentStatus: string[];
  officialStation: string[];
  category: string[];
  fundingSource: string[];
  schoolingStatus: string[];
  connected: string[];
}

interface AppState {
  employees: Employee[];
  filteredEmployees: Employee[];
  filters: FilterState;
  isLoading: boolean;
  darkMode: boolean;
  sidebarCollapsed: boolean;
  setEmployees: (employees: Employee[]) => void;
  setFilteredEmployees: (employees: Employee[]) => void;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setIsLoading: (loading: boolean) => void;
}

const initialFilters: FilterState = {
  searchTerm: '',
  employmentStatus: [],
  officialStation: [],
  category: [],
  fundingSource: [],
  schoolingStatus: [],
  connected: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      employees: [],
      filteredEmployees: [],
      filters: initialFilters,
      isLoading: false,
      darkMode: false,
      sidebarCollapsed: false,
      setEmployees: (employees) => set({ employees }),
      setFilteredEmployees: (filteredEmployees) => set({ filteredEmployees }),
      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),
      resetFilters: () => set({ filters: initialFilters }),
      toggleDarkMode: () =>
        set((state) => {
          const newDarkMode = !state.darkMode;
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { darkMode: newDarkMode };
        }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'csu-dashboard-storage',
      partialize: (state) => ({ darkMode: state.darkMode, sidebarCollapsed: state.sidebarCollapsed }),
    }
  )
);