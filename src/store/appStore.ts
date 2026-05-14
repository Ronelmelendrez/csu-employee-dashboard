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

// Sample data for demonstration
const sampleEmployees: Employee[] = [
  { no: 'EMP001', currentRank: 'Professor', officialStation: 'Main Campus', employmentStatus: 'Permanent', categoryOfEmployment: 'Academic', fundingSource: 'Government', universityAttended: 'University of the Philippines', graduationDate: '2010-05-15', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
  { no: 'EMP002', currentRank: 'Associate Professor', officialStation: 'Main Campus', employmentStatus: 'Permanent', categoryOfEmployment: 'Academic', fundingSource: 'Government', universityAttended: 'Ateneo de Manila University', graduationDate: '2012-06-20', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
  { no: 'EMP003', currentRank: 'Instructor', officialStation: 'Extension Campus', employmentStatus: 'Contractual', categoryOfEmployment: 'Academic', fundingSource: 'Government', universityAttended: 'De La Salle University', graduationDate: '2015-07-10', schoolingStatus: 'Completed', connectedWithCSU: 'No' },
  { no: 'EMP004', currentRank: 'Administrative Officer', officialStation: 'Main Campus', employmentStatus: 'Permanent', categoryOfEmployment: 'Administrative', fundingSource: 'Government', universityAttended: 'University of the Philippines', graduationDate: '2014-08-22', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
  { no: 'EMP005', currentRank: 'IT Specialist', officialStation: 'Main Campus', employmentStatus: 'Permanent', categoryOfEmployment: 'Support', fundingSource: 'Government', universityAttended: 'Technological University of the Philippines', graduationDate: '2013-05-18', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
  { no: 'EMP006', currentRank: 'Librarian', officialStation: 'Main Campus', employmentStatus: 'Permanent', categoryOfEmployment: 'Administrative', fundingSource: 'Government', universityAttended: 'University of Santo Tomas', graduationDate: '2011-06-12', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
  { no: 'EMP007', currentRank: 'Research Associate', officialStation: 'Research Center', employmentStatus: 'Contractual', categoryOfEmployment: 'Academic', fundingSource: 'Research Grant', universityAttended: 'University of the Philippines', graduationDate: '2016-07-25', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
  { no: 'EMP008', currentRank: 'Security Personnel', officialStation: 'Main Campus', employmentStatus: 'Casual', categoryOfEmployment: 'Support', fundingSource: 'Government', universityAttended: 'Caraga State University', graduationDate: '2017-05-30', schoolingStatus: 'Completed', connectedWithCSU: 'No' },
  { no: 'EMP009', currentRank: 'Assistant Professor', officialStation: 'Extension Campus', employmentStatus: 'Permanent', categoryOfEmployment: 'Academic', fundingSource: 'Government', universityAttended: 'Mindanao State University', graduationDate: '2013-08-15', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
  { no: 'EMP010', currentRank: 'Finance Officer', officialStation: 'Main Campus', employmentStatus: 'Permanent', categoryOfEmployment: 'Administrative', fundingSource: 'Government', universityAttended: 'University of the Philippines', graduationDate: '2012-07-20', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
  { no: 'EMP011', currentRank: 'Professor', officialStation: 'Main Campus', employmentStatus: 'Permanent', categoryOfEmployment: 'Academic', fundingSource: 'Government', universityAttended: 'University of the Philippines', graduationDate: '2008-06-10', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
  { no: 'EMP012', currentRank: 'Instructor', officialStation: 'Main Campus', employmentStatus: 'Contractual', categoryOfEmployment: 'Academic', fundingSource: 'Government', universityAttended: 'Ateneo de Manila University', graduationDate: '2016-05-20', schoolingStatus: 'Completed', connectedWithCSU: 'No' },
  { no: 'EMP013', currentRank: 'Associate Professor', officialStation: 'Extension Campus', employmentStatus: 'Permanent', categoryOfEmployment: 'Academic', fundingSource: 'Government', universityAttended: 'De La Salle University', graduationDate: '2011-07-15', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
  { no: 'EMP014', currentRank: 'Maintenance Staff', officialStation: 'Main Campus', employmentStatus: 'Casual', categoryOfEmployment: 'Support', fundingSource: 'Government', universityAttended: 'Caraga State University', graduationDate: '2018-06-25', schoolingStatus: 'Completed', connectedWithCSU: 'No' },
  { no: 'EMP015', currentRank: 'Registrar', officialStation: 'Main Campus', employmentStatus: 'Permanent', categoryOfEmployment: 'Administrative', fundingSource: 'Government', universityAttended: 'University of the Philippines', graduationDate: '2010-08-20', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      employees: sampleEmployees,
      filteredEmployees: sampleEmployees,
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
      partialize: (state) => ({ darkMode: state.darkMode, sidebarCollapsed: state.sidebarCollapsed, employees: state.employees }),
    }
  )
);