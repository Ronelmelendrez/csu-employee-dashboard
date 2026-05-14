/**
 * Spreadsheet Sync Utility
 * Handles real-time synchronization between dashboard and Google Sheets
 * via Google Apps Script web app
 */

import { Employee } from "../types/employee";

export interface SyncConfig {
  appScriptUrl: string;
  autoSync?: boolean;
  syncInterval?: number; // milliseconds
}

class SpreadsheetSync {
  private appScriptUrl: string;
  private autoSync: boolean = false;
  private syncInterval: number = 60000; // 1 minute default
  private syncTimer: NodeJS.Timeout | null = null;

  constructor(config: SyncConfig) {
    this.appScriptUrl = config.appScriptUrl;
    this.autoSync = config.autoSync ?? false;
    this.syncInterval = config.syncInterval ?? 60000;

    if (this.autoSync) {
      this.startAutoSync();
    }
  }

  /**
   * Fetch all employees from the spreadsheet
   */
  async fetchEmployees(): Promise<Employee[]> {
    try {
      const url = `${this.appScriptUrl}?action=getAll`;
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        return result.data || [];
      } else {
        console.error("Error fetching employees:", result.message);
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch employees from spreadsheet:", error);
      return [];
    }
  }

  /**
   * Fetch a single employee by ID
   */
  async fetchEmployeeById(id: number): Promise<Employee | null> {
    try {
      const url = `${this.appScriptUrl}?action=getById&id=${id}`;
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        return result.data || null;
      } else {
        console.error("Error fetching employee:", result.message);
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch employee from spreadsheet:", error);
      return null;
    }
  }

  /**
   * Add a new employee to the spreadsheet
   */
  async addEmployee(employee: Omit<Employee, "id">): Promise<Employee | null> {
    try {
      const response = await fetch(`${this.appScriptUrl}?action=add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(employee)
      });

      const result = await response.json();

      if (result.success) {
        return result.data || null;
      } else {
        console.error("Error adding employee:", result.message);
        return null;
      }
    } catch (error) {
      console.error("Failed to add employee to spreadsheet:", error);
      return null;
    }
  }

  /**
   * Update an existing employee in the spreadsheet
   */
  async updateEmployee(employee: Employee): Promise<boolean> {
    try {
      const response = await fetch(`${this.appScriptUrl}?action=update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(employee)
      });

      const result = await response.json();

      if (result.success) {
        return true;
      } else {
        console.error("Error updating employee:", result.message);
        return false;
      }
    } catch (error) {
      console.error("Failed to update employee in spreadsheet:", error);
      return false;
    }
  }

  /**
   * Delete an employee from the spreadsheet
   */
  async deleteEmployee(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.appScriptUrl}?action=delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      });

      const result = await response.json();

      if (result.success) {
        return true;
      } else {
        console.error("Error deleting employee:", result.message);
        return false;
      }
    } catch (error) {
      console.error("Failed to delete employee from spreadsheet:", error);
      return false;
    }
  }

  /**
   * Bulk sync - replace all employees in the spreadsheet
   */
  async syncAllEmployees(employees: Employee[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.appScriptUrl}?action=sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(employees)
      });

      const result = await response.json();

      if (result.success) {
        console.log(`Synced ${result.data.count} employees to spreadsheet`);
        return true;
      } else {
        console.error("Error syncing employees:", result.message);
        return false;
      }
    } catch (error) {
      console.error("Failed to sync employees to spreadsheet:", error);
      return false;
    }
  }

  /**
   * Start automatic syncing at regular intervals
   */
  startAutoSync(): void {
    if (this.syncTimer) {
      return; // Already running
    }

    console.log(
      `Started auto-sync with interval: ${this.syncInterval}ms`
    );
    this.syncTimer = setInterval(() => {
      this.fetchEmployees().catch(error => {
        console.error("Auto-sync failed:", error);
      });
    }, this.syncInterval);
  }

  /**
   * Stop automatic syncing
   */
  stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
      console.log("Stopped auto-sync");
    }
  }

  /**
   * Update the spreadsheet app script URL (for runtime configuration)
   */
  setAppScriptUrl(url: string): void {
    this.appScriptUrl = url;
  }

  /**
   * Validate the connection to the app script
   */
  async validateConnection(): Promise<boolean> {
    try {
      const result = await this.fetchEmployees();
      return Array.isArray(result);
    } catch {
      return false;
    }
  }
}

// Export a singleton instance (optional) or the class for multiple instances
export default SpreadsheetSync;
export { SpreadsheetSync };
