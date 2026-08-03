import { ViewportReveal } from "@/components/motion/viewport-reveal";
import { EnquiryForm } from "./enquiry-form";
import { CorridorMap } from "./corridor-map";

/**
 * Two columns: the enquiry form and the corridor map (which shows the
 * project location, not an office). Stacks to a single column on small
 * screens. The form itself is the only client leaf here — this wrapper
 * stays server.
 */
export function EnquirySection() {
  return (
    <section>
      <ViewportReveal className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-10">
          <div className="flex flex-col gap-8">
            <h2 className="text-heading-4 text-fg">Send an enquiry</h2>
            <EnquiryForm />
          </div>
          <CorridorMap />
        </div>
      </ViewportReveal>
    </section>
  );
}
