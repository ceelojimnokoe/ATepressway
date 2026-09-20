import { investmentForm } from "@/content/investment";

/**
 * Validation for the Investment Info "register your interest" form. Pure and
 * isomorphic: the API route runs it as the AUTHORITY (nothing the browser
 * claims is trusted), and the form runs the same function only to show
 * errors instantly without a round trip.
 */

export const LIMITS = {
  name: 100,
  email: 254,
  organisation: 150,
  message: 2000,
  /** A human cannot complete the form faster than this; a script often does. */
  minElapsedMs: 2000,
  /** Hard cap on the request body, well above the field limits combined. */
  maxBodyBytes: 10_000,
} as const;

export interface InterestInput {
  readonly name: string;
  readonly email: string;
  readonly organisation: string;
  readonly message: string;
  readonly consent: boolean;
}

export type FieldErrors = Partial<Record<keyof InterestInput, string>>;

export type ParseResult =
  | { readonly ok: true; readonly value: InterestInput }
  | { readonly ok: false; readonly errors: FieldErrors };

// Deliberately plain: one "@", something either side, a dot in the domain, no
// whitespace. Real address validation is the mail provider's job.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// C0 controls (incl. CR/LF, which have no place in a header-ish value) and DEL.
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g;

/** Single-line value: control characters (including newlines) become spaces, runs of whitespace collapse. */
function cleanLine(value: unknown): string {
  return typeof value === "string" ? value.replace(CONTROL_CHARS, " ").replace(/\s+/g, " ").trim() : "";
}

/** Multi-line value: keep newlines and tabs, drop every other control character. */
function cleanText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim();
}

export function parseInterest(raw: unknown): ParseResult {
  const body = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const { errors: copy } = investmentForm;

  const name = cleanLine(body.name);
  const email = cleanLine(body.email);
  const organisation = cleanLine(body.organisation);
  const message = cleanText(body.message);
  const consent = body.consent === true;

  const errors: FieldErrors = {};
  if (!name) errors.name = copy.nameRequired;
  else if (name.length > LIMITS.name) errors.name = copy.nameTooLong;

  if (!email) errors.email = copy.emailRequired;
  else if (email.length > LIMITS.email || !EMAIL_PATTERN.test(email)) errors.email = copy.emailInvalid;

  if (organisation.length > LIMITS.organisation) errors.organisation = copy.organisationTooLong;
  if (message.length > LIMITS.message) errors.message = copy.messageTooLong;
  if (!consent) errors.consent = copy.consentRequired;

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { name, email, organisation, message, consent } };
}
