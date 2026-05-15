/**
 * Advanced Excel Parser for Employee Data
 * Handles:
 * - Multiple title rows above headers
 * - Multi-row column headers with merged cells
 * - Varying column names and synonyms
 * - Both simple and complex Excel structures
 * - Excel date serial conversion
 */

import * as XLSX from 'xlsx';
import { Employee } from '../types/employee';

/**
 * Header variations/synonyms for each Employee field
 * Used for flexible column matching across different spreadsheets
 */
export const headerVariations: Record<keyof Employee, string[]> = {
  id: [
    'employee id number',
    'employee id',
    'emp id',
    'id',
    'employee number',
    'emp no',
    'staff number',
    'staff id'
  ],
  no: [
    'no.',
    'no',
    '#',
    'employee no',
    'emp no',
    'number',
    'row',
    'personnel no'
  ],
  dateOfBirth: [
    'date of birth',
    'dob',
    'birth date',
    'date born',
    'birth',
    'birthdate'
  ],
  name: [
    'name',
    'employee name',
    'full name',
    'first name',
    'last name',
    'person name',
    'employee'
  ],
  address: [
    'address',
    'home address',
    'residential address',
    'street address',
    'location',
    'residence'
  ],
  currentRank: [
    'current rank',
    'rank',
    'position',
    'job title',
    'title',
    'designation',
    'current position',
    'position held',
    'rank/title'
  ],
  officialStation: [
    'official station',
    'station',
    'campus',
    'office',
    'department',
    'unit',
    'workstation',
    'assigned station',
    'duty station',
    'office location'
  ],
  categoryOfEmployment: [
    'category of employment',
    'employment category',
    'employment type',
    'category',
    'emp category',
    'type of employment',
    'employment classification',
    'emp type'
  ],
  employmentStatus: [
    'employment status',
    'status',
    'employment stat',
    'emp status',
    'current status',
    'employment condition',
    'employment class'
  ],
  courseProgram: [
    'course program',
    'course/ program',
    'program',
    'course',
    'degree',
    'qualification',
    'program course',
    'educational program'
  ],
  fundingSource: [
    'funding source',
    'funding',
    'budget source',
    'fund source',
    'source of funding',
    'funding type',
    'source of funds'
  ],
  universityAttended: [
    'university attended',
    'university attended/dhei',
    'university',
    'institution',
    'educational institution',
    'school',
    'college',
    'dhei'
  ],
  contractDuration: [
    'contract duration',
    'duration',
    'contract period',
    'contract term',
    'term',
    'contract length',
    'contract tenure'
  ],
  leaveOfAbsence: [
    'leave of absence',
    'leave absence',
    'absence',
    'leave'
  ],
  resolutionOfStudyLeave: [
    'resumption of study leave',
    'resolution study leave',
    'study leave',
    'resumption'
  ],
  reinstatement: [
    'reinstatement',
    'reinstated',
    'reinstate',
    'restatement',
    'reinstatement status',
    'reappointed'
  ],
  schoolingStatus: [
    'schooling status',
    'school status',
    'education status',
    'status school',
    'educational status',
    'schooling',
    'academic status'
  ],
  graduationDate: [
    'graduation date',
    'grad date',
    'date graduated',
    'graduation',
    'grad',
    'date of graduation',
    'grad year',
    'graduation year'
  ],
  clothingAllowanceAndPBB: [
    'clothing allowance and pbb',
    'clothing allowance',
    'pbb',
    'allowance pbb',
    'clothing pbb'
  ],
  connectedWithCSU: [
    'still connected with csu',
    'connected with csu',
    'connected',
    'csu connection',
    'affiliation',
    'csu affiliated',
    'csu affiliation',
    'connected to csu'
  ],
  returnService: [
    'return service',
    'return svc',
    'return',
    'service return'
  ],
  enrolled: [
    'enrolled',
    'enrollment',
    'enroll'
  ],
  remarks: [
    'remarks',
    'notes',
    'comment',
    'comments',
    'note',
    'observation',
    'annotation'
  ]
};

/**
 * Normalize a string for comparison
 * - lowercase
 * - trim whitespace
 * - remove extra spaces
 * - remove special characters for matching
 */
function normalizeString(str: string): string {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, ''); // Remove special chars for matching
}

/**
 * Check if a normalized header contains/matches a synonym
 * Handles both exact and partial matches
 */
function headerMatchesSynonym(
  normalizedHeader: string,
  synonym: string
): boolean {
  // Exact match
  if (normalizedHeader === synonym) return true;

  // Partial match: check if key words from synonym are in header
  const synonymWords = synonym.split(' ').filter(w => w.length > 2);
  const headerWords = normalizedHeader.split(' ');

  if (synonymWords.length === 0) return false;

  // All significant words from synonym should appear in header
  const matchCount = synonymWords.filter(word =>
    headerWords.some(hw => hw.includes(word) || word.includes(hw))
  ).length;

  return matchCount >= Math.min(synonymWords.length, 2);
}

/**
 * Match a header string to an Employee field
 * Uses synonym lookup with case-insensitive matching
 *
 * @param header - The header text to match
 * @returns The Employee field name or null if no match
 */
export function matchField(header: string): keyof Employee | null {
  if (!header) return null;

  const normalizedHeader = normalizeString(header);

  // Try to find a match in headerVariations
  for (const [field, synonyms] of Object.entries(headerVariations)) {
    for (const synonym of synonyms) {
      const normalizedSynonym = normalizeString(synonym);
      if (headerMatchesSynonym(normalizedHeader, normalizedSynonym)) {
        return field as keyof Employee;
      }
    }
  }

  return null;
}

/**
 * Check if a row looks like it contains headers
 * Headers typically have text and few numbers
 */
function isLikelyHeaderRow(row: any[]): boolean {
  if (!row || row.length === 0) return false;

  let textCellCount = 0;
  let numberCellCount = 0;
  let nonEmptyCount = 0;

  // Check first 15 columns for pattern
  for (let i = 0; i < Math.min(row.length, 15); i++) {
    const cell = row[i];
    if (cell !== null && cell !== undefined && cell !== '') {
      nonEmptyCount++;
      const cellStr = String(cell).trim();

      if (!cellStr) continue;

      // Check if it's a number
      if (/^\d+(\.\d+)?$/.test(cellStr)) {
        numberCellCount++;
      } else {
        textCellCount++;
      }
    }
  }

  // Headers should have mostly text, few numbers, and reasonable width
  return (
    nonEmptyCount >= 3 &&
    textCellCount > numberCellCount &&
    textCellCount >= 2
  );
}

/**
 * Count how many cells in a row match known Employee fields
 */
function countHeaderMatches(row: any[]): number {
  let matchCount = 0;

  for (const cell of row) {
    if (cell !== null && cell !== undefined && cell !== '') {
      if (matchField(String(cell)) !== null) {
        matchCount++;
      }
    }
  }

  return matchCount;
}

/**
 * Detect the row index where the header block starts
 * Looks for rows with known Employee field names
 *
 * @param rows - 2D array of spreadsheet data
 * @returns The index of the first header row, or -1 if not found
 */
export function detectHeaderRowStart(rows: any[][]): number {
  if (!rows || rows.length === 0) return -1;

  // Strategy 1: Find row with most field matches
  let bestRow = -1;
  let bestMatchCount = 0;

  for (let i = 0; i < Math.min(rows.length, 20); i++) {
    const matchCount = countHeaderMatches(rows[i]);

    if (matchCount > 0 && matchCount > bestMatchCount) {
      bestMatchCount = matchCount;
      bestRow = i;

      // If we find 3+ matches, we're confident this is the header
      if (matchCount >= 3) {
        return i;
      }
    }
  }

  // Strategy 2: If no strong match, look for header-like pattern
  for (let i = 0; i < Math.min(rows.length, 20); i++) {
    if (isLikelyHeaderRow(rows[i])) {
      return i;
    }
  }

  // Fallback: Return best match if found
  if (bestRow >= 0) {
    return bestRow;
  }

  // Last resort: Return first non-empty row
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].some(cell => cell !== null && cell !== undefined && cell !== '')) {
      return i;
    }
  }

  return -1;
}

/**
 * Find where the header block ends
 * Headers are consecutive rows (typically 1-3), stop when hitting data
 *
 * @param rows - 2D array of spreadsheet data
 * @param startIndex - Index where headers start
 * @returns The index where headers end (first data row)
 */
function findHeaderBlockEnd(rows: any[][], startIndex: number): number {
  if (startIndex >= rows.length) return startIndex;

  let currentIndex = startIndex + 1;
  let consecutiveEmptyOrSmallRows = 0;

  while (currentIndex < rows.length) {
    const row = rows[currentIndex];
    const nonEmptyCount = row.filter(
      cell => cell !== null && cell !== undefined && cell !== ''
    ).length;

    // Check if row looks like data (all numbers)
    const nonEmptyCells = row.filter(
      cell => cell !== null && cell !== undefined && cell !== ''
    );

    const likelyAllNumbers =
      nonEmptyCells.length > 0 &&
      nonEmptyCells.every(
        cell =>
          typeof cell === 'number' ||
          !isNaN(Number(cell)) ||
          cell instanceof Date
      );

    // Row is too sparse (mostly empty) - likely data starting
    if (nonEmptyCount < 2) {
      consecutiveEmptyOrSmallRows++;
      if (consecutiveEmptyOrSmallRows > 1) {
        break;
      }
    } else {
      consecutiveEmptyOrSmallRows = 0;
    }

    // If all cells look like numbers/dates, it's data
    if (likelyAllNumbers && nonEmptyCells.length >= 3) {
      break;
    }

    currentIndex++;

    // Safety: don't look more than 5 rows for headers
    if (currentIndex - startIndex > 5) {
      break;
    }
  }

  return currentIndex;
}

/**
 * Flatten multi-row headers into single row
 * Combines text from consecutive header rows
 *
 * @param headerRows - Array of header rows to flatten
 * @returns Array of flattened header strings
 */
export function flattenHeaders(headerRows: any[][]): string[] {
  if (!headerRows || headerRows.length === 0) return [];

  // Determine maximum width
  const maxWidth = Math.max(...headerRows.map(row => row.length), 0);

  const flattened: string[] = [];

  // For each column, combine text from all rows
  for (let colIndex = 0; colIndex < maxWidth; colIndex++) {
    const parts: string[] = [];

    for (const row of headerRows) {
      const cell = row[colIndex];
      if (cell !== null && cell !== undefined && cell !== '') {
        const cellStr = String(cell).trim();
        // Only add non-empty, non-duplicate parts
        if (cellStr && !parts.includes(cellStr)) {
          parts.push(cellStr);
        }
      }
    }

    // Join with space if multiple parts, otherwise use single part
    flattened.push(parts.length > 0 ? parts.join(' ') : '');
  }

  return flattened;
}

/**
 * Check if a value looks like an Excel date serial number
 * Excel dates are typically in range 30000-50000 (year 1980-2050)
 */
function isExcelDateSerialNumber(value: any): boolean {
  if (typeof value !== 'number') return false;
  // Excel dates for modern years are between ~30000 and ~50000
  return value > 25000 && value < 60000;
}

/**
 * Convert Excel serial date to YYYY-MM-DD string
 * Excel epoch: December 30, 1899
 */
function excelDateToString(excelDate: number): string {
  try {
    if (!excelDate || typeof excelDate !== 'number') {
      return '';
    }

    // Excel's epoch is December 30, 1899
    // Days are counted from 1, not 0
    const excelEpoch = new Date(1899, 11, 30); // December 30, 1899
    const excelEpochTime = excelEpoch.getTime();

    // Convert serial to milliseconds
    const date = new Date(
      excelEpochTime + (excelDate - 1) * 24 * 60 * 60 * 1000
    );

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.warn('Failed to convert Excel date:', excelDate);
    return '';
  }
}

/**
 * Parse an Excel file and return typed Employee array
 * Handles complex headers, multi-row headers, and varying formats
 *
 * @param file - Excel file to parse
 * @returns Promise resolving to array of typed Employee objects
 *
 * @example
 * const employees = await parseExcelToEmployees(file);
 * // Returns: Employee[] with all fields properly mapped and typed
 */
export async function parseExcelToEmployees(file: File): Promise<Employee[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('Failed to read file'));
          return;
        }

        // Parse Excel file
        const workbook = XLSX.read(data, {
          type: 'array',
          raw: false, // Don't auto-format cells
          cellDates: true // Convert date-like cells to Date objects
        });

        if (!workbook || workbook.SheetNames.length === 0) {
          reject(new Error('No sheets found in workbook'));
          return;
        }

        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
          reject(new Error('No worksheets found'));
          return;
        }

        // Convert to 2D array, preserving values
        const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: ''
        }) as any[][];

        if (rows.length === 0) {
          resolve([]);
          return;
        }

        // Detect header block
        const headerStartIndex = detectHeaderRowStart(rows);

        if (headerStartIndex < 0 || headerStartIndex >= rows.length) {
          reject(new Error('Could not detect header row in spreadsheet'));
          return;
        }

        // Find where header block ends
        const headerEndIndex = findHeaderBlockEnd(rows, headerStartIndex);

        // Extract and flatten header rows
        const headerRows = rows.slice(headerStartIndex, headerEndIndex);
        const flattenedHeaders = flattenHeaders(headerRows);

        // Map each header to Employee field
        const fieldMapping: (keyof Employee | null)[] = flattenedHeaders.map(
          header => matchField(header)
        );

        // Extract data rows (skip header block)
        const dataRows = rows.slice(headerEndIndex);

        // Convert to Employee objects
        const employees: Employee[] = [];
        let autoId = 1;

        for (const row of dataRows) {
          // Skip completely empty rows
          if (
            !row ||
            row.every(cell => cell === null || cell === undefined || cell === '')
          ) {
            continue;
          }

          const employee: Partial<Employee> = {
            id: autoId++
          };

          // Map each cell to its field
          for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const fieldName = fieldMapping[colIndex];
            if (!fieldName) continue; // Skip unmapped columns

            let value = row[colIndex];

            // Handle null/undefined
            if (value === null || value === undefined) {
              value = '';
            }

            // Field-specific conversions
            if (fieldName === 'graduationDate') {
              // Convert Excel date serials
              if (isExcelDateSerialNumber(value)) {
                value = excelDateToString(value);
              } else if (value instanceof Date) {
                const year = value.getFullYear();
                const month = String(value.getMonth() + 1).padStart(2, '0');
                const day = String(value.getDate()).padStart(2, '0');
                value = `${year}-${month}-${day}`;
              } else {
                value = String(value).trim();
              }
            } else if (fieldName === 'id') {
              // For ID field, use parsed number or auto-generated
              if (!value || value === '') {
                // Already set autoId above
                continue;
              }
              const parsedId = Number(value);
              if (!isNaN(parsedId)) {
                employee.id = parsedId;
              }
            } else {
              // Default: convert to string and trim
              value = String(value).trim();
            }

            employee[fieldName] = value;
          }

          // Ensure all required fields exist with defaults
          const completeEmployee: Employee = {
            id: employee.id ?? autoId - 1,
            no: employee.no ?? '',
            dateOfBirth: employee.dateOfBirth ?? '',
            name: employee.name ?? '',
            address: employee.address ?? '',
            currentRank: employee.currentRank ?? '',
            officialStation: employee.officialStation ?? '',
            categoryOfEmployment: employee.categoryOfEmployment ?? '',
            employmentStatus: employee.employmentStatus ?? '',
            courseProgram: employee.courseProgram ?? '',
            fundingSource: employee.fundingSource ?? '',
            universityAttended: employee.universityAttended ?? '',
            contractDuration: employee.contractDuration ?? '',
            leaveOfAbsence: employee.leaveOfAbsence ?? '',
            resolutionOfStudyLeave: employee.resolutionOfStudyLeave ?? '',
            reinstatement: employee.reinstatement ?? '',
            schoolingStatus: employee.schoolingStatus ?? '',
            graduationDate: employee.graduationDate ?? '',
            clothingAllowanceAndPBB: employee.clothingAllowanceAndPBB ?? '',
            connectedWithCSU: employee.connectedWithCSU ?? '',
            returnService: employee.returnService ?? '',
            enrolled: employee.enrolled ?? '',
            remarks: employee.remarks ?? ''
          };

          employees.push(completeEmployee);
        }

        resolve(employees);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Unknown error parsing Excel file';
        reject(new Error(`Failed to parse Excel file: ${errorMessage}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
}

export default parseExcelToEmployees;