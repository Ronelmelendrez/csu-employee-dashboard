import { CSUConnectionStatus } from '../types/employee';

/**
 * Normalize CSU connection status values from various formats
 * Handles: YES, NO, DECEASED (case-insensitive)
 * Also handles variations like: Y/N, TRUE/FALSE, 1/0, ACTIVE/INACTIVE
 *
 * @param value - The raw value from Excel or other sources
 * @returns Normalized CSUConnectionStatus or undefined if invalid
 */
export function normalizeCSUConnectionStatus(value: any): CSUConnectionStatus | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = String(value)
    .toUpperCase()
    .trim()
    .replace(/\s+/g, '');

  // Map various input formats to standard values
  const statusMap: Record<string, CSUConnectionStatus> = {
    // YES variations
    'YES': 'YES',
    'Y': 'YES',
    'TRUE': 'YES',
    '1': 'YES',
    'ACTIVE': 'YES',
    'CONNECTED': 'YES',
    'AFFILIA': 'YES',
    'AFFILIATED': 'YES',

    // NO variations
    'NO': 'NO',
    'N': 'NO',
    'FALSE': 'NO',
    '0': 'NO',
    'INACTIVE': 'NO',
    'DISCONNECTED': 'NO',
    'NOTCONNECTED': 'NO',

    // DECEASED variations
    'DECEASED': 'DECEASED',
    'DEAD': 'DECEASED',
    'EXPIRED': 'DECEASED',
    'PASSED': 'DECEASED',
    'PASSEDAWAY': 'DECEASED',
    'DEPARTED': 'DECEASED'
  };

  return statusMap[normalized];
}

/**
 * Validate if a value is a valid CSUConnectionStatus
 * @param value - The value to validate
 * @returns true if valid CSUConnectionStatus
 */
export function isValidCSUConnectionStatus(value: any): value is CSUConnectionStatus {
  if (!value) return false;
  const normalized = normalizeCSUConnectionStatus(value);
  return normalized !== undefined;
}

/**
 * Get display label for CSU connection status
 * @param status - The CSUConnectionStatus value
 * @returns Human-readable label
 */
export function getCSUConnectionStatusLabel(status: CSUConnectionStatus): string {
  const labels: Record<CSUConnectionStatus, string> = {
    'YES': 'Still Connected',
    'NO': 'Not Connected',
    'DECEASED': 'Deceased'
  };
  return labels[status];
}

/**
 * Get color/badge style for CSU connection status
 * @param status - The CSUConnectionStatus value
 * @returns Color class name for styling
 */
export function getCSUConnectionStatusColor(status: CSUConnectionStatus): string {
  const colors: Record<CSUConnectionStatus, string> = {
    'YES': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'NO': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    'DECEASED': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };
  return colors[status];
}

/**
 * Check if employee is actively connected with CSU
 * @param status - The CSUConnectionStatus value
 * @returns true if connected (YES only)
 */
export function isConnectedWithCSU(status?: CSUConnectionStatus): boolean {
  return status === 'YES';
}

/**
 * Check if employee is deceased
 * @param status - The CSUConnectionStatus value
 * @returns true if deceased
 */
export function isDeceased(status?: CSUConnectionStatus): boolean {
  return status === 'DECEASED';
}
