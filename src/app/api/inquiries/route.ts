import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getAllInquiries, appendInquiry } from "@/lib/sheets";

export async function GET() {
  try {
    const inquiries = await getAllInquiries();
    return NextResponse.json(inquiries);
  } catch (err) {
    console.error("Failed to fetch inquiries:", err);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message, type, listingAddress, source } = body;

    const inquiry = {
      id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ...body,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    await appendInquiry(inquiry);

    // Send email notification if API key is configured
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const sourceLabel = source ? ` (via ${source})` : "";
      const subject = listingAddress
        ? `New Inquiry — ${listingAddress}${sourceLabel}`
        : `New ${type ?? "General"} Inquiry from ${name}${sourceLabel}`;

      await resend.emails.send({
        from: "inquiries@manojchaudhary.ca",
        to: process.env.NEXT_PUBLIC_AGENT_EMAIL ?? "realtormanoj9@gmail.com",
        replyTo: email,
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1a1a1a; padding: 24px 32px;">
              <h2 style="color: #C9A84C; margin: 0; font-size: 20px;">New Inquiry</h2>
              <p style="color: #ffffff; margin: 4px 0 0; font-size: 13px; opacity: 0.7;">Manoj Chaudhary Real Estate</p>
            </div>
            <div style="padding: 32px; background: #ffffff; border: 1px solid #e5e7eb;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px; width: 120px;">Name</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${name ?? "—"}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Email</td><td style="padding: 8px 0; font-weight: 600; color: #111827;"><a href="mailto:${email}" style="color: #C9A84C;">${email ?? "—"}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Phone</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${phone ?? "—"}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Type</td><td style="padding: 8px 0; font-weight: 600; color: #111827; text-transform: capitalize;">${type ?? "General"}</td></tr>
                ${source ? `<tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Source</td><td style="padding: 8px 0; font-weight: 600; color: #111827; text-transform: capitalize;">${source}</td></tr>` : ""}
                ${listingAddress ? `<tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Listing</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${listingAddress}</td></tr>` : ""}
              </table>
              <div style="margin-top: 24px; padding: 16px; background: #f9fafb; border-radius: 8px; border-left: 3px solid #C9A84C;">
                <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6;">${message ?? "No message provided."}</p>
              </div>
            </div>
            <div style="padding: 16px 32px; background: #f9fafb; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">Sent from manojchaudhary.ca contact form</p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json(inquiry, { status: 201 });
  } catch (err) {
    console.error("Inquiry error:", err);
    return NextResponse.json({ error: "Failed to send inquiry" }, { status: 500 });
  }
}
