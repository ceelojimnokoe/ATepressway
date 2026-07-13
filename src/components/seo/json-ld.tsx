interface JsonLdProps {
  readonly data: object;
}

/**
 * The one place JSON.stringify output goes into dangerouslySetInnerHTML
 * sitewide. Escaping "<" defends against a real, known issue: an
 * unescaped "</script>" inside a stringified value could terminate the
 * script tag early and get interpreted as HTML. Content here is our own
 * trusted data, not user input, but the escape is cheap and this is
 * exactly the kind of thing that should never depend on that staying true.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
