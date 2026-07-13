import type { Metadata } from "next";
import { ContactDetails } from "@/components/contact/contact-details";
import { EnquirySection } from "@/components/contact/enquiry-section";
import { buildMetadata } from "@/lib/page-metadata";
import { routes } from "@/content/seo";

export const metadata: Metadata = buildMetadata(routes.contact);

export default function ContactPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-5xl px-4 pt-16 sm:px-8">
        <h1 className="text-heading-1 text-ink-1">Contact</h1>
      </div>

      <ContactDetails />
      <EnquirySection />
    </>
  );
}
