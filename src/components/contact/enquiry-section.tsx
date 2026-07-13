import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { EnquiryForm } from "./enquiry-form";

/** The form itself is the only client leaf here — this wrapper stays server. */
export function EnquirySection() {
  return (
    <section>
      <ViewportReveal className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-8">
        <h2 className="text-heading-4 text-ink-1">Send an enquiry</h2>
        <EnquiryForm />
      </ViewportReveal>
    </section>
  );
}
