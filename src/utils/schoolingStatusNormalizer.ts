/**
 * Normalize schooling status values from various formats
 * Handles: COMPLETED, ONGOING, ON-LEAVE, PENDING, etc.
 */

/**
 * Normalize schooling status value from various formats
 * @param value - The raw value from Excel or other sources
 * @returns Normalized schooling status or original value if cannot determine
 */
export function normalizeSchoolingStatus(value: any): string {
  if (!value) {
    return '';
  }

  const normalized = String(value)
    .toUpperCase()
    .trim()
    .replace(/\s+/g, ' ');

  // Map various input formats to standard values
  const statusMap: Record<string, string> = {
    // COMPLETED variations
    'COMPLETED': 'COMPLETED',
    'COMPLETE': 'COMPLETED',
    'DONE': 'COMPLETED',
    'FINISHED': 'COMPLETED',
    'FINALIZED': 'COMPLETED',

    // ONGOING variations
    'ONGOING': 'ONGOING',
    'ON-GOING': 'ONGOING',
    'IN PROGRESS': 'ONGOING',
    'IN-PROGRESS': 'ONGOING',
    'CONTINUING': 'ONGOING',
    'ACTIVE': 'ONGOING',

    // ON-LEAVE variations
    'ON-LEAVE': 'ON-LEAVE',
    'ON LEAVE': 'ON-LEAVE',
    'LEAVE': 'ON-LEAVE',
    'ABSENT': 'ON-LEAVE',
    'SUSPENDED': 'ON-LEAVE',

    // PENDING variations
    'PENDING': 'PENDING',
    'NOT STARTED': 'PENDING',
    'AWAITING': 'PENDING',
    'SCHEDULED': 'PENDING',

    // DISCONTINUED variations
    'DISCONTINUED': 'DISCONTINUED',
    'DISCONTINUED STUDIES': 'DISCONTINUED',
    'STOPPED': 'DISCONTINUED',
    'QUIT': 'DISCONTINUED',
    'WITHDRAWN': 'DISCONTINUED',
  };

  // Check if exact match exists
  if (statusMap[normalized]) {
    return statusMap[normalized];
  }

  // Check if contains key terms
  for (const [key, value] of Object.entries(statusMap)) {
    if (normalized.includes(key.replace('-', ' ')) || normalized.includes(key.replace(' ', '-'))) {
      return value;
    }
  }

  // Return original if no match found
  return String(value).trim();
}

/**
 * Get display label for schooling status
 * @param status - The schooling status value
 * @returns Human-readable label
 */
export function getSchoolingStatusLabel(status: string): string {
  const normalized = normalizeSchoolingStatus(status);
  
  const labels: Record<string, string> = {
    'COMPLETED': 'Completed',
    'ONGOING': 'Ongoing',
    'ON-LEAVE': 'On Leave',
    'PENDING': 'Pending',
    'DISCONTINUED': 'Discontinued'
  };
  
  return labels[normalized] || normalized;
}

/**
 * Get color/badge style for schooling status
 * @param status - The schooling status value
 * @returns Color class name for styling
 */
export function getSchoolingStatusColor(status: string): string {
  const normalized = normalizeSchoolingStatus(status);
  
  const colors: Record<string, string> = {
    'COMPLETED': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'ONGOING': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'ON-LEAVE': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    'PENDING': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    'DISCONTINUED': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };
  
  return colors[normalized] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
}
