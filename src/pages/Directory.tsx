import { useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useFilteredEmployees } from '../hooks/useFilteredEmployees';
import { DataTable } from '../components/ui/DataTable';
import { EmployeeDrawer } from '../components/ui/EmployeeDrawer';
import { Employee } from '../types/employee';
import { Badge } from '../components/ui/Badge';
import { FiSearch, FiFilter, FiDownload } from 'react-icons/fi';
import { useAppStore } from '../store/appStore';
import { exportToCSV } from '../utils/exportCSV';
import { motion } from 'framer-motion';

const columnHelper = createColumnHelper<Employee>();

const columns = [
  columnHelper.accessor('no', { header: 'Employee No.', cell: (info) => info.getValue() }),
  columnHelper.accessor('currentRank', { header: 'Current Rank' }),
  columnHelper.accessor('officialStation', { header: 'Official Station' }),
  columnHelper.accessor('employmentStatus', {
    header: 'Employment Status',
    cell: (info) => {
      const status = info.getValue();
      let variant: 'success' | 'warning' | 'danger' | 'info' | 'default' = 'default';
      if (status?.toLowerCase().includes('permanent')) variant = 'success';
      else if (status?.toLowerCase().includes('contract')) variant = 'warning';
      else if (status?.toLowerCase().includes('casual')) variant = 'info';
      return <Badge variant={variant}>{status}</Badge>;
    },
  }),
  columnHelper.accessor('categoryOfEmployment', { header: 'Category' }),
  columnHelper.accessor('courseProgram', { header: 'Program' }),
  columnHelper.accessor('fundingSource', { header: 'Funding Source' }),
  columnHelper.accessor('schoolingStatus', { header: 'Schooling Status' }),
  columnHelper.accessor('connectedWithCSU', {
    header: 'Connected',
    cell: (info) => {
      const connected = info.getValue();
      return <Badge variant={connected?.toLowerCase() === 'yes' ? 'success' : 'danger'}>{connected}</Badge>;
    },
  }),
];

export const Directory = () => {
  const filteredEmployees = useFilteredEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { filters, setFilter, resetFilters } = useAppStore();

  const handleRowClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDrawerOpen(true);
  };

  const handleExport = () => {
    exportToCSV(filteredEmployees, 'csu_employees_export');
  };

  // Get unique filter options
  const uniqueValues = {
    employmentStatus: [...new Set(filteredEmployees.map(e => e.employmentStatus).filter(Boolean))],
    officialStation: [...new Set(filteredEmployees.map(e => e.officialStation).filter(Boolean))],
    category: [...new Set(filteredEmployees.map(e => e.categoryOfEmployment).filter(Boolean))],
    fundingSource: [...new Set(filteredEmployees.map(e => e.fundingSource).filter(Boolean))],
    schoolingStatus: [...new Set(filteredEmployees.map(e => e.schoolingStatus).filter(Boolean))],
    connected: [...new Set(filteredEmployees.map(e => e.connectedWithCSU).filter(Boolean))],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employee Directory</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View and search employee records</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiDownload size={18} />
          Export CSV
        </button>
      </div>

      {/* Filters Bar */}
      <div className="card p-4 space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Global search..."
              value={filters.searchTerm}
              onChange={(e) => setFilter('searchTerm', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <select
            multiple
            value={filters.employmentStatus}
            onChange={(e) => setFilter('employmentStatus', Array.from(e.target.selectedOptions, opt => opt.value))}
            className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            size={3}
          >
            <option value="" disabled>Employment Status</option>
            {uniqueValues.employmentStatus.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <select
            multiple
            value={filters.officialStation}
            onChange={(e) => setFilter('officialStation', Array.from(e.target.selectedOptions, opt => opt.value))}
            className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            size={3}
          >
            <option value="" disabled>Official Station</option>
            {uniqueValues.officialStation.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <select
            multiple
            value={filters.category}
            onChange={(e) => setFilter('category', Array.from(e.target.selectedOptions, opt => opt.value))}
            className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            size={3}
          >
            <option value="" disabled>Category</option>
            {uniqueValues.category.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <select
            multiple
            value={filters.fundingSource}
            onChange={(e) => setFilter('fundingSource', Array.from(e.target.selectedOptions, opt => opt.value))}
            className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            size={3}
          >
            <option value="" disabled>Funding Source</option>
            {uniqueValues.fundingSource.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <select
            multiple
            value={filters.schoolingStatus}
            onChange={(e) => setFilter('schoolingStatus', Array.from(e.target.selectedOptions, opt => opt.value))}
            className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            size={3}
          >
            <option value="" disabled>Schooling Status</option>
            {uniqueValues.schoolingStatus.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <select
            multiple
            value={filters.connected}
            onChange={(e) => setFilter('connected', Array.from(e.target.selectedOptions, opt => opt.value))}
            className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            size={3}
          >
            <option value="" disabled>Connected with CSU</option>
            {uniqueValues.connected.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredEmployees}
        onRowClick={handleRowClick}
      />

      {/* Employee Detail Drawer */}
      <EmployeeDrawer
        employee={selectedEmployee}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </motion.div>
  );
};