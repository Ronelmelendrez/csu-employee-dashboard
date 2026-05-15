/**
 * Google Apps Script for CSU Employee Dashboard - Dynamic Column Mapping
 * 
 * Features:
 * - Dynamic column mapping with synonyms
 * - Automatic header matching (case-insensitive)
 * - Date format conversion (YYYY-MM-DD)
 * - Multi-sheet support
 * - JSON response with Employee interface
 * 
 * Setup Instructions:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Copy all code from this file into the Apps Script editor
 * 4. Replace SPREADSHEET_ID with your actual Google Sheet ID
 * 5. Deploy as web app (Deploy → New Deployment → Web app → Execute as: Your Account)
 * 6. Grant permissions and copy the deployment URL
 * 7. Paste the deployment URL into your React app
 */

// Configuration - UPDATE THIS WITH YOUR SHEET ID
const SPREADSHEET_ID = "1NCRhieMvDsGv0KhFCmCzR2bJm-CvA25AMbxhmgZY8xQ";
const DEFAULT_SHEET = "Masterlist"; // Main sheet to read from

// Available sheets in your spreadsheet
const AVAILABLE_SHEETS = [
  "Masterlist",
  "2021-2025",
  "2021-2025(2)",
  "2023-2024",
  "CMNS-CED",
  "Faculty - ongoing",
  "admin-ongoing"
];

/**
 * Column mapping - maps possible header variations to Employee field names
 * Each key is the Employee interface field name
 * Each value is an array of possible column header names (synonyms)
 */
const COLUMN_MAPPING = {
  id: ["EMPLOYEE ID NUMBER", "employee id number", "employee id", "EMPLOYEE ID", "ID", "id"],
  no: ["No.", "NO.", "no.", "NO", "number", "NUMBER", "no"],
  dateOfBirth: ["DATE OF BIRTH", "date of birth", "DOB", "dob", "birth date", "Birth Date"],
  name: ["NAME", "name", "EMPLOYEE NAME", "employee name", "FULL NAME", "full name"],
  address: ["ADDRESS", "address", "home address", "HOME ADDRESS", "residential address", "RESIDENTIAL ADDRESS"],
  currentRank: ["CURRENT RANK", "current rank", "RANK", "rank", "position", "Position", "job title", "JOB TITLE"],
  officialStation: ["OFFICIAL STATION", "official station", "STATION", "station", "campus", "Campus", "department", "Department"],
  categoryOfEmployment: ["CATEGORY OF EMPLOYMENT", "category of employment", "EMPLOYMENT CATEGORY", "employment category", "employment type", "EMPLOYMENT TYPE"],
  employmentStatus: ["EMPLOYMENT STATUS", "employment status", "STATUS", "status", "employment stat", "EMPLOYMENT STAT"],
  courseProgram: ["COURSE/ PROGRAM", "course/ program", "COURSE/PROGRAM", "course/program", "PROGRAM", "program", "COURSE", "course", "degree", "DEGREE"],
  fundingSource: ["FUNDING SOURCE", "funding source", "FUNDING", "funding", "budget source", "BUDGET SOURCE", "fund source", "FUND SOURCE"],
  universityAttended: ["UNIVERSITY ATTENDED/DHEI", "university attended/dhei", "UNIVERSITY ATTENDED", "university attended", "UNIVERSITY", "university", "INSTITUTION", "institution"],
  contractDuration: ["CONTRACT DURATION", "contract duration", "DURATION", "duration", "contract period", "CONTRACT PERIOD"],
  leaveOfAbsence: ["LEAVE OF ABSENCE", "leave of absence", "LEAVE", "leave", "absence", "ABSENCE"],
  resolutionOfStudyLeave: ["RESUMPTION OF STUDY LEAVE", "resumption of study leave", "STUDY LEAVE", "study leave", "resumption", "RESUMPTION"],
  reinstatement: ["REINSTATEMENT", "reinstatement", "REINSTATED", "reinstated", "reinstate", "REINSTATE"],
  schoolingStatus: ["SCHOOLING STATUS", "schooling status", "SCHOOL STATUS", "school status", "education status", "EDUCATION STATUS"],
  graduationDate: ["GRADUATION DATE", "graduation date", "GRAD DATE", "grad date", "date graduated", "DATE GRADUATED"],
  clothingAllowanceAndPBB: ["CLOTHING ALLOWANCE AND PBB", "clothing allowance and pbb", "CLOTHING ALLOWANCE", "clothing allowance", "PBB", "pbb"],
  connectedWithCSU: ["Still connected with CSU?", "Still connected with CSU? As of 2025", "CONNECTED WITH CSU", "connected with csu", "CONNECTED", "connected", "CSU CONNECTION", "csu connection"],
  returnService: ["RETURN SERVICE", "return service", "RETURN SVC", "return svc", "return", "RETURN"],
  enrolled: ["Enrolled?", "ENROLLED?", "enrolled?", "ENROLLED", "enrolled", "enrollment", "ENROLLMENT"],
  remarks: ["REMARKS", "remarks", "NOTES", "notes", "comment", "COMMENT", "comments", "COMMENTS"]
};

/**
 * Normalize a header string for matching
 * Converts to lowercase and trims whitespace
 */
function normalizeHeader(header) {
  if (!header) return "";
  return String(header).toLowerCase().trim();
}

/**
 * Find the Employee field name for a given column header
 * Returns null if no match found
 */
function getFieldNameForHeader(header) {
  const normalizedHeader = normalizeHeader(header);
  
  for (let fieldName in COLUMN_MAPPING) {
    const synonyms = COLUMN_MAPPING[fieldName];
    for (let synonym of synonyms) {
      if (normalizeHeader(synonym) === normalizedHeader) {
        return fieldName;
      }
    }
  }
  
  return null;
}

/**
 * Convert various date formats to YYYY-MM-DD
 */
function formatDate(value) {
  if (!value) return "";
  
  // If it's already a string in YYYY-MM-DD format, return as-is
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  
  // If it's a Date object
  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  
  // Try to parse string date
  if (typeof value === "string") {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  }
  
  // If unable to parse, return string representation
  return String(value);
}

function normalizeYesNo(value) {
  if (value === null || value === undefined) return "";
  const text = String(value).trim().toLowerCase();

  if (["yes", "y", "true", "1"].includes(text)) return "Yes";
  if (["no", "n", "false", "0"].includes(text)) return "No";

  return String(value).trim();
}

/**
 * Convert a row of data to Employee object with dynamic column mapping
 */
function rowToEmployee(headers, values) {
  const employee = {};
  
  for (let i = 0; i < headers.length && i < values.length; i++) {
    const header = headers[i];
    const value = values[i];
    const fieldName = getFieldNameForHeader(header);
    
    if (fieldName) {
      // Special handling for date fields
      if (fieldName === "graduationDate") {
        employee[fieldName] = formatDate(value);
      } else if (fieldName === "connectedWithCSU") {
        employee[fieldName] = normalizeYesNo(value);
      } else {
        employee[fieldName] = value !== undefined ? String(value).trim() : "";
      }
    }
  }
  
  // Ensure all required fields exist (set to empty string if missing)
  const requiredFields = Object.keys(COLUMN_MAPPING);
  for (let field of requiredFields) {
    if (!employee.hasOwnProperty(field)) {
      employee[field] = field === "id" ? 0 : "";
    }
  }
  
  return employee;
}

/**
 * Initialize the default sheet with headers
 */
function initializeSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(DEFAULT_SHEET);
  
  if (!sheet) {
    sheet = ss.insertSheet(DEFAULT_SHEET);
  }
  
  // Only clear if empty (don't destroy existing data)
  if (sheet.getLastRow() === 0) {
    // Set up headers
    const headers = [
      "id",
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
    
    sheet.appendRow(headers);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#1f2937");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
  }
}

/**
 * Handle GET requests - fetch employees with dynamic column mapping
 */
function doGet(e) {
  const action = e.parameter.action || "getAll";
  const sheetName = e.parameter.sheet || DEFAULT_SHEET;
  
  try {
    if (action === "getAll") {
      return getEmployees(sheetName);
    } else if (action === "getAllSheets") {
      return getEmployees("ALL");
    } else if (action === "getById") {
      return getEmployeeById(e.parameter.id, sheetName);
    } else if (action === "getSheets") {
      return getAvailableSheets();
    } else if (action === "getMapping") {
      return getColumnMapping();
    } else {
      return createResponse(false, "Unknown action", null);
    }
  } catch (error) {
    return createResponse(false, error.toString(), null);
  }
}

/**
 * Handle POST requests - add/update employees
 */
function doPost(e) {
  const action = e.parameter.action || "add";
  const sheetName = e.parameter.sheet || DEFAULT_SHEET;
  
  try {
    if (action === "add") {
      const data = JSON.parse(e.postData.contents);
      return addEmployee(data, sheetName);
    } else if (action === "update") {
      const data = JSON.parse(e.postData.contents);
      return updateEmployee(data, sheetName);
    } else if (action === "delete") {
      const data = JSON.parse(e.postData.contents);
      return deleteEmployee(data.id, sheetName);
    } else if (action === "sync") {
      const data = JSON.parse(e.postData.contents);
      return syncEmployees(data, sheetName);
    } else {
      return createResponse(false, "Unknown action", null);
    }
  } catch (error) {
    return createResponse(false, error.toString(), null);
  }
}

/**
 * Get all employees from a specific sheet with dynamic column mapping
 */
function findHeaderRowIndex(data, maxScanRows) {
  const scanLimit = Math.min(maxScanRows, data.length);
  let bestIndex = 0;
  let bestMatchCount = 0;

  for (let i = 0; i < scanLimit; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    let matchCount = 0;
    for (let j = 0; j < row.length; j++) {
      if (getFieldNameForHeader(row[j])) {
        matchCount++;
      }
    }

    if (matchCount > bestMatchCount) {
      bestMatchCount = matchCount;
      bestIndex = i;
    }
  }

  return bestIndex;
}

function getEmployees(sheetName = DEFAULT_SHEET) {
  if (sheetName === "ALL") {
    return getEmployeesFromAllSheets();
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return createResponse(false, `Sheet "${sheetName}" not found`, null);
  }
  
  const data = sheet.getDataRange().getValues();
  if (data.length === 0) {
    return createResponse(true, "No data found", []);
  }
  
  const headerRowIndex = findHeaderRowIndex(data, 10);
  const headers = data[headerRowIndex];
  const employees = [];
  let autoId = 1;
  
  // Process each row of data
  for (let i = headerRowIndex + 1; i < data.length; i++) {
    const employee = rowToEmployee(headers, data[i]);
    
    // Auto-generate unique ID based on row number if missing or empty
    if (!employee.id || employee.id === "" || employee.id === 0) {
      employee.id = autoId;
      autoId++;
    } else {
      autoId = Math.max(autoId, parseInt(employee.id) || 0) + 1;
    }
    
    // Check if row has any actual data
    const rowData = data[i].filter(cell => cell !== null && cell !== undefined && String(cell).trim() !== "");
    
    if (rowData.length > 0) {
      employees.push(employee);
    }
  }
  
  return createResponse(true, `Retrieved ${employees.length} employees from "${sheetName}" with dynamic column mapping`, employees);
}

function getEmployeesFromAllSheets() {
  const uniqueByName = new Map();
  const sheets = AVAILABLE_SHEETS.filter(name => name !== "Summary");

  for (let i = 0; i < sheets.length; i++) {
    const sheetName = sheets[i];
    const result = getEmployees(sheetName);

    if (!result.success || !result.data) {
      continue;
    }

    for (let j = 0; j < result.data.length; j++) {
      const employee = result.data[j];
      const nameKey = (employee.name || "").toString().trim().toLowerCase();

      if (!nameKey) {
        const fallbackKey = `${employee.id}-${employee.no}-${sheetName}-${j}`;
        uniqueByName.set(fallbackKey, employee);
        continue;
      }

      if (!uniqueByName.has(nameKey)) {
        uniqueByName.set(nameKey, employee);
      }
    }
  }

  const employees = Array.from(uniqueByName.values());
  return createResponse(true, `Retrieved ${employees.length} unique employees from all sheets`, employees);
}

/**
 * Get a single employee by ID from a specific sheet
 */
function getEmployeeById(id, sheetName = DEFAULT_SHEET) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return createResponse(false, `Sheet "${sheetName}" not found`, null);
  }
  
  const data = sheet.getDataRange().getValues();
  if (data.length === 0) {
    return createResponse(false, "Sheet is empty", null);
  }
  
  const headerRowIndex = findHeaderRowIndex(data, 10);
  const headers = data[headerRowIndex];
  
  // Find ID column
  let idColumnIndex = -1;
  for (let i = 0; i < headers.length; i++) {
    if (getFieldNameForHeader(headers[i]) === "id") {
      idColumnIndex = i;
      break;
    }
  }
  
  if (idColumnIndex === -1) {
    return createResponse(false, "Column 'id' not found in sheet", null);
  }
  
  // Search for employee
  for (let i = 1; i < data.length; i++) {
    if (data[i][idColumnIndex] == id) {
      const employee = rowToEmployee(headers, data[i]);
      return createResponse(true, `Employee found in "${sheetName}"`, employee);
    }
  }
  
  return createResponse(false, "Employee not found", null);
}

/**
 * Add a new employee to a specific sheet
 */
function addEmployee(employee, sheetName = DEFAULT_SHEET) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return createResponse(false, `Sheet "${sheetName}" not found`, null);
  }
  
  const data = sheet.getDataRange().getValues();
  if (data.length === 0) {
    return createResponse(false, `Sheet "${sheetName}" has no headers`, null);
  }
  
  const headers = data[0];
  
  // Generate ID if not provided
  if (!employee.id) {
    const maxId = Math.max(...data.slice(1).map(row => parseInt(row[0]) || 0));
    employee.id = maxId + 1;
  }
  
  const row = headers.map(header => employee[header] || "");
  sheet.appendRow(row);
  
  return createResponse(true, `Employee added to "${sheetName}"`, employee);
}

/**
 * Update an existing employee in a specific sheet
 */
function updateEmployee(employee, sheetName = DEFAULT_SHEET) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return createResponse(false, `Sheet "${sheetName}" not found`, null);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf("id");
  
  if (idIndex === -1) {
    return createResponse(false, "Column 'id' not found in sheet", null);
  }
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] == employee.id) {
      for (let j = 0; j < headers.length; j++) {
        const newValue = employee[headers[j]] !== undefined ? employee[headers[j]] : data[i][j];
        sheet.getRange(i + 1, j + 1).setValue(newValue);
      }
      return createResponse(true, `Employee updated in "${sheetName}"`, employee);
    }
  }
  
  return createResponse(false, "Employee not found", null);
}

/**
 * Delete an employee by ID from a specific sheet
 */
function deleteEmployee(id, sheetName = DEFAULT_SHEET) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return createResponse(false, `Sheet "${sheetName}" not found`, null);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf("id");
  
  if (idIndex === -1) {
    return createResponse(false, "Column 'id' not found in sheet", null);
  }
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] == id) {
      sheet.deleteRow(i + 1);
      return createResponse(true, `Employee deleted from "${sheetName}"`, { id: id });
    }
  }
  
  return createResponse(false, "Employee not found", null);
}

/**
 * Bulk sync employees to a specific sheet (replace all data)
 */
function syncEmployees(employees, sheetName = DEFAULT_SHEET) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return createResponse(false, `Sheet "${sheetName}" not found`, null);
  }
  
  // Keep headers, delete all data rows
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Add new employees
  for (let emp of employees) {
    const row = headers.map(header => emp[header] || "");
    sheet.appendRow(row);
  }
  
  return createResponse(true, `Synced ${employees.length} employees to "${sheetName}"`, {
    count: employees.length,
    sheet: sheetName
  });
}

/**
 * Get list of available sheets with their row counts
 */
function getAvailableSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheets = ss.getSheets();
  
  const sheetList = sheets.map(sheet => ({
    name: sheet.getName(),
    rows: sheet.getLastRow(),
    isDefault: sheet.getName() === DEFAULT_SHEET
  }));
  
  return createResponse(true, "Available sheets", sheetList);
}

/**
 * Get column mapping with all synonyms
 */
function getColumnMapping() {
  return createResponse(true, "Column mapping configuration", COLUMN_MAPPING);
}

/**
 * Create a standardized response object
 */
function createResponse(success, message, data) {
  const response = {
    success: success,
    message: message,
    data: data,
    timestamp: new Date().toISOString()
  };
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function to verify dynamic column mapping
 */
function testScript() {
  Logger.log("=== Testing Dynamic Column Mapping ===\n");
  
  // Test header normalization
  Logger.log("--- Testing Header Matching ---");
  const testHeaders = [
    "Employee ID",
    "Current Rank",
    "Official Station",
    "employment status",
    "GRADUATION DATE"
  ];
  
  testHeaders.forEach(header => {
    const fieldName = getFieldNameForHeader(header);
    Logger.log(`"${header}" → "${fieldName}"`);
  });
  
  // Test available sheets
  Logger.log("\n--- Available Sheets ---");
  const sheetsResult = getAvailableSheets();
  Logger.log(sheetsResult);
  
  // Test reading from Masterlist with dynamic mapping
  Logger.log("\n--- Reading from Masterlist with Dynamic Mapping ---");
  const employeesResult = getEmployees("Masterlist");
  Logger.log(`Success: ${employeesResult.success}`);
  Logger.log(`Message: ${employeesResult.message}`);
  if (employeesResult.success && employeesResult.data && employeesResult.data.length > 0) {
    Logger.log("First employee:");
    Logger.log(employeesResult.data[0]);
  }
  
  // Test column mapping endpoint
  Logger.log("\n--- Column Mapping ---");
  const mappingResult = getColumnMapping();
  Logger.log(`Available field mappings: ${Object.keys(mappingResult.data).length}`);
}
