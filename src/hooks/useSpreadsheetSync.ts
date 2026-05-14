/**
 * useSpreadsheetSync - React Hook for Spreadsheet Synchronization
 * 
 * Provides easy integration of Google Sheets sync into React components
 * Handles loading states, error handling, and auto-sync management
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { Employee } from "../types/employee";
import { SpreadsheetSync } from "../utils/syncSpreadsheet";

export interface UseSpreadsheetSyncOptions {
  appScriptUrl: string;
  autoSync?: boolean;
  syncInterval?: number;
  onSyncSuccess?: (employees: Employee[]) => void;
  onSyncError?: (error: Error) => void;
}

export interface UseSpreadsheetSyncResult {
  employees: Employee[];
  loading: boolean;
  error: Error | null;
  isConnected: boolean;
  
  // Methods
  sync: () => Promise<void>;
  addEmployee: (employee: Omit<Employee, "id">) => Promise<Employee | null>;
  updateEmployee: (employee: Employee) => Promise<boolean>;
  deleteEmployee: (id: number) => Promise<boolean>;
  syncAll: (employees: Employee[]) => Promise<boolean>;
}

export function useSpreadsheetSync(
  options: UseSpreadsheetSyncOptions
): UseSpreadsheetSyncResult {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const syncRef = useRef<SpreadsheetSync | null>(null);

  // Initialize spreadsheet sync
  useEffect(() => {
    const initializeSync = async () => {
      try {
        syncRef.current = new SpreadsheetSync({
          appScriptUrl: options.appScriptUrl,
          autoSync: options.autoSync ?? false,
          syncInterval: options.syncInterval ?? 60000
        });

        // Validate connection
        const connected = await syncRef.current.validateConnection();
        setIsConnected(connected);

        if (connected) {
          // Fetch initial data
          const data = await syncRef.current.fetchEmployees();
          setEmployees(data);
          options.onSyncSuccess?.(data);
        } else {
          const err = new Error("Failed to connect to spreadsheet");
          setError(err);
          options.onSyncError?.(err);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setIsConnected(false);
        options.onSyncError?.(error);
      }
    };

    initializeSync();

    // Cleanup on unmount
    return () => {
      if (syncRef.current) {
        syncRef.current.stopAutoSync();
      }
    };
  }, [options.appScriptUrl, options.autoSync, options.syncInterval]);

  // Sync all employees
  const sync = useCallback(async () => {
    if (!syncRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const data = await syncRef.current.fetchEmployees();
      setEmployees(data);
      setIsConnected(true);
      options.onSyncSuccess?.(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setIsConnected(false);
      options.onSyncError?.(error);
    } finally {
      setLoading(false);
    }
  }, [options]);

  // Add new employee
  const addEmployee = useCallback(
    async (employee: Omit<Employee, "id">) => {
      if (!syncRef.current) return null;

      setLoading(true);
      setError(null);

      try {
        const newEmployee = await syncRef.current.addEmployee(employee);
        if (newEmployee) {
          setEmployees(prev => [...prev, newEmployee]);
        }
        return newEmployee;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options.onSyncError?.(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  // Update existing employee
  const updateEmployee = useCallback(
    async (employee: Employee) => {
      if (!syncRef.current) return false;

      setLoading(true);
      setError(null);

      try {
        const success = await syncRef.current.updateEmployee(employee);
        if (success) {
          setEmployees(prev =>
            prev.map(e => (e.id === employee.id ? employee : e))
          );
        }
        return success;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options.onSyncError?.(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  // Delete employee
  const deleteEmployee = useCallback(
    async (id: number) => {
      if (!syncRef.current) return false;

      setLoading(true);
      setError(null);

      try {
        const success = await syncRef.current.deleteEmployee(id);
        if (success) {
          setEmployees(prev => prev.filter(e => e.id !== id));
        }
        return success;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options.onSyncError?.(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  // Bulk sync
  const syncAll = useCallback(
    async (employeeList: Employee[]) => {
      if (!syncRef.current) return false;

      setLoading(true);
      setError(null);

      try {
        const success = await syncRef.current.syncAllEmployees(employeeList);
        if (success) {
          setEmployees(employeeList);
          options.onSyncSuccess?.(employeeList);
        }
        return success;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options.onSyncError?.(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  return {
    employees,
    loading,
    error,
    isConnected,
    sync,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    syncAll
  };
}

export default useSpreadsheetSync;
