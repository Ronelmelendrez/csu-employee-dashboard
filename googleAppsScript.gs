/**
 * Google Apps Script for CSU Employee Dashboard Spreadsheet Sync
 * 
 * Setup Instructions:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Copy all code from this file into the Apps Script editor
 * 4. Replace SPREADSHEET_ID with your actual Google Sheet ID
 * 5. Deploy as web app (Deploy → New Deployment → Web app → Execute as: Your Account)
 * 6. Grant permissions and copy the deployment URL
 * 7. Paste the deployment URL into your dashboard config
 */

// Configuration - UPDATE THIS WITH YOUR SHEET ID
const SPREADSHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE";
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
 * Handle GET requests - fetch all employees
 */
function doGet(e) {
  const action = e.parameter.action || "getAll";
  const sheetName = e.parameter.sheet || DEFAULT_SHEET;
  
  try {
    if (action === "getAll") {
      return getEmployees(sheetName);
    } else if (action === "getById") {
      return getEmployeeById(e.parameter.id, sheetName);
    } else if (action === "getSheets") {
      return getAvailableSheets();
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
 * Get all employees from a specific sheet
 */
function getEmployees(sheetName = DEFAULT_SHEET) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return createResponse(false, `Sheet "${sheetName}" not found`, null);
  }
  
  const data = sheet.getDataRange().getValues();
  if (data.length === 0) {
    return createResponse(true, "No employees found", []);
  }
  
  const headers = data[0];
  const employees = [];
  
  for (let i = 1; i < data.length; i++) {
    const employee = {};
    for (let j = 0; j < headers.length; j++) {
      employee[headers[j]] = data[i][j];
    }
    employees.push(employee);
  }
  
  return createResponse(true, `Retrieved ${employees.length} employees from "${sheetName}"`, employees);
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
  
  const headers = data[0];
  const idIndex = headers.indexOf("id");
  
  if (idIndex === -1) {
    return createResponse(false, "Column 'id' not found in sheet", null);
  }
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] == id) {
      const employee = {};
      for (let j = 0; j < headers.length; j++) {
        employee[headers[j]] = data[i][j];
      }
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
 * Test function to verify the script is working
 */
function testScript() {
  // Test available sheets
  Logger.log("=== Available Sheets ===");
  const sheets = getAvailableSheets();
  Logger.log(sheets);
  
  // Test reading from Masterlist
  Logger.log("\n=== Reading from Masterlist ===");
  const employees = getEmployees("Masterlist");
  Logger.log(employees);
  
  // Test reading from other sheets
  Logger.log("\n=== Checking sheet data ===");
  for (let sheetName of AVAILABLE_SHEETS) {
    const result = getEmployees(sheetName);
    if (result.data && result.data.length > 0) {
      Logger.log(`${sheetName}: ${result.data.length} employees`);
    }
  }
}
