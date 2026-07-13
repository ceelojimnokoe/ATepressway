"use client";

import type { FormEvent } from "react";
import { enquiryTypes } from "@/content/contact-form";

const fieldClassName = "border border-rule bg-raised px-4 py-3 text-body text-ink-1 focus:border-ink-2 focus:outline-none";
const labelClassName = "text-small text-ink-2";

/**
 * No backend exists yet. The submit button is genuinely disabled (not
 * just styled to look inert) and the note explaining why is always
 * visible, not revealed only on a failed attempt. onSubmit still calls
 * preventDefault() as a second guarantee — e.g. Enter-to-submit from a
 * text field — so there is no path, including edge cases, that could
 * produce a fake success state. Fields stay enabled so a visitor can see
 * the real shape of the form.
 */
export function EnquiryForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className={labelClassName}>
          Name
        </label>
        <input id="name" name="name" type="text" autoComplete="name" required className={fieldClassName} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={labelClassName}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={fieldClassName}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="enquiryType" className={labelClassName}>
          Enquiry type
        </label>
        <select id="enquiryType" name="enquiryType" required className={fieldClassName}>
          {enquiryTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelClassName}>
          Message
        </label>
        <textarea id="message" name="message" required rows={5} className={fieldClassName} />
      </div>

      <div className="flex flex-col items-start gap-3">
        <button
          type="submit"
          disabled
          aria-disabled="true"
          className="w-fit cursor-not-allowed border border-rule bg-raised px-6 py-3 text-body text-ink-3"
        >
          Send enquiry
        </button>
        <p className="text-small text-ink-2">
          This form isn&rsquo;t connected to a submission endpoint yet — nothing entered here is sent
          or saved.
        </p>
      </div>
    </form>
  );
}
