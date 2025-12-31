import { LoadDataResponse, ProcessQueryResponse, DetectedTable } from '../lib/types';

// ============================================================================
// API Service Stub
// Use this file to connect to your actual Python backend in the future.
// Currently serves strict, backend-aligned mock data.
// ============================================================================

const API_DELAY = 1500; // ms to simulate network latency

export const api = {
  /**
   * Connect to a dataset URL.
   * Backend equivalent: load_sheets_data(spreadsheet_id)
   */
  loadDataset: async (url: string): Promise<LoadDataResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock success response matching "DetectedTable" schema
        resolve({
          success: true,
          stats: {
            totalTables: 25,
            totalRecords: 1305,
            sheetCount: 5,
            sheets: ['Month', 'Profit', 'November_Detail', 'Calculation_of_Profit', 'Freshggies_Shop'],
            detectedTables: generateMockTables()
          }
        });
      }, 3000); // Longer delay to show off the loader steps
    });
  },

  /**
   * Process a user query (text).
   * Backend equivalent: process_query(question)
   */
  sendMessage: async (text: string): Promise<ProcessQueryResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          explanation: `I've analyzed the data for "${text}". The trends indicate a positive correlation between fresh produce sales and weekend foot traffic.`,
          data: [
            { "Category": "Fresh Fruits", "August Qty": 125, "Total": 820 },
            { "Category": "Vegetables", "August Qty": 98, "Total": 450 },
            { "Category": "Spices", "August Qty": 45, "Total": 120 },
            { "Category": "Dairy", "August Qty": 210, "Total": 950 },
          ],
          plan: {
            query_type: "lookup",
            table: "Freshggies_Shopify_Sales",
            select_columns: ["Category", "August Qty", "Total"],
            metrics: ["Total"],
            filters: [
              { column: "Category", operator: "LIKE", value: "%fresh%" }
            ],
            limit: 5,
            group_by: ["Category"],
            order_by: [{ column: "Total", direction: "DESC" }]
          },
          schema_context: [
            { text: "Table 'sales' contains columns: Category, Qty, Total..." },
            { text: "Table 'inventory' links to 'sales' via SKU..." }
          ],
          data_refreshed: false
        });
      }, API_DELAY);
    });
  },

  /**
   * Upload audio blob for transcription.
   * Backend equivalent: POST /transcribe (using Whisper/ElevenLabs)
   */
  transcribeAudio: async (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      console.log("Sending audio blob to backend:", audioBlob.size, "bytes");
      setTimeout(() => {
        // Mock varied responses based on "audio" (random)
        resolve("Analyze the overall profit trends for August.");
      }, 1200); // Simulate upload + processing time
    });
  },

  /**
   * Check authentication status.
   * Backend equivalent: GET /auth/status or session check
   */
  checkAuth: async (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Simulate checking a session cookie or token
      setTimeout(() => resolve(true), 500);
    });
  }
};

// Helper to generate realistic backend-like table structures
function generateMockTables(): DetectedTable[] {
  return [
    {
      table_id: "t1",
      title: "Monthly_Sales_Summary",
      sheet_name: "Month",
      source_id: "sheet_123#Month",
      sheet_hash: "abc123hash",
      row_range: [2, 150],
      col_range: [0, 8],
      total_rows: 148,
      columns: ["Month", "Revenue", "Cost", "Profit", "Margin"],
      preview_data: []
    },
    {
      table_id: "t2",
      title: "Employee_Roster",
      sheet_name: "Staff",
      source_id: "sheet_123#Staff",
      sheet_hash: "xyz789hash",
      row_range: [0, 50],
      col_range: [0, 5],
      total_rows: 50,
      columns: ["ID", "Name", "Role", "Join Date", "Salary"],
      preview_data: []
    }
  ];
}
