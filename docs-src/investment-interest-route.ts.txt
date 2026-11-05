import { NextResponse } from "next/server";
import { LIMITS, parseInterest } from "@/lib/investment-interest";
import { getMailConfig, sendInterestEmail } from "@/lib/investment-mail";

/**
 * POST /api/investment-interest — the Investment Info "register your
 * interest" form. Emails the submission to ATEL (see lib/investment-mail.ts).
 *
 * This handler answers with success ONLY after the mail provider has accepted
 * the message; it never reports success it hasn't achieved. With no mail
 * configuration it answers 503 "not_configured" and does nothing else.
 *
 * Every field is validated here, server-side, whatever the browser did. Spam
 * protection is deliberately basic: a honeypot field, a minimum fill time,
 * same-origin only, a body-size cap, and a best-effort per-IP rate limit.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 5;

/**
 * Per-IP request times, in memory. BEST-EFFORT ONLY: on a serverless host each
 * instance has its own map and instances are recycled, so this slows a
 * determined sender down rather than stopping them — real limiting would need
 * shared storage (e.g. KV) or the host's WAF. Enough to blunt a naive loop.
 */
const recentRequests = new Map<string, number[]>();

function rateLimited(ip: string, now: number): boolean {
  const recent = (recentRequests.get(ip) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX_REQUESTS) {
    recentRequests.set(ip, recent);
    return true;
  }
  recent.push(now);
  recentRequests.set(ip, recent);
  // Keep the map from growing without bound.
  if (recentRequests.size > 1000) {
    for (const [key, times] of recentRequests) {
      if (times.every((time) => now - time >= RATE_WINDOW_MS)) recentRequests.delete(key);
    }
  }
  return false;
}

function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/** A browser form post from our own pages carries an Origin whose host is ours. */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function reply(status: number, body: Record<string, unknown>) {
  return NextResponse.json({ ok: status === 200, ...body }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return reply(403, { error: "forbidden" });

  const config = getMailConfig();
  if (!config) return reply(503, { error: "not_configured" });

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return reply(415, { error: "unsupported_media_type" });
  }

  if (rateLimited(clientIp(request), Date.now())) return reply(429, { error: "rate_limited" });

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > LIMITS.maxBodyBytes) return reply(413, { error: "too_large" });
  const text = await request.text();
  if (text.length > LIMITS.maxBodyBytes) return reply(413, { error: "too_large" });

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return reply(400, { error: "invalid_json" });
  }
  const body = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;

  // Honeypot: a human never sees or fills this field. Answer as if it worked
  // so a bot learns nothing — nothing is sent, and no person is affected.
  if (typeof body.website === "string" && body.website.trim() !== "") return reply(200, {});

  if (typeof body.elapsedMs !== "number" || body.elapsedMs < LIMITS.minElapsedMs) {
    return reply(400, { error: "too_fast" });
  }

  const parsed = parseInterest(body);
  if (!parsed.ok) return reply(400, { error: "invalid", fieldErrors: parsed.errors });

  const sent = await sendInterestEmail(parsed.value, config);
  if (!sent.ok) {
    // Log the upstream status only — never the submission or the API key.
    console.error(`[investment-interest] mail provider rejected the request (status ${sent.status})`);
    return reply(502, { error: "send_failed" });
  }

  return reply(200, {});
}

/** Anything other than POST is refused explicitly. */
export function GET() {
  return reply(405, { error: "method_not_allowed" });
}
