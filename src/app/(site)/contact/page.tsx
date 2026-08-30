import type { Metadata } from "next";
import { ContactDetails } from "@/components/contact/contact-details";
import { EnquirySection } from "@/components/contact/enquiry-section";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.contact);

export default function ContactPage() {
  return (
    <>
      <PageHero
        media="atelOverpassDeck"
        scrimIntensity="light"
        title="Contact"
        subtitle="Questions about the corridor, your route, or the works — and how to reach the concession."
      />

      {/* Discoverable callout so suggestions/complaints aren't buried in the
          form's dropdown. */}
      <div className="border-b border-hairline bg-surface-raised">
        <Reveal className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-8">
          <p className="border-l-2 border-accent pl-4 text-small text-fg">
            Have a suggestion or a concern? Use the form below and select{" "}
            <span className="font-medium">“Suggestion or complaint.”</span>
          </p>
        </Reveal>
      </div>

      <ContactDetails />
      <EnquirySection />
    </>
  );
}
