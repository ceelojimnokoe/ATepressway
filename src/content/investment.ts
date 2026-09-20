/**
 * "Investment Info" page content (/investment) — PROVISIONAL, PENDING CLIENT
 * SIGN-OFF.
 *
 * ⚠ Everything in this file is a first draft, built 20 Sept 2026 from the
 * client's "ATEL Website Text Corrections -NEW.docx" (public/info/), from the
 * "Our Approach" heading downwards, so the client has something concrete to
 * react to. The client will supply FINAL APPROVED COPY at their next meeting;
 * when it arrives, replace the text below and change `status` to "approved".
 * While `status` is "pending-client-signoff":
 *   - the page shows a visible "draft" notice (see the page component),
 *   - the route is marked `draft: true` in content/seo.ts, which keeps it out
 *     of the sitemap and gives it `noindex` — so unapproved investment wording
 *     is not picked up by search engines.
 * Flipping `status` removes the notice; also delete `draft: true` on the route.
 *
 * How the source document was used:
 *   - From "Our Approach" down, the document holds TWO near-identical blocks
 *     (the About-Us block, then an "INVESTMENTS" block headed "Road
 *     Infrastructure Investment Opportunity / Investing in Ghana's Future").
 *     They are merged here into one page, not repeated.
 *   - The one substantive difference is the first highlight. The About-Us
 *     block says "Government-Backed Funding Support … initial funding support
 *     from Government"; the INVESTMENTS block says "Government-Backed Revenue
 *     Security … contractual revenue guarantees and initial funding support
 *     from Government". This page uses the INVESTMENTS wording (it is the
 *     investment-page text), but it is a much stronger claim and does NOT match
 *     the /about page, whose equivalent card is now "Significant Government
 *     Seed" (board-approved 7 Sept 2026). The client must reconcile the two.
 *   - "A.T. Expressway LTD" / "A.T. Expressway Limited" → "A.T. Expressway
 *     Ltd." (the single confirmed name form, CLAUDE.md); "Accra-Tema" →
 *     "Accra–Tema"; highlight titles → sentence case with a full stop after
 *     each body, matching the equivalent cards on /about. No wording was
 *     otherwise changed and none was added.
 *
 * ⚠ Claims the client (and, before publication, whoever reviews financial
 * promotions for them) should confirm — each is the client's own wording, not
 * ours, and none is verifiable from the MPR or the rest of the site:
 *   - "Stable Long-Term Returns" (tagline) and "predictable revenue streams",
 *     "robust growth potential", "competitive risk-adjusted returns",
 *     "reducing sovereign risk" — statements about returns and risk.
 *   - "contractual revenue guarantees" — a specific contractual claim.
 *   - "a premium opportunity to participate" / "By investing in ATEL, you
 *     secure a position in…" — invites investment in ATEL, yet the rest of the
 *     site says GIIF is currently ATEL's sole shareholder. What, if anything,
 *     is actually on offer (equity, debt, Phase 2?) is not stated anywhere.
 *   - "one of Africa's most politically stable and economically vibrant
 *     nations" — a comparative claim about the country.
 * CLAUDE.md's tone rule is "clinical and accountable, not promotional; claims
 * are verifiable" — several of these fall short of it as written.
 */

export type ContentStatus = "pending-client-signoff" | "approved";

export interface InvestmentHighlight {
  readonly title: string;
  readonly body: string;
}

export const investmentContent = {
  status: "pending-client-signoff" as ContentStatus,

  /** Shown on the page while status is pending. */
  draftNotice:
    "Draft wording. The text on this page is provisional and is awaiting the client’s approval; it will be replaced with approved copy.",

  hero: {
    title: "Investment Info",
    subtitle:
      "Background on the Accra–Tema Motorway & Extensions PPP Project for parties reviewing it as an investment opportunity.",
  },

  intro: {
    eyebrow: "Road infrastructure investment opportunity",
    heading: "Investing in Ghana’s Future: The Accra–Tema Motorway & Extensions PPP Project",
    tagline: "Strategic Investment Opportunity with Stable Long-Term Returns",
  },

  approach: {
    heading: "Our approach",
    /** The lead paragraph, set a step larger than the rest. */
    lead: "A.T. Expressway Ltd. (ATEL) is a strategic infrastructure investment vehicle established by the Ghana Infrastructure Investment Fund (GIIF) to deliver the Accra–Tema Motorway & Extensions PPP Project (ATMP).",
    paragraphs: [
      "ATEL presents a premium opportunity to participate in the transformative ATMP PPP Project. This sovereign-backed infrastructure development connects Ghana’s capital city with its industrial hub and largest port, creating an essential economic corridor with predictable revenue streams and robust growth potential.",
      "We are not only enhancing transportation networks but also building capacity within Ghana to execute similar projects independently in the future.",
      "This landmark project is a testament to Ghana’s commitment to modern, sustainable, and high-quality road infrastructure, ensuring seamless connectivity, economic growth, and enhanced trade across the West African region. With Ghanaian ownership at its core, ATEL is not just building roads — we are building local expertise, capacity, and opportunities.",
    ],
  },

  highlights: {
    heading: "Investment highlights",
    items: [
      {
        // INVESTMENTS-block wording — see the header note: this differs from
        // /about ("Significant Government Seed") and from the About-Us block of
        // the same document ("Government-Backed Funding Support: … initial
        // funding support from Government"). Client to reconcile.
        title: "Government-backed revenue security",
        body: "Structured as a public–private partnership with contractual revenue guarantees and initial funding support from Government.",
      },
      {
        title: "Inflation-protected returns",
        body: "Long-term concession agreement with built-in tariff adjustment mechanisms.",
      },
      {
        title: "Strategic economic asset",
        body: "Critical infrastructure connecting Ghana’s key commercial and industrial zones.",
      },
      {
        title: "Exponential growth corridor",
        body: "Serving a rapidly expanding urban population and trade environment.",
      },
      {
        title: "ESG-aligned development",
        body: "Incorporating sustainable design, local economic empowerment, and governance best practices.",
      },
      {
        title: "First-mover advantage",
        body: "Pioneering investment in West Africa’s fastest-growing infrastructure market.",
      },
    ] as readonly InvestmentHighlight[],
  },

  beyond: {
    heading: "Beyond infrastructure: a capacity-building investment",
    paragraphs: [
      "ATEL represents more than a traditional infrastructure play — it’s a comprehensive ecosystem investment that builds Ghanaian institutional capability while delivering competitive risk-adjusted returns. Our pioneering approach ensures that capital, expertise, and long-term value remain within Ghana’s economy, reducing sovereign risk while establishing the foundation for a pipeline of future infrastructure projects across the region.",
      "By investing in ATEL, you secure a position in Ghana’s most strategic transportation asset while contributing to sustainable development in one of Africa’s most politically stable and economically vibrant nations.",
    ],
  },
} as const;

/**
 * "Register your interest" form copy — ALSO PROVISIONAL. Written by us, not
 * taken from the client's document, and deliberately conservative: it frames
 * the form as a request to RECEIVE project and investment information, not as
 * an invitation to invest or any promise of returns, and it makes no claim
 * about how submissions are stored, retained or used beyond what the code
 * actually does (the details are emailed to the address in `contact.email`).
 * The client will want their own approved wording here, including any
 * data-protection / privacy statement — none is included yet.
 */
export const investmentForm = {
  heading: "Register your interest",
  intro:
    "To receive project and investment information from A.T. Expressway Ltd., leave your details below. This is a request for information only; it is not an offer or an invitation to invest.",

  fields: {
    name: { label: "Full name" },
    email: { label: "Email address" },
    organisation: { label: "Organisation", optional: "(optional)" },
    message: {
      label: "Message",
      optional: "(optional)",
      hint: "For example, the kind of information you are looking for.",
    },
    consent: {
      label:
        "I would like to receive project and investment information from A.T. Expressway Ltd. at this email address.",
    },
  },

  submit: "Register interest",
  submitting: "Sending…",
  comingSoonTag: "Coming soon",

  /** Shown while the form cannot actually send — never a fake success. */
  disabledNote:
    "Registering interest is not switched on yet — nothing entered here is sent or stored.",

  success: "Thank you — your request has been sent to A.T. Expressway Ltd.",

  /** Validation + failure messages. The API route returns these same strings. */
  errors: {
    nameRequired: "Enter your name.",
    nameTooLong: "Your name is too long.",
    emailRequired: "Enter your email address.",
    emailInvalid: "Enter a valid email address.",
    organisationTooLong: "The organisation name is too long.",
    messageTooLong: "The message is too long.",
    consentRequired: "Please confirm you would like to receive information.",
    tooFast: "That was very quick — please check your details and submit again.",
    rateLimited: "Too many requests from this connection. Please try again later.",
    /** `{email}` is replaced with the contact address at render time. */
    sendFailed:
      "Your request could not be sent. Please try again later, or email {email} directly.",
    generic: "Something went wrong. Please try again.",
  },
} as const;
