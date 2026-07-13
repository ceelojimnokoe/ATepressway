/**
 * Enquiry form configuration — structural, not a project fact, but still
 * lives here rather than hardcoded in the form component, so a category
 * can be renamed or added without touching a component.
 */

export interface EnquiryType {
  readonly value: string;
  readonly label: string;
}

export const enquiryTypes: readonly EnquiryType[] = [
  { value: "general", label: "General" },
  { value: "safety", label: "Report a road or safety concern" },
  { value: "media", label: "Media & press" },
  { value: "business", label: "Business & contractor" },
] as const;
