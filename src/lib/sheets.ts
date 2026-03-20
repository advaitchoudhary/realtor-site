import { google } from "googleapis";
import type { Inquiry } from "./types";

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
const SHEET_NAME = "Inquiries";
const RANGE = `${SHEET_NAME}!A:L`;

const HEADERS = [
  "id", "name", "email", "phone", "message",
  "type", "source", "listingAddress", "listingPrice",
  "status", "notes", "createdAt",
];

// 0-based column indices
const C = {
  id: 0, name: 1, email: 2, phone: 3, message: 4,
  type: 5, source: 6, listingAddress: 7, listingPrice: 8,
  status: 9, notes: 10, createdAt: 11,
} as const;

function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

function rowToInquiry(row: string[]): Inquiry {
  return {
    id: row[C.id] ?? "",
    name: row[C.name] ?? "",
    email: row[C.email] ?? "",
    phone: row[C.phone] ?? "",
    message: row[C.message] ?? "",
    type: (row[C.type] as Inquiry["type"]) || "general",
    source: row[C.source] ? (row[C.source] as Inquiry["source"]) : undefined,
    listingAddress: row[C.listingAddress] || undefined,
    listingPrice: row[C.listingPrice] ? Number(row[C.listingPrice]) : undefined,
    status: (row[C.status] as Inquiry["status"]) || "new",
    notes: row[C.notes] || undefined,
    createdAt: row[C.createdAt] ?? "",
  };
}

function inquiryToRow(inquiry: Inquiry): (string | number)[] {
  return [
    inquiry.id,
    inquiry.name,
    inquiry.email,
    inquiry.phone ?? "",
    inquiry.message,
    inquiry.type,
    inquiry.source ?? "",
    inquiry.listingAddress ?? "",
    inquiry.listingPrice ?? "",
    inquiry.status,
    inquiry.notes ?? "",
    inquiry.createdAt,
  ];
}

async function ensureHeaders(sheets: ReturnType<typeof getSheets>): Promise<void> {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A1`,
  });
  if (res.data.values?.[0]?.[0] !== "id") {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:L1`,
      valueInputOption: "RAW",
      requestBody: { values: [HEADERS] },
    });
  }
}

export async function getAllInquiries(): Promise<Inquiry[]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
  });
  const rows = (res.data.values ?? []) as string[][];
  return rows
    .slice(1) // skip header row
    .filter((row) => row[0]) // skip empty rows
    .map(rowToInquiry)
    .reverse(); // newest first (sheet is append-only)
}

export async function appendInquiry(inquiry: Inquiry): Promise<void> {
  const sheets = getSheets();
  await ensureHeaders(sheets);
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [inquiryToRow(inquiry)] },
  });
}

export async function updateInquiryById(
  id: string,
  updates: Partial<Inquiry>
): Promise<Inquiry | null> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
  });
  const rows = (res.data.values ?? []) as string[][];
  const rowIndex = rows.findIndex((row, i) => i > 0 && row[0] === id);
  if (rowIndex === -1) return null;

  const updated = { ...rowToInquiry(rows[rowIndex]), ...updates };
  const sheetRow = rowIndex + 1; // 1-based

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A${sheetRow}:L${sheetRow}`,
    valueInputOption: "RAW",
    requestBody: { values: [inquiryToRow(updated)] },
  });

  return updated;
}

export async function deleteInquiryById(id: string): Promise<boolean> {
  const sheets = getSheets();

  const [spreadsheet, colRes] = await Promise.all([
    sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID }),
    sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:A`,
    }),
  ]);

  const sheetId =
    spreadsheet.data.sheets?.find((s) => s.properties?.title === SHEET_NAME)
      ?.properties?.sheetId ?? 0;

  const rows = (colRes.data.values ?? []) as string[][];
  const rowIndex = rows.findIndex((row, i) => i > 0 && row[0] === id);
  if (rowIndex === -1) return false;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowIndex, // 0-based
              endIndex: rowIndex + 1,
            },
          },
        },
      ],
    },
  });

  return true;
}
