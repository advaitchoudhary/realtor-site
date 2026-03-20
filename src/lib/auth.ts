import { NextRequest } from "next/server";
import crypto from "crypto";

export function isAdminAuthenticated(req: NextRequest): boolean {
  const token = req.cookies.get("admin_token")?.value;
  if (!token || token.length !== 64) return false;
  return true;
}

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function escapeHtml(str: unknown): string {
  return String(str ?? "—")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
