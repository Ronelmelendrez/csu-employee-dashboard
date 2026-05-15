/**
 * Debug helper to inspect Google Sheets structure
 * Run this in browser console to see what columns are in your sheets
 */

export async function debugSheets(webAppUrl: string) {
  if (!webAppUrl) {
    console.error("❌ No webAppUrl provided");
    return;
  }

  try {
    const url = new URL(webAppUrl);
    url.searchParams.append("action", "debug");

    const response = await fetch(url.toString());
    const json = await response.json();

    if (!json.success) {
      console.error("❌ Debug failed:", json.message);
      return;
    }

    console.log("📋 SHEET STRUCTURE DEBUG:");
    console.log("================================");

    const debug = json.data;

    for (const [sheetName, sheetInfo] of Object.entries(debug)) {
      console.log(`\n🔹 Sheet: "${sheetName}"`);
      
      if (sheetInfo.error) {
        console.log(`   ERROR: ${sheetInfo.error}`);
        continue;
      }

      console.log(`   Total Rows: ${sheetInfo.totalRows}`);
      console.log(`   Header Row: ${sheetInfo.headerRowIndex + 1}`);
      console.log(`   Headers: ${sheetInfo.headers.join(" | ")}`);
      console.log(`\n   Column Mapping:`);

      sheetInfo.headerMappings.forEach((mapping) => {
        const icon = mapping.field ? "✓" : "✗";
        console.log(
          `     ${icon} Col ${mapping.col}: "${mapping.header}" → ${mapping.field || "NOT MAPPED"} = "${mapping.value}"`
        );
      });
    }

    console.log("\n================================");
    return debug;
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

/**
 * Usage in browser console:
 * import { debugSheets } from './utils/debug'
 * debugSheets('https://your-web-app-url')
 */
