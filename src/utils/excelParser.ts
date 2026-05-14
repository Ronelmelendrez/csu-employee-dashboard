import * as XLSX from 'xlsx';
import { Employee } from '../types/employee';

const columnMapping: Record<string, keyof Employee> = {
  'No.': 'no',
  'Current Rank': 'currentRank',
  'Official Station': 'officialStation',
  'Category of Employment': 'categoryOfEmployment',
  'Employment Status': 'employmentStatus',
  'Course/Program': 'courseProgram',
  'Funding Source': 'fundingSource',
  'University Attended/DHEI': 'universityAttended',
  'Contract Duration': 'contractDuration',
  'Reinstatement': 'reinstatement',
  'Schooling Status': 'schoolingStatus',
  'Graduation Date': 'graduationDate',
  'Still Connected with CSU? (As of 2025)': 'connectedWithCSU',
};

export const parseExcelToEmployees = (file: File): Promise<Employee[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" }) as any[];

      if (!jsonData.length) {
        reject(new Error("The spreadsheet is empty."));
        return;
      }

      const employees: Employee[] = jsonData.map((row, index) => {
        const employee: Partial<Employee> = { id: index + 1 };
        for (const [excelCol, mappedKey] of Object.entries(columnMapping)) {
          let value = row[excelCol] ?? "";
          if (typeof value === 'string') value = value.trim();
          if (mappedKey === 'graduationDate' && value) {
            if (typeof value === 'number') {
              const date = XLSX.SSF.parse_date_code(value);
              value = `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
            }
          }
          employee[mappedKey] = value || "";
        }
        employee.no = employee.no || index + 1;
        return employee as Employee;
      });
      resolve(employees);
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsBinaryString(file);
  });
};