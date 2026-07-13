import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import type { Placeholder } from "@/content/placeholder";

interface PlaceholderStateDemoProps {
  readonly realLabel: string;
  readonly realValue: string;
  readonly realPath: string;
  readonly unresolvedValue: string | Placeholder<string>;
  readonly unresolvedPath: string;
}

export function PlaceholderStateDemo({
  realLabel,
  realValue,
  realPath,
  unresolvedValue,
  unresolvedPath,
}: PlaceholderStateDemoProps) {
  return (
    <div className="grid grid-cols-1 gap-px bg-rule sm:grid-cols-2">
      <div className="flex flex-col gap-2 bg-void p-6">
        <span className="text-caption text-ink-3 uppercase tracking-wide">{realLabel}</span>
        <span className="text-body text-ink-1">{realValue}</span>
        <span className="figure text-caption text-ink-3">{realPath}</span>
      </div>
      <div className="flex flex-col gap-2 bg-void p-6">
        <span className="text-caption text-ink-3 uppercase tracking-wide">Unresolved</span>
        <PlaceholderNotice value={unresolvedValue}>
          {(value) => <span className="text-body text-ink-1">{value}</span>}
        </PlaceholderNotice>
        <span className="figure text-caption text-ink-3">{unresolvedPath}</span>
      </div>
    </div>
  );
}
