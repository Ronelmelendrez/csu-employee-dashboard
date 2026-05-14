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
  { id: 1, no: 'EMP001', currentRank: 'Professor', officialStation: 'Main Campus', employmentStatus: 'Permanent', categoryOfEmployment: 'Academic', courseProgram: 'Computer Science', fundingSource: 'Government', universityAttended: 'University of the Philippines', contractDuration: 'Permanent', reinstatement: 'No', graduationDate: '2010-05-15', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
  { id: 2, no: 'EMP002', currentRank: 'Associate Professor', officialStation: 'Main Campus', employmentStatus: 'Permanent', categoryOfEmployment: 'Academic', courseProgram: 'Engineering', fundingSource: 'Government', universityAttended: 'Ateneo de Manila University', contractDuration: 'Permanent', reinstatement: 'No', graduationDate: '2012-06-20', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
  { id: 3, no: 'EMP003', currentRank: 'Instructor', officialStation: 'Extension Campus', employmentStatus: 'Contractual', categoryOfEmployment: 'Academic', courseProgram: 'Business Administration', fundingSource: 'Government', universityAttended: 'De La Salle University', contractDuration: '1 Year', reinstatement: 'No', graduationDate: '2015-07-10', schoolingStatus: 'Completed', connectedWithCSU: 'No' },
  { id: 4, no: 'EMP004', currentRank: 'Administrative Officer', officialStation: 'Main Campus', employmentStatus: 'Permanent', categoryOfEmployment: 'Administrative', courseProgram: 'Public Administration', fundingSource: 'Government', universityAttended: 'University of the Philippines', contractDuration: 'Permanent', reinstatement: 'No', graduationDate: '2014-08-22', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
  { id: 5, no: 'EMP005', currentRank: 'IT Specialist', officialStation: 'Main Campus', employmentStatus: 'Permanent', categoryOfEmployment: 'Support', courseProgram: 'Information Technology', fundingSource: 'Government', universityAttended: 'Technological University of the Philippines', contractDuration: 'Permanent', reinstatement: 'No', graduationDate: '2013-05-18', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
  { id: 6, no: 'EMP006', currentRank: 'Librarian', officialStation: 'Main Campus', employmentStatus: 'Permanent', categoryOfEmployment: 'Administrative', courseProgram: 'Library Science', fundingSource: 'Government', universityAttended: 'University of Santo Tomas', contractDuration: 'Permanent', reinstatement: 'No', graduationDate: '2011-06-12', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
  { id: 7, no: 'EMP007', currentRank: 'Research Associate', officialStation: 'Research Center', employmentStatus: 'Contractual', categoryOfEmployment: 'Academic', courseProgram: 'Research Methods', fundingSource: 'Research Grant', universityAttended: 'University of the Philippines', contractDuration: '2 Years', reinstatement: 'No', graduationDate: '2016-07-25', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
  { id: 8, no: 'EMP008', currentRank: 'Security Personnel', officialStation: 'Main Campus', employmentStatus: 'Casual', categoryOfEmployment: 'Support', courseProgram: 'Security Management', fundingSource: 'Government', universityAttended: 'Caraga State University', contractDuration: '6 Months', reinstatement: 'No', graduationDate: '2017-05-30', schoolingStatus: 'Completed', connectedWithCSU: 'No' },
  { id: 9, no: 'EMP009', currentRank: 'Assistant Professor', officialStation: 'Extension Campus', employmentStatus: 'Permanent', categoryOfEmployment: 'Academic', courseProgram: 'Education', fundingSource: 'Government', universityAttended: 'Mindanao State University', contractDuration: 'Permanent', reinstatement: 'No', graduationDate: '2013-08-15', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
  { id: 10, no: 'EMP010', currentRank: 'Finance Officer', officialStation: 'Main Campus', employmentStatus: 'Permanent', categoryOfEmployment: 'Administrative', courseProgram: 'Accounting', fundingSource: 'Government', universityAttended: 'University of the Philippines', contractDuration: 'Permanent', reinstatement: 'No', graduationDate: '2012-07-20', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
  { id: 11, no: 'EMP011', currentRank: 'Professor', officialStation: 'Main Campus', employmentStatus: 'Permanent', categoryOfEmployment: 'Academic', courseProgram: 'Mathematics', fundingSource: 'Government', universityAttended: 'University of the Philippines', contractDuration: 'Permanent', reinstatement: 'No', graduationDate: '2008-06-10', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
  { id: 12, no: 'EMP012', currentRank: 'Instructor', officialStation: 'Main Campus', employmentStatus: 'Contractual', categoryOfEmployment: 'Academic', courseProgram: 'Literature', fundingSource: 'Government', universityAttended: 'Ateneo de Manila University', contractDuration: '1 Year', reinstatement: 'No', graduationDate: '2016-05-20', schoolingStatus: 'Completed', connectedWithCSU: 'No' },
  { id: 13, no: 'EMP013', currentRank: 'Associate Professor', officialStation: 'Extension Campus', employmentStatus: 'Permanent', categoryOfEmployment: 'Academic', courseProgram: 'Biology', fundingSource: 'Government', universityAttended: 'De La Salle University', contractDuration: 'Permanent', reinstatement: 'No', graduationDate: '2011-07-15', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
  { id: 14, no: 'EMP014', currentRank: 'Maintenance Staff', officialStation: 'Main Campus', employmentStatus: 'Casual', categoryOfEmployment: 'Support', courseProgram: 'Building Maintenance', fundingSource: 'Government', universityAttended: 'Caraga State University', contractDuration: '6 Months', reinstatement: 'No', graduationDate: '2018-06-25', schoolingStatus: 'Completed', connectedWithCSU: 'No' },
  { id: 15, no: 'EMP015', currentRank: 'Registrar', officialStation: 'Main Campus', employmentStatus: 'Permanent', categoryOfEmployment: 'Administrative', courseProgram: 'Records Management', fundingSource: 'Government', universityAttended: 'University of the Philippines', contractDuration: 'Permanent', reinstatement: 'No', graduationDate: '2010-08-20', schoolingStatus: 'Completed', connectedWithCSU: 'Yes' },
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