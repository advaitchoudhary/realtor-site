import { NextResponse } from "next/server";

// No persistent storage on serverless deployment
// Inquiries are delivered via email (see /api/inquiries POST)

export async function PATCH() {
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  return NextResponse.json({ success: true });
}
