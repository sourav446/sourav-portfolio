import { google, type GoogleLanguageModelOptions } from "@ai-sdk/google";
import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from "ai";
import { z } from "zod";
import { SYSTEM_PROMPT } from "@/lib/assistant";
import { profile } from "@/lib/content";
import { callbackLimited, sendCallbackEmail } from "@/lib/callback";

// Chat endpoint for the portfolio assistant (Gemini via the Vercel AI SDK).
// The API key stays on the server: GOOGLE_GENERATIVE_AI_API_KEY (Google AI Studio).

const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash"; // 2.5 Flash is closed to new users
const MAX_MESSAGES = 10; // history sent to the model
const MAX_CHARS = 500; // per visitor message
const RESTING = `The assistant is resting right now — please email me at ${profile.email} or check the résumé.`;

/*
 * Per-visitor rate limit, kept in this server instance's memory. On Vercel each instance has its
 * own counter, so this is a soft guard; Google's free-tier quota is the hard ceiling behind it.
 */
const WINDOW_MS = 60_000;
const PER_MINUTE = 8;
const PER_DAY = 60;
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 86_400_000);
  const lastMinute = recent.filter((t) => now - t < WINDOW_MS).length;
  if (lastMinute >= PER_MINUTE || recent.length >= PER_DAY) return true;
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return false;
}
const textOf = (m: UIMessage) =>
  m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");

export async function POST(req: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json({ error: RESTING }, { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return Response.json(
      { error: "You're asking quickly! Please wait a minute and try again." },
      { status: 429 },
    );
  }

  let messages: UIMessage[];
  try {
    ({ messages } = (await req.json()) as { messages: UIMessage[] });
    if (!Array.isArray(messages) || messages.length === 0) throw new Error("no messages");
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Only text from the visitor and the assistant, the latest few turns, each one capped.
  const trimmed = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-MAX_MESSAGES)
    .map((m) => ({ ...m, parts: [{ type: "text" as const, text: textOf(m).slice(0, MAX_CHARS * 4) }] }));
  const last = trimmed[trimmed.length - 1];
  if (!last || last.role !== "user" || !textOf(last).trim()) {
    return Response.json({ error: "Please type a question." }, { status: 400 });
  }
  if (textOf(last).length > MAX_CHARS) {
    return Response.json({ error: `Please keep questions under ${MAX_CHARS} characters.` }, { status: 400 });
  }

  const result = streamText({
    model: google(MODEL),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(trimmed),
    // Tool: the model can email Sourav a recruiter's callback request (after confirming details).
    tools: {
      requestCallback: tool({
        description:
          "Email Sourav a recruiter's request to talk. Only call this after the visitor has given their name, company and email, and has confirmed the details.",
        inputSchema: z.object({
          name: z.string().min(1).max(100).describe("Recruiter's full name"),
          company: z.string().min(1).max(120).describe("Company or agency name"),
          email: z.string().email().max(200).describe("Recruiter's email address"),
          phone: z.string().max(40).optional().describe("Recruiter's phone number, if given"),
          role: z.string().max(150).optional().describe("Role they are hiring for"),
          preferredTime: z.string().max(120).optional().describe("When they prefer to be contacted"),
          message: z.string().max(600).optional().describe("Anything else they want Sourav to know"),
        }),
        execute: async (details) => {
          if (callbackLimited(ip)) return { ok: false, error: "Too many requests today from this visitor." };
          return sendCallbackEmail(details);
        },
      }),
    },
    stopWhen: stepCountIs(3), // tool call → tool result → the model's reply
    // Gemini 3.x models think before answering, and thinking tokens count toward this budget —
    // keep thinking light (simple Q&A) and leave plenty of room so replies are never cut off.
    maxOutputTokens: 2000,
    providerOptions: {
      google: { thinkingConfig: { thinkingLevel: "low" } } satisfies GoogleLanguageModelOptions,
    },
    temperature: 0.3,
    onError: ({ error }) => console.error("[chat] Gemini error:", error),
  });

  return result.toUIMessageStreamResponse({
    // Shown to the visitor instead of raw provider errors (quota, outages, …).
    onError: () => RESTING,
  });
}
