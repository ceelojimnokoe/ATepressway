"use client";

interface ReplayButtonProps {
  readonly onClick: () => void;
  readonly label?: string;
}

export function ReplayButton({ onClick, label = "Replay" }: ReplayButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-fit border border-rule px-3 py-1.5 text-caption text-ink-2 uppercase tracking-wide hover:text-lime focus-visible:text-lime focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime"
    >
      {label}
    </button>
  );
}
