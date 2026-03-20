import { NextRequest, NextResponse } from "next/server";
import { getAllInquiries, updateInquiryById, deleteInquiryById } from "@/lib/sheets";
import { isAdminAuthenticated } from "@/lib/auth";

const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(req)) return unauthorized();
  const { id } = await params;
  try {
    const inquiries = await getAllInquiries();
    const inquiry = inquiries.find((i) => i.id === id);
    if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(inquiry);
  } catch (err) {
    console.error("Failed to fetch inquiry:", err);
    return NextResponse.json({ error: "Failed to fetch inquiry" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(req)) return unauthorized();
  const { id } = await params;
  try {
    const updates = await req.json();
    const updated = await updateInquiryById(id, updates);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Failed to update inquiry:", err);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(req)) return unauthorized();
  const { id } = await params;
  try {
    const deleted = await deleteInquiryById(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete inquiry:", err);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
