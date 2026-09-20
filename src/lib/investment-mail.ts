import { contact } from "@/content/project";
import type { InterestInput } from "./investment-interest";

/**
 * Server-only: sends the "register your interest" submission to ATEL's inbox
 * through Resend's REST API. Plain `fetch` — no SDK, so no new dependency
 * (CLAUDE.md). The provider is confined to this one file: swapping Resend for
 * SendGrid or similar means rewriting `sendInterestEmail` only.
 *
 * Configuration (environment variables — see .env.example). Until BOTH are
 * set, `getMailConfig()` returns null and the whole feature reports itself as
 * not switched on: the page renders the form disabled, and the API route
 * answers 503, rather than pretending to send.
 *
 *   RESEND_API_KEY       the Resend API key
 *   INVESTMENT_MAIL_FROM a sender Resend has verified for the domain, e.g.
 *                        "A.T. Expressway Website <no-reply@atexpressway.com>"
 *
 * The recipient is `contact.email` (content/project.ts) — one source for the
 * address, not a second copy in an env var.
 */

export interface MailConfig {
  readonly apiKey: string;
  readonly from: string;
  readonly to: string;
}

export function getMailConfig(): MailConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.INVESTMENT_MAIL_FROM?.trim();
  const to = typeof contact.email === "string" ? contact.email : null;
  if (!apiKey || !from || !to) return null;
  return { apiKey, from, to };
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type SendResult = { readonly ok: true } | { readonly ok: false; readonly status: number };

export async function sendInterestEmail(input: InterestInput, config: MailConfig): Promise<SendResult> {
  const lines = [
    "Someone registered interest in receiving project and investment information via the website (/investment).",
    "",
    `Name:         ${input.name}`,
    `Email:        ${input.email}`,
    `Organisation: ${input.organisation || "—"}`,
    "",
    "Message:",
    input.message || "—",
    "",
    "They confirmed they would like to receive project and investment information at this address.",
    `Submitted: ${new Date().toISOString()}`,
  ];

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        // Replying to the notification goes to the person, not to no-reply@.
        reply_to: input.email,
        // Single-line by construction: parseInterest strips control characters.
        subject: `Investment interest registered — ${input.name}`,
        // Plain text only: nothing the visitor typed is ever interpreted as HTML.
        text: lines.join("\n"),
      }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    return response.ok ? { ok: true } : { ok: false, status: response.status };
  } catch {
    // Network failure or timeout.
    return { ok: false, status: 0 };
  }
}
