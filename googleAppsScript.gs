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
const SHEET_NAME = "Employees";

/**
 * Initialize the spreadsheet with headers and sample data
 */
function initializeSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  
  // Clear existing data
  sheet.clear();
  
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

/**
 * Handle GET requests - fetch all employees
 */
function doGet(e) {
  const action = e.parameter.action || "getAll";
  
  try {
    if (action === "getAll") {
      return getEmployees();
    } else if (action === "getById") {
      return getEmployeeById(e.parameter.id);
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
  
  try {
    if (action === "add") {
      const data = JSON.parse(e.postData.contents);
      return addEmployee(data);
    } else if (action === "update") {
      const data = JSON.parse(e.postData.contents);
      return updateEmployee(data);
    } else if (action === "delete") {
      const data = JSON.parse(e.postData.contents);
      return deleteEmployee(data.id);
    } else if (action === "sync") {
      const data = JSON.parse(e.postData.contents);
      return syncEmployees(data);
    } else {
      return createResponse(false, "Unknown action", null);
    }
  } catch (error) {
    return createResponse(false, error.toString(), null);
  }
}

/**
 * Get all employees from the sheet
 */
function getEmployees() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    return createResponse(false, "Sheet not found", null);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const employees = [];
  
  for (let i = 1; i < data.length; i++) {
    const employee = {};
    for (let j = 0; j < headers.length; j++) {
      employee[headers[j]] = data[i][j];
    }
    employees.push(employee);
  }
  
  return createResponse(true, "Employees retrieved successfully", employees);
}

/**
 * Get a single employee by ID
 */
function getEmployeeById(id) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf("id");
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] == id) {
      const employee = {};
      for (let j = 0; j < headers.length; j++) {
        employee[headers[j]] = data[i][j];
      }
      return createResponse(true, "Employee found", employee);
    }
  }
  
  return createResponse(false, "Employee not found", null);
}

/**
 * Add a new employee
 */
function addEmployee(employee) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    initializeSheet();
    sheet = ss.getSheetByName(SHEET_NAME);
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Generate ID if not provided
  if (!employee.id) {
    const lastRow = sheet.getLastRow();
    const data = sheet.getDataRange().getValues();
    const maxId = Math.max(...data.slice(1).map(row => parseInt(row[0]) || 0));
    employee.id = maxId + 1;
  }
  
  const row = headers.map(header => employee[header] || "");
  sheet.appendRow(row);
  
  return createResponse(true, "Employee added successfully", employee);
}

/**
 * Update an existing employee
 */
function updateEmployee(employee) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf("id");
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] == employee.id) {
      for (let j = 0; j < headers.length; j++) {
        const newValue = employee[headers[j]] !== undefined ? employee[headers[j]] : data[i][j];
        sheet.getRange(i + 1, j + 1).setValue(newValue);
      }
      return createResponse(true, "Employee updated successfully", employee);
    }
  }
  
  return createResponse(false, "Employee not found", null);
}

/**
 * Delete an employee by ID
 */
function deleteEmployee(id) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf("id");
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] == id) {
      sheet.deleteRow(i + 1);
      return createResponse(true, "Employee deleted successfully", { id: id });
    }
  }
  
  return createResponse(false, "Employee not found", null);
}

/**
 * Bulk sync employees (replace all data)
 */
function syncEmployees(employees) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    initializeSheet();
    sheet = ss.getSheetByName(SHEET_NAME);
  }
  
  // Keep headers, delete all data rows
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Add new employees
  for (let emp of employees) {
    const row = headers.map(header => emp[header] || "");
    sheet.appendRow(row);
  }
  
  return createResponse(true, "Employees synced successfully", {
    count: employees.length
  });
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
  const result = getEmployees();
  Logger.log(result);
}
