"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { investmentForm } from "@/content/investment";
import { contact } from "@/content/project";
import { parseInterest, type FieldErrors } from "@/lib/investment-interest";

const fieldClassName =
  "border border-hairline bg-surface-raised px-4 py-3 text-body text-fg focus:border-fg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:bg-surface-sunk disabled:text-fg-faint";
const labelClassName = "text-small text-fg-muted";
const errorClassName = "text-small text-accent";

type Status = "idle" | "submitting" | "success" | "error";

const contactEmail = typeof contact.email === "string" ? contact.email : "";

/**
 * "Register your interest" form (Investment Info).
 *
 * Honest about its state, in this order of precedence:
 *   1. `enabled` false (no mail configuration on the server at build/render
 *      time) → the whole form is disabled and says so, exactly like the
 *      newsletter sign-up. Nothing is submitted; there is no code path from
 *      here to a success message.
 *   2. The server answers 503 "not_configured" (configuration changed since
 *      the page was built) → the form switches into that same disabled state.
 *   3. Otherwise it posts to /api/investment-interest and shows success ONLY
 *      when the server confirms the mail provider accepted the message. Any
 *      failure is shown as a failure.
 *
 * Copy lives in content/investment.ts (provisional, pending client sign-off).
 */
export function InvestmentInterestForm({ enabled }: { readonly enabled: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [serverDisabled, setServerDisabled] = useState(false);
  const mountedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);

  // Time since the form appeared — sent so the server can reject a submission
  // no human could have completed (basic bot check).
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const disabled = !enabled || serverDisabled;
  const copy = investmentForm;

  function focusFirstInvalid(errors: FieldErrors) {
    const order: (keyof FieldErrors)[] = ["name", "email", "organisation", "message", "consent"];
    const first = order.find((key) => errors[key]);
    const element = first ? formRef.current?.elements.namedItem(first) : null;
    if (element instanceof HTMLElement) element.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Belt and braces: a disabled form must never submit, even via Enter.
    if (disabled || status === "submitting") return;

    const data = new FormData(event.currentTarget);
    const values = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      organisation: String(data.get("organisation") ?? ""),
      message: String(data.get("message") ?? ""),
      consent: data.get("consent") === "on",
    };

    // Same validator the server runs — instant feedback, not the authority.
    const checked = parseInterest(values);
    if (!checked.ok) {
      setFieldErrors(checked.errors);
      setFormError(null);
      focusFirstInvalid(checked.errors);
      return;
    }

    setFieldErrors({});
    setFormError(null);
    setStatus("submitting");

    try {
      const response = await fetch("/api/investment-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: String(data.get("website") ?? ""),
          elapsedMs: Date.now() - mountedAt.current,
        }),
      });
      const result = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: FieldErrors;
      } | null;

      if (response.ok && result?.ok === true) {
        setStatus("success");
        return;
      }

      if (result?.error === "not_configured") {
        setServerDisabled(true);
        setStatus("idle");
        return;
      }
      if (result?.error === "invalid" && result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
        setStatus("error");
        focusFirstInvalid(result.fieldErrors);
        return;
      }

      setStatus("error");
      setFormError(
        result?.error === "too_fast"
          ? copy.errors.tooFast
          : result?.error === "rate_limited"
            ? copy.errors.rateLimited
            : result?.error === "send_failed"
              ? copy.errors.sendFailed.replace("{email}", contactEmail)
              : copy.errors.generic,
      );
    } catch {
      setStatus("error");
      setFormError(copy.errors.sendFailed.replace("{email}", contactEmail));
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col gap-2 border border-hairline bg-surface p-6">
        <p className="text-body text-fg">{copy.success}</p>
      </div>
    );
  }

  const describedBy = (key: keyof FieldErrors, extra?: string) =>
    [fieldErrors[key] ? `${key}-error` : null, extra].filter(Boolean).join(" ") || undefined;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <fieldset disabled={disabled} className="flex flex-col gap-6 disabled:opacity-70">
        <legend className="sr-only">{copy.heading}</legend>

        <div className="flex flex-col gap-2">
          <label htmlFor="interest-name" className={labelClassName}>
            {copy.fields.name.label}
          </label>
          <input
            id="interest-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={describedBy("name")}
            className={fieldClassName}
          />
          {fieldErrors.name && (
            <p id="name-error" className={errorClassName}>
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="interest-email" className={labelClassName}>
            {copy.fields.email.label}
          </label>
          <input
            id="interest-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={describedBy("email")}
            className={fieldClassName}
          />
          {fieldErrors.email && (
            <p id="email-error" className={errorClassName}>
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="interest-organisation" className={labelClassName}>
            {copy.fields.organisation.label}{" "}
            <span className="text-fg-faint">{copy.fields.organisation.optional}</span>
          </label>
          <input
            id="interest-organisation"
            name="organisation"
            type="text"
            autoComplete="organization"
            maxLength={150}
            aria-invalid={fieldErrors.organisation ? true : undefined}
            aria-describedby={describedBy("organisation")}
            className={fieldClassName}
          />
          {fieldErrors.organisation && (
            <p id="organisation-error" className={errorClassName}>
              {fieldErrors.organisation}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="interest-message" className={labelClassName}>
            {copy.fields.message.label}{" "}
            <span className="text-fg-faint">{copy.fields.message.optional}</span>
          </label>
          <textarea
            id="interest-message"
            name="message"
            rows={5}
            maxLength={2000}
            aria-invalid={fieldErrors.message ? true : undefined}
            aria-describedby={describedBy("message", "message-hint")}
            className={fieldClassName}
          />
          <p id="message-hint" className="text-caption text-fg-faint">
            {copy.fields.message.hint}
          </p>
          {fieldErrors.message && (
            <p id="message-error" className={errorClassName}>
              {fieldErrors.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex items-start gap-3 text-small text-fg-muted">
            <input
              name="consent"
              type="checkbox"
              required
              aria-invalid={fieldErrors.consent ? true : undefined}
              aria-describedby={describedBy("consent")}
              className="mt-1 h-4 w-4 shrink-0 accent-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
            <span>{copy.fields.consent.label}</span>
          </label>
          {fieldErrors.consent && (
            <p id="consent-error" className={errorClassName}>
              {fieldErrors.consent}
            </p>
          )}
        </div>

        {/* Honeypot. A person never sees, reaches (tabIndex -1) or announces
            (aria-hidden) this; a script that fills every field will fill it,
            and the server then silently discards the submission. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>
      </fieldset>

      <div className="flex flex-col items-start gap-3">
        <button
          type="submit"
          disabled={disabled || status === "submitting"}
          aria-disabled={disabled || status === "submitting"}
          className={
            disabled
              ? "inline-flex w-fit cursor-not-allowed items-center gap-3 border border-hairline bg-transparent px-6 py-3 text-small tracking-wide text-fg-faint uppercase"
              : "inline-flex w-fit items-center gap-3 border border-accent bg-lime px-6 py-3 text-small tracking-wide text-void uppercase transition-colors duration-200 ease-out hover:bg-transparent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-70"
          }
        >
          {status === "submitting" ? copy.submitting : copy.submit}
          {disabled && (
            <span className="border border-hairline px-2 py-0.5 text-caption">{copy.comingSoonTag}</span>
          )}
        </button>

        {disabled && <p className="text-small text-fg-muted">{copy.disabledNote}</p>}

        {formError && (
          <p role="alert" className={errorClassName}>
            {formError}
          </p>
        )}
      </div>
    </form>
  );
}
