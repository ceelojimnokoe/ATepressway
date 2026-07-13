import type { ReactNode } from "react";

interface SectionProps {
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
}

export function Section({ title, description, children }: SectionProps) {
  return (
    <section className="flex flex-col gap-6 border-t border-rule py-12 first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-1">
        <h2 className="text-heading-4 text-ink-1">{title}</h2>
        {description ? <p className="text-small text-ink-2">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
