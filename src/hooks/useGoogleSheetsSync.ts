/**
 * useGoogleSheetsSync - React Hook for Google Sheets Integration
 * 
 * Provides easy integration of Google Sheets sync into React components
 * Works with existing app store and useEmployees hook
 */

import { useState, useCallback, useRef } from "react";
import { Employee } from "../types/employee";
import {
  fetchEmployeesFromGoogleSheets,
  getAvailableSheetsFromGoogleSheets,
  SheetInfo
} from "../utils/googleSheetsSync";

export interface UseGoogleSheetsSyncOptions {
  webAppUrl: string;
  defaultSheetName?: string;
  onSuccess?: (employees: Employee[]) => void;
  onError?: (error: string) => void;
}

export interface UseGoogleSheetsSyncResult {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  currentSheet: string;
  availableSheets: SheetInfo[];
  
  // Methods
  syncFromSheet: (sheetName?: string) => Promise<void>;
  switchSheet: (sheetName: string) => Promise<void>;
  loadAvailableSheets: () => Promise<void>;
  retry: () => Promise<void>;
}

export function useGoogleSheetsSync(
  options: UseGoogleSheetsSyncOptions
): UseGoogleSheetsSyncResult {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentSheet, setCurrentSheet] = useState(
    options.defaultSheetName ?? "Masterlist"
  );
  const [availableSheets, setAvailableSheets] = useState<SheetInfo[]>([]);

  const lastSheetRef = useRef<string>(currentSheet);

  /**
   * Sync employees from a specific sheet
   */
  const syncFromSheet = useCallback(
    async (sheetName: string = currentSheet) => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchEmployeesFromGoogleSheets(
          options.webAppUrl,
          sheetName
        );

        if (result.success) {
          setEmployees(result.data);
          setIsConnected(true);
          setCurrentSheet(sheetName);
          lastSheetRef.current = sheetName;
          options.onSuccess?.(result.data);
          console.log(
            `✓ Synced ${result.data.length} employees from "${sheetName}"`
          );
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        setIsConnected(false);
        options.onError?.(errorMessage);
        console.error("Sync failed:", errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  /**
   * Switch to a different sheet and sync
   */
  const switchSheet = useCallback(
    async (sheetName: string) => {
      if (sheetName === currentSheet) {
        return; // Already on this sheet
      }

      await syncFromSheet(sheetName);
    },
    [currentSheet, syncFromSheet]
  );

  /**
   * Load list of available sheets
   */
  const loadAvailableSheets = useCallback(async () => {
    try {
      const sheets = await getAvailableSheetsFromGoogleSheets(
        options.webAppUrl
      );
      setAvailableSheets(sheets);
      console.log(`Found ${sheets.length} available sheets`);
    } catch (err) {
      console.error("Error loading sheets:", err);
    }
  }, [options.webAppUrl]);

  /**
   * Retry the last sync
   */
  const retry = useCallback(async () => {
    await syncFromSheet(lastSheetRef.current);
  }, [syncFromSheet]);

  return {
    employees,
    loading,
    error,
    isConnected,
    currentSheet,
    availableSheets,
    syncFromSheet,
    switchSheet,
    loadAvailableSheets,
    retry
  };
}

export default useGoogleSheetsSync;
