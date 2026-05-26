import type { Person } from "../types";
import type { Orientation } from "../hooks/useTimelineView";
import { currentAge, isDeceased } from "../lib/age";
import { Portrait } from "./Portrait";

interface Props {
  person: Person;
  orientation: Orientation;
  selected: boolean;
  dimmed: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export function PersonCard({
  person,
  orientation,
  selected,
  dimmed,
  onSelect,
  onRemove,
}: Props) {
  const age = currentAge(person);
  const deceased = isDeceased(person);
  const horizontal = orientation === "horizontal";

  return (
    <div
      data-card
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={[
        "group pointer-events-auto relative cursor-pointer select-none rounded-sm border backdrop-blur-md transition-[transform,box-shadow,border-color,opacity] duration-300 ease-glide",
        horizontal ? "w-[128px] px-3 py-2.5" : "w-[158px] px-3 py-2.5",
        selected
          ? "border-gold/70 bg-ink-800/90"
          : "border-gold/20 bg-ink-800/70 hover:border-gold/45 hover:bg-ink-700/80",
        dimmed ? "opacity-30" : "opacity-100",
      ].join(" ")}
      style={{
        boxShadow: selected
          ? "0 0 0 1px rgb(var(--gold) / 0.35), 0 0 26px rgb(var(--gold) / 0.3), 0 14px 40px -18px rgb(0 0 0 / 0.8)"
          : "0 10px 30px -20px rgb(0 0 0 / 0.85)",
        transform: selected ? "scale(1.04)" : undefined,
      }}
    >
      {/* corner brackets — readout annotation framing */}
      <Bracket className="left-0 top-0 border-l border-t" selected={selected} />
      <Bracket className="bottom-0 right-0 border-b border-r" selected={selected} />

      <div
        className={
          horizontal
            ? "flex flex-col items-center text-center"
            : "flex items-center gap-3 text-left"
        }
      >
        <div className="relative shrink-0">
          <Portrait
            name={person.name}
            imageUrl={person.imageUrl}
            size={horizontal ? 52 : 44}
            deceased={deceased}
          />
          {deceased && (
            <span
              title={`In memoriam · ${person.birthYear}–${person.deathYear}`}
              className="absolute -bottom-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-sm border border-frost/15 bg-ink-800 text-frost-dim shadow-[0_2px_6px_rgb(var(--ink-900)/0.6)]"
            >
              <CrossIcon />
            </span>
          )}
        </div>

        <div className={horizontal ? "mt-2 w-full" : "min-w-0 flex-1"}>
          <div
            className="truncate font-mono text-[12px] font-medium uppercase leading-tight tracking-[0.04em] text-frost"
            title={person.name}
          >
            {person.name}
          </div>
          {deceased ? (
            <div
              className={[
                "mt-1 font-mono text-[11px] leading-tight text-frost-dim",
                horizontal ? "" : "flex items-baseline gap-1.5",
              ].join(" ")}
            >
              <span className="text-gold-soft">{person.birthYear}</span>
              <span className="px-1 text-frost-dim/60">–</span>
              <span className="text-gold-soft">{person.deathYear}</span>
              <span className={horizontal ? "block" : ""}>· {age} yrs</span>
            </div>
          ) : (
            <div className="mt-0.5 flex items-baseline gap-1.5 font-mono text-[11px] text-frost-dim">
              <span className="text-gold-soft">{person.birthYear}</span>
              <span>· {age} yrs</span>
            </div>
          )}
        </div>
      </div>

      {/* Remove control — hover-reveal on mouse, always shown on touch */}
      <button
        aria-label={`Remove ${person.name}`}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-sm border border-frost/15 bg-ink-800/95 text-frost-dim opacity-0 backdrop-blur-sm transition hover:border-gold/50 hover:text-gold group-hover:opacity-100 [@media(hover:none)]:opacity-100"
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 2l8 8M10 2l-8 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {person.type === "celebrity" && !deceased && (
        <div className="pointer-events-none absolute left-2 top-2 h-1.5 w-1.5 bg-gold/70 shadow-[0_0_6px_rgb(var(--gold)/0.9)]" />
      )}
    </div>
  );
}

/** A small L-shaped corner bracket framing the readout plate. */
function Bracket({ className, selected }: { className: string; selected: boolean }) {
  return (
    <span
      aria-hidden
      className={[
        "pointer-events-none absolute h-2.5 w-2.5",
        selected ? "border-gold/80" : "border-gold/40",
        className,
      ].join(" ")}
    />
  );
}

/** Small Latin cross used to mark people who have passed away. */
function CrossIcon() {
  return (
    <svg width="9" height="10" viewBox="0 0 12 12" fill="currentColor">
      <path d="M5.2 1h1.6v2.2H9v1.6H6.8V11H5.2V4.8H3V3.2h2.2z" />
    </svg>
  );
}
