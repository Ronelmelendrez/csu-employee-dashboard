/**
 * Google Sheets Employee Fetcher
 * Fetches employees from Google Sheets via Apps Script with dynamic column mapping
 * 
 * Usage:
 * const employees = await fetchEmployeesFromGoogleSheets(webAppUrl, 'Masterlist');
 */

import { Employee } from "../types/employee";
import { normalizeCSUConnectionStatus } from "./csuConnectionStatus";
import { normalizeSchoolingStatus } from "./schoolingStatusNormalizer";

export interface FetchResult {
  success: boolean;
  data: Employee[];
  message: string;
  sheetName: string;
}

export interface SheetInfo {
  name: string;
  rows: number;
  isDefault: boolean;
}

export const ALL_SHEETS = "ALL";

/**
 * Validate that an object matches the Employee interface
 */
function validateEmployee(obj: any): obj is Employee {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  // Check required fields exist (even if empty)
  const requiredFields: (keyof Employee)[] = [
    "id",
    "no",
    "currentRank",
    "officialStation",
    "categoryOfEmployment",
    "employmentStatus",
    "courseProgram",
    "fundingSource",
    "universityAttended",
    "contractDuration",
    "reinstatement",
    "schoolingStatus",
    "graduationDate",
    "connectedWithCSU"
  ];

  for (const field of requiredFields) {
    if (!(field in obj)) {
      console.warn(`Missing field: ${field}`);
      return false;
    }
  }

  return true;
}

/**
 * Ensure an employee object has all required fields
 */
function ensureEmployeeShape(obj: any): Employee {
  const employee: Partial<Employee> = obj || {};

  // Normalize connectedWithCSU to valid CSUConnectionStatus value
  let connectedStatus = employee.connectedWithCSU;
  if (connectedStatus) {
    const normalized = normalizeCSUConnectionStatus(connectedStatus);
    connectedStatus = normalized || 'NO';
  } else {
    connectedStatus = 'NO';
  }

  // Normalize schoolingStatus
  let schoolingStatus = employee.schoolingStatus;
  if (schoolingStatus) {
    const normalized = normalizeSchoolingStatus(schoolingStatus);
    schoolingStatus = normalized || "PENDING";
  } else {
    schoolingStatus = "PENDING";
  }

  return {
    id: employee.id ?? 0,
    no: employee.no ?? "",
    dateOfBirth: employee.dateOfBirth ?? "",
    name: employee.name ?? "",
    address: employee.address ?? "",
    currentRank: employee.currentRank ?? "",
    officialStation: employee.officialStation ?? "",
    categoryOfEmployment: employee.categoryOfEmployment ?? "",
    employmentStatus: employee.employmentStatus ?? "",
    courseProgram: employee.courseProgram ?? "",
    fundingSource: employee.fundingSource ?? "",
    universityAttended: employee.universityAttended ?? "",
    contractDuration: employee.contractDuration ?? "",
    leaveOfAbsence: employee.leaveOfAbsence ?? "",
    resolutionOfStudyLeave: employee.resolutionOfStudyLeave ?? "",
    reinstatement: employee.reinstatement ?? "",
    schoolingStatus: schoolingStatus,
    graduationDate: employee.graduationDate ?? "",
    clothingAllowanceAndPBB: employee.clothingAllowanceAndPBB ?? "",
    connectedWithCSU: connectedStatus,
    returnService: employee.returnService ?? "",
    enrolled: employee.enrolled ?? "",
    remarks: employee.remarks ?? ""
  };
}

/**
 * Fetch employees from Google Sheets via Apps Script
 *
 * @param webAppUrl - Deployed Apps Script web app URL
 * @param sheetName - Sheet name to fetch from (default: 'Masterlist')
 * @returns Promise with success status, employee data, and message
 *
 * @example
 * const result = await fetchEmployeesFromGoogleSheets(
 *   'https://script.google.com/macros/d/YOUR_ID/usercontent',
 *   'Masterlist'
 * );
 *
 * if (result.success) {
 *   console.log(`Loaded ${result.data.length} employees from ${result.sheetName}`);
 * } else {
 *   console.error(result.message);
 * }
 */
export async function fetchEmployeesFromGoogleSheets(
  webAppUrl: string,
  sheetName: string = ALL_SHEETS
): Promise<FetchResult> {
  if (!webAppUrl) {
    return {
      success: false,
      data: [],
      message: "Web App URL is required",
      sheetName
    };
  }

  try {
    // Build the URL with query parameters
    const url = new URL(webAppUrl);
    url.searchParams.append("action", "getAll");
    url.searchParams.append("sheet", sheetName);

    console.log(`Fetching employees from Google Sheets: ${sheetName}`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status} ${response.statusText}`
      );
    }

    const json = await response.json();

    // Validate response structure
    if (!json || typeof json !== "object") {
      throw new Error("Invalid response format: expected JSON object");
    }

    if (!json.success) {
      throw new Error(json.message || "Failed to fetch employees");
    }

    if (!Array.isArray(json.data)) {
      throw new Error("Invalid response format: expected array of employees");
    }

    // Validate and normalize each employee
    const employees: Employee[] = json.data
      .map((emp: any) => {
        const normalized = ensureEmployeeShape(emp);
        if (!validateEmployee(normalized)) {
          console.warn("Employee validation failed, using default shape:", emp);
        }
        return normalized;
      })
      .filter((emp: Employee) => emp); // Remove any null/undefined

    // Log connectedWithCSU values for first 5 employees for debugging
    console.log("First 5 employees' connectedWithCSU values:");
    employees.slice(0, 5).forEach((emp, i) => {
      console.log(`  Employee ${i}: id=${emp.id}, name="${emp.name}", connectedWithCSU="${emp.connectedWithCSU}"`);
    });

    console.log(
      `✓ Successfully loaded ${employees.length} employees from "${sheetName}"`
    );

    return {
      success: true,
      data: employees,
      message: `Loaded ${employees.length} employees with dynamic column mapping`,
      sheetName
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error fetching employees from Google Sheets:", errorMessage);

    return {
      success: false,
      data: [],
      message: `Failed to fetch employees: ${errorMessage}`,
      sheetName
    };
  }
}

/**
 * Fetch a single employee by ID from Google Sheets
 *
 * @param webAppUrl - Deployed Apps Script web app URL
 * @param employeeId - Employee ID to fetch
 * @param sheetName - Sheet name to search in
 * @returns Employee or null if not found
 */
export async function fetchEmployeeByIdFromGoogleSheets(
  webAppUrl: string,
  employeeId: number,
  sheetName: string = "Masterlist"
): Promise<Employee | null> {
  try {
    const url = new URL(webAppUrl);
    url.searchParams.append("action", "getById");
    url.searchParams.append("id", String(employeeId));
    url.searchParams.append("sheet", sheetName);

    const response = await fetch(url.toString());
    const json = await response.json();

    if (json.success && json.data) {
      return ensureEmployeeShape(json.data);
    }

    return null;
  } catch (error) {
    console.error("Error fetching employee by ID:", error);
    return null;
  }
}

/**
 * Get list of available sheets from Google Sheets
 *
 * @param webAppUrl - Deployed Apps Script web app URL
 * @returns Array of sheet information
 */
export async function getAvailableSheetsFromGoogleSheets(
  webAppUrl: string
): Promise<SheetInfo[]> {
  try {
    const url = new URL(webAppUrl);
    url.searchParams.append("action", "getSheets");

    const response = await fetch(url.toString());
    const json = await response.json();

    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching available sheets:", error);
    return [];
  }
}

/**
 * Get column mapping configuration from Google Sheets
 *
 * @param webAppUrl - Deployed Apps Script web app URL
 * @returns Column mapping object with field names and synonyms
 */
export async function getColumnMappingFromGoogleSheets(
  webAppUrl: string
): Promise<Record<string, string[]>> {
  try {
    const url = new URL(webAppUrl);
    url.searchParams.append("action", "getMapping");

    const response = await fetch(url.toString());
    const json = await response.json();

    if (json.success && json.data) {
      return json.data;
    }

    return {};
  } catch (error) {
    console.error("Error fetching column mapping:", error);
    return {};
  }
}

/**
 * Fetch employees and update the store
 * Designed to work with Zustand store (appStore)
 *
 * @param webAppUrl - Deployed Apps Script web app URL
 * @param sheetName - Sheet name to fetch from
 * @param onSuccess - Optional callback after successful fetch
 * @param onError - Optional callback on error
 *
 * @example
 * const appStore = useAppStore();
 * await syncFromGoogleSheets(
 *   webAppUrl,
 *   'Masterlist',
 *   () => console.log('Sync complete'),
 *   (error) => console.error('Sync failed:', error)
 * );
 */
export async function syncFromGoogleSheets(
  webAppUrl: string,
  sheetName: string = "Masterlist",
  onSuccess?: () => void,
  onError?: (error: string) => void
): Promise<void> {
  try {
    const result = await fetchEmployeesFromGoogleSheets(webAppUrl, sheetName);

    if (result.success) {
      onSuccess?.();
    } else {
      onError?.(result.message);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    onError?.(errorMessage);
  }
}
