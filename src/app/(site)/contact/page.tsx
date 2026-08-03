import type { Metadata } from "next";
import { ContactDetails } from "@/components/contact/contact-details";
import { EnquirySection } from "@/components/contact/enquiry-section";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.contact);

export default function ContactPage() {
  return (
    <>
      <PageHero
        media="atelOverpassDeck"
        title="Contact"
        subtitle="Questions about the corridor, your route, or the works — and how to reach the project team."
      />

      <ContactDetails />
      <EnquirySection />
    </>
  );
}
