import { NextResponse } from "next/server";
import { Resend } from "resend";

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function validatePayload(payload: Partial<ContactPayload>) {
  if (!payload.name?.trim()) return "Name is required.";
  if (!payload.email?.trim()) return "Email is required.";
  if (!payload.subject?.trim()) return "Subject is required.";
  if (!payload.message?.trim()) return "Message is required.";
  return null;
}

const resend = new Resend(process.env.RESEND_API_KEY);
console.log("Loaded Key:", process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.CONTACT_TO_EMAIL!,
      subject: `New Portfolio Inquiry – ${subject}`,
      text: `New portfolio message from ${name} (${email})`,
      html: `
  <div style="background-color:#f6f8fb; padding:40px 20px; font-family:Arial, Helvetica, sans-serif;">
    <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:8px; padding:32px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
      
      <h2 style="margin:0 0 24px 0; font-size:20px; color:#111827;">
        New Portfolio Inquiry
      </h2>

      <table style="width:100%; border-collapse:collapse; font-size:14px;">
        <tr>
          <td style="padding:8px 0; color:#6b7280;">Name</td>
          <td style="padding:8px 0; font-weight:600; color:#111827;">${name}</td>
        </tr>
        <tr>
          <td style="padding:8px 0; color:#6b7280;">Email</td>
          <td style="padding:8px 0;">
            <a href="mailto:${email}" style="color:#2563eb; text-decoration:none;">
              ${email}
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0; color:#6b7280;">Subject</td>
          <td style="padding:8px 0; font-weight:500; color:#111827;">${subject}</td>
        </tr>
      </table>

      <div style="margin:24px 0; border-top:1px solid #e5e7eb;"></div>

      <p style="margin:0 0 8px 0; font-size:14px; color:#6b7280;">Message</p>

      <div style="background:#f9fafb; padding:16px; border-radius:6px; font-size:14px; color:#111827; line-height:1.6;">
        ${message}
      </div>

      <div style="margin:32px 0 0 0; border-top:1px solid #e5e7eb;"></div>

      <p style="margin:16px 0 0 0; font-size:12px; color:#9ca3af;">
        This message was submitted via your portfolio contact form.
      </p>

      <p style="margin:4px 0 0 0; font-size:12px; color:#9ca3af;">
        © ${new Date().getFullYear()} Sourav Velusamy
      </p>

    </div>
  </div>
  `,
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Email failed", details: error.message },
      { status: 500 },
    );
  }
}
