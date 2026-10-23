import { sendMail, type MailResult } from "@/lib/mailer";

/** What the assistant collects from a recruiter who wants Sourav to get in touch. */
export type CallbackRequest = {
  name: string;
  company: string;
  email: string;
  phone?: string;
  role?: string;
  preferredTime?: string;
  message?: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/*
 * Callback requests per visitor per day, kept in this server instance's memory — enough to stop
 * one visitor from flooding the inbox through the chat.
 */
const PER_DAY = 3;
const sent = new Map<string, number[]>();
export function callbackLimited(ip: string) {
  const now = Date.now();
  const recent = (sent.get(ip) ?? []).filter((t) => now - t < 86_400_000);
  if (recent.length >= PER_DAY) return true;
  recent.push(now);
  sent.set(ip, recent);
  if (sent.size > 5000) sent.clear();
  return false;
}

/**
 * Emails Sourav the recruiter's details (Gmail via Nodemailer — see lib/mailer.ts).
 * Hitting Reply in the inbox answers the recruiter directly.
 */
export async function sendCallbackEmail(req: CallbackRequest): Promise<MailResult> {
  const rows: [string, string | undefined][] = [
    ["Name", req.name],
    ["Company", req.company],
    ["Email", req.email],
    ["Phone", req.phone],
    ["Role", req.role],
    ["Preferred time", req.preferredTime],
    ["Message", req.message],
  ];
  const filled = rows.filter(([, v]) => v && v.trim());

  return sendMail({
    replyTo: req.email,
    subject: `Callback request – ${req.name}${req.company ? ` (${req.company})` : ""}`,
    text: `A recruiter asked for a callback via the portfolio AI assistant.\n\n${filled
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n")}`,
    html: `
  <div style="background:#f6f8fb;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:28px;">
      <h2 style="margin:0 0 6px;font-size:19px;color:#111827;">📞 Callback request</h2>
      <p style="margin:0 0 20px;font-size:13px;color:#6b7280;">Sent by the AI assistant on your portfolio.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${filled
          .map(
            ([k, v]) => `<tr>
          <td style="padding:8px 0;color:#6b7280;width:130px;vertical-align:top;">${k}</td>
          <td style="padding:8px 0;color:#111827;font-weight:500;white-space:pre-wrap;">${escapeHtml(v!)}</td>
        </tr>`,
          )
          .join("")}
      </table>
      <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;">Reply to this email to answer ${escapeHtml(req.name)} directly.</p>
    </div>
  </div>`,
  });
}
