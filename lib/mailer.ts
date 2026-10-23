import nodemailer from "nodemailer";

/**
 * One place that sends the portfolio's emails (contact form + AI assistant callback requests),
 * from your Gmail via Nodemailer: GMAIL_USER + GMAIL_APP_PASSWORD (a Google "App password", not
 * your normal password). Emails go to CONTACT_TO_EMAIL (defaults to GMAIL_USER).
 */
export type Mail = {
  subject: string;
  text: string;
  html: string;
  /** Hitting Reply in the inbox answers this address (the visitor / recruiter). */
  replyTo?: string;
};

export type MailResult = { ok: true } | { ok: false; error: string };

let gmail: nodemailer.Transporter | null = null;
function gmailTransport() {
  gmail ??= nodemailer.createTransport({
    service: "gmail",
    // App passwords are shown as "abcd efgh ijkl mnop"; spaces are not part of the password.
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "") },
  });
  return gmail;
}

export function mailConfigured() {
  return !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

export async function sendMail(mail: Mail): Promise<MailResult> {
  if (!mailConfigured()) return { ok: false, error: "Email is not configured on the server." };

  try {
    await gmailTransport().sendMail({
      from: `"Portfolio" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_TO_EMAIL || process.env.GMAIL_USER,
      replyTo: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    return { ok: true };
  } catch (error) {
    console.error("[mail] Gmail send failed:", error);
    return { ok: false, error: "The email could not be sent." };
  }
}
