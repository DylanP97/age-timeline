import type { TimelineView } from "../hooks/useTimelineView";
import { CURRENT_YEAR } from "../lib/age";

interface Props {
  view: TimelineView;
}

/** Floating zoom + recenter cluster. Bottom-right on desktop, bottom on mobile. */
export function Controls({ view }: Props) {
  return (
    <div className="pointer-events-auto absolute bottom-6 right-5 z-20 flex flex-col gap-2">
      <Btn label="Zoom in" onClick={() => view.zoom(1.5)}>
        <PlusIcon />
      </Btn>
      <Btn label="Zoom out" onClick={() => view.zoom(1 / 1.5)}>
        <MinusIcon />
      </Btn>
      <Btn label="Jump to today" onClick={() => view.centerOnYear(CURRENT_YEAR)}>
        <DotIcon />
      </Btn>
    </div>
  );
}

function Btn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-frost/15 bg-ink-700/60 text-frost-dim backdrop-blur-md transition hover:border-gold/50 hover:bg-ink-600/70 hover:text-gold-soft active:scale-95"
    >
      {children}
    </button>
  );
}

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const DotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="2.5" fill="currentColor" />
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
  </svg>
);
