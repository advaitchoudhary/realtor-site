import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "inquiries.json");

function readInquiries() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeInquiries(data: unknown[]) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const inquiries = readInquiries();
  const inquiry = inquiries.find((i: { id: string }) => i.id === id);
  if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(inquiry);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const inquiries = readInquiries();
  const index = inquiries.findIndex((i: { id: string }) => i.id === id);
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  inquiries[index] = { ...inquiries[index], ...body };
  writeInquiries(inquiries);

  return NextResponse.json(inquiries[index]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const inquiries = readInquiries();
  const filtered = inquiries.filter((i: { id: string }) => i.id !== id);
  writeInquiries(filtered);
  return NextResponse.json({ success: true });
}
