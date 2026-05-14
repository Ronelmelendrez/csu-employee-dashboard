import { useMemo, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { useDebounce } from './useDebounce';

export const useFilteredEmployees = () => {
  const { employees, filters, setFilteredEmployees } = useAppStore();
  const debouncedSearch = useDebounce(filters.searchTerm, 300);

  const filtered = useMemo(() => {
    let result = [...employees];

    // Global search
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter((emp) =>
        Object.values(emp).some((val) =>
          String(val).toLowerCase().includes(searchLower)
        )
      );
    }

    // Employment Status filter
    if (filters.employmentStatus.length) {
      result = result.filter((emp) =>
        filters.employmentStatus.includes(emp.employmentStatus)
      );
    }

    // Official Station filter
    if (filters.officialStation.length) {
      result = result.filter((emp) =>
        filters.officialStation.includes(emp.officialStation)
      );
    }

    // Category filter
    if (filters.category.length) {
      result = result.filter((emp) =>
        filters.category.includes(emp.categoryOfEmployment)
      );
    }

    // Funding Source filter
    if (filters.fundingSource.length) {
      result = result.filter((emp) =>
        filters.fundingSource.includes(emp.fundingSource)
      );
    }

    // Schooling Status filter
    if (filters.schoolingStatus.length) {
      result = result.filter((emp) =>
        filters.schoolingStatus.includes(emp.schoolingStatus)
      );
    }

    // Connected with CSU filter
    if (filters.connected.length) {
      result = result.filter((emp) =>
        filters.connected.includes(emp.connectedWithCSU)
      );
    }

    return result;
  }, [employees, filters, debouncedSearch]);

  useEffect(() => {
    setFilteredEmployees(filtered);
  }, [filtered, setFilteredEmployees]);

  return filtered;
};