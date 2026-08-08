import { contact } from "@/content/project";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { ViewportReveal } from "@/components/motion/viewport-reveal";

const DIRECT_FIELDS = [
  { label: "Email", value: contact.email },
  { label: "Phone", value: contact.phone },
  { label: "Address", value: contact.address },
] as const;

const SOCIAL_FIELDS = [
  { label: "Twitter / X", value: contact.social.twitter },
  { label: "Facebook", value: contact.social.facebook },
  { label: "Instagram", value: contact.social.instagram },
  { label: "LinkedIn", value: contact.social.linkedin },
] as const;

/** Nearly everything here is a placeholder today — each field renders its own TBC state. */
export function ContactDetails() {
  return (
    <section className="border-b border-hairline">
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16 sm:px-8">
        <h2 className="text-heading-4 text-fg">Contact details</h2>

        <div className="flex flex-col divide-y divide-hairline border-t border-b border-hairline">
          {DIRECT_FIELDS.map((field) => (
            <div
              key={field.label}
              className="flex flex-col gap-2 py-4 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <span className="text-caption text-fg-faint tracking-wide uppercase">{field.label}</span>
              <PlaceholderNotice value={field.value}>
                {(value) => <span className="text-body text-fg">{value}</span>}
              </PlaceholderNotice>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-caption text-fg-faint tracking-wide uppercase">Social</span>
          <div className="flex flex-col divide-y divide-hairline border-t border-b border-hairline">
            {SOCIAL_FIELDS.map((field) => (
              <div
                key={field.label}
                className="flex flex-col gap-2 py-4 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <span className="text-small text-fg-muted">{field.label}</span>
                <PlaceholderNotice value={field.value}>
                  {(value) => <span className="text-body text-fg">{value}</span>}
                </PlaceholderNotice>
              </div>
            ))}
          </div>
        </div>
      </ViewportReveal>
    </section>
  );
}
