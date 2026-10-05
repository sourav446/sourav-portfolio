import { NextResponse } from "next/server";
import { Resend } from "resend";

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot — hidden from people, so only bots fill it. */
  company?: string;
};

const LIMITS = { name: 100, email: 200, subject: 150, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validatePayload(payload: Partial<ContactPayload>) {
  if (!payload.name?.trim()) return "Name is required.";
  if (!payload.email?.trim()) return "Email is required.";
  if (!EMAIL_RE.test(payload.email.trim())) return "Please enter a valid email address.";
  if (!payload.subject?.trim()) return "Subject is required.";
  if (!payload.message?.trim()) return "Message is required.";
  for (const key of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    if (String(payload[key]).length > LIMITS[key]) {
      return `${key[0].toUpperCase() + key.slice(1)} is too long.`;
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as Partial<ContactPayload>;

    // Bots fill the hidden field; pretend success so they don't retry.
    if (payload.company) return NextResponse.json({ ok: true });

    const invalid = validatePayload(payload);
    if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

    const name = payload.name!.trim();
    const email = payload.email!.trim();
    const subject = payload.subject!.trim();
    const message = payload.message!.trim();

    if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) {
      return NextResponse.json(
        { error: "Email service is not configured yet — please email me directly." },
        { status: 500 },
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const safe = {
      name: escapeHtml(String(name)),
      email: escapeHtml(String(email)),
      subject: escapeHtml(String(subject)),
      message: escapeHtml(String(message)),
    };

    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL,
      // Hitting Reply in your inbox answers the visitor directly.
      replyTo: email,
      subject: `New Portfolio Inquiry – ${subject}`,
      text: `New portfolio message from ${name} (${email})\n\nSubject: ${subject}\n\n${message}`,
      html: `
  <div style="background-color:#f6f8fb; padding:40px 20px; font-family:Arial, Helvetica, sans-serif;">
    <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:8px; padding:32px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
      
      <h2 style="margin:0 0 24px 0; font-size:20px; color:#111827;">
        New Portfolio Inquiry
      </h2>

      <table style="width:100%; border-collapse:collapse; font-size:14px;">
        <tr>
          <td style="padding:8px 0; color:#6b7280;">Name</td>
          <td style="padding:8px 0; font-weight:600; color:#111827;">${safe.name}</td>
        </tr>
        <tr>
          <td style="padding:8px 0; color:#6b7280;">Email</td>
          <td style="padding:8px 0;">
            <a href="mailto:${safe.email}" style="color:#2563eb; text-decoration:none;">
              ${safe.email}
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0; color:#6b7280;">Subject</td>
          <td style="padding:8px 0; font-weight:500; color:#111827;">${safe.subject}</td>
        </tr>
      </table>

      <div style="margin:24px 0; border-top:1px solid #e5e7eb;"></div>

      <p style="margin:0 0 8px 0; font-size:14px; color:#6b7280;">Message</p>

      <div style="background:#f9fafb; padding:16px; border-radius:6px; font-size:14px; color:#111827; line-height:1.6; white-space:pre-wrap;">${safe.message}</div>

      <div style="margin:32px 0 0 0; border-top:1px solid #e5e7eb;"></div>

      <p style="margin:16px 0 0 0; font-size:12px; color:#9ca3af;">
        This message was submitted via your portfolio contact form.
      </p>

      <p style="margin:4px 0 0 0; font-size:12px; color:#9ca3af;">
        © ${new Date().getFullYear()} Sourav Gokul V
      </p>

    </div>
  </div>
  `,
    });

    if (error) {
      console.error("Resend send failed:", error);
      return NextResponse.json(
        { error: "Unable to send your message right now." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form failed:", error);
    return NextResponse.json(
      { error: "Unable to send your message right now." },
      { status: 500 },
    );
  }
}
