import type { Person } from "../types";
import type { Orientation } from "../hooks/useTimelineView";
import { currentAge, isDeceased } from "../lib/age";
import { Portrait } from "./Portrait";

interface Props {
  person: Person;
  orientation: Orientation;
  selected: boolean;
  dimmed: boolean;
  opacity?: number;
  onSelect: () => void;
  onExpand: () => void;
  onRemove: () => void;
}

export function PersonCard({
  person,
  orientation,
  selected,
  dimmed,
  opacity = 1,
  onSelect,
  onExpand,
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
        "group pointer-events-auto relative cursor-pointer select-none rounded-xl border backdrop-blur-md transition-[transform,box-shadow,border-color,opacity] duration-300 ease-glide",
        horizontal ? "w-[132px] px-3.5 py-3" : "w-[min(300px,calc(100vw-80px))] px-3.5 py-3",
        selected
          ? "border-gold/60 bg-ink-800/90"
          : "border-gold/15 bg-ink-800/65 hover:border-gold/40 hover:bg-ink-700/75",
      ].join(" ")}
      style={{
        boxShadow: selected
          ? "0 0 0 1px rgb(var(--gold) / 0.3), 0 0 30px rgb(var(--gold) / 0.28), 0 18px 44px -20px rgb(0 0 0 / 0.85)"
          : "0 12px 32px -22px rgb(0 0 0 / 0.85)",
        transform: selected ? "scale(1.04)" : undefined,
        opacity: selected ? 1 : dimmed ? Math.min(opacity, 0.3) : opacity,
      }}
    >
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
            size={horizontal ? 52 : 48}
            deceased={deceased}
          />
          {deceased && (
            <span
              title={`In memoriam · ${person.birthYear}–${person.deathYear}`}
              className="absolute -bottom-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border border-frost/15 bg-ink-800 text-frost-dim shadow-[0_2px_6px_rgb(var(--ink-900)/0.6)]"
            >
              <CrossIcon />
            </span>
          )}
        </div>

        <div className={horizontal ? "mt-2 w-full" : "min-w-0 flex-1"}>
          <div
            className="truncate font-display text-[17px] font-medium leading-tight text-frost"
            title={person.name}
          >
            {person.name}
          </div>
          {deceased ? (
            <div
              className={[
                "mt-0.5 font-sans text-[12px] leading-tight text-frost-dim",
                horizontal ? "" : "flex items-baseline gap-1.5",
              ].join(" ")}
            >
              <span className="text-gold-soft">{person.birthYear}</span>
              <span className="px-1 text-frost-dim/60">–</span>
              <span className="text-gold-soft">{person.deathYear}</span>
              <span className={horizontal ? "block" : ""}>· {age} yrs</span>
            </div>
          ) : (
            <div className="mt-0.5 flex items-baseline gap-1.5 font-sans text-[12px] text-frost-dim">
              <span className="text-gold-soft">{person.birthYear}</span>
              <span>· {age} yrs</span>
            </div>
          )}
        </div>
      </div>

      {/* Expand control — open the full readout. Hover-reveal / always on touch. */}
      <button
        aria-label={`Expand ${person.name}`}
        title="View larger"
        onClick={(e) => {
          e.stopPropagation();
          onExpand();
        }}
        className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-frost/15 bg-ink-800/95 text-frost-dim opacity-0 backdrop-blur-sm transition hover:border-gold/50 hover:text-gold group-hover:opacity-100 [@media(hover:none)]:opacity-100"
      >
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.4" />
          <path d="M9 9l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>

      {/* Remove control — hover-reveal on mouse, always shown on touch */}
      <button
        aria-label={`Remove ${person.name}`}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-frost/15 bg-ink-800/95 text-frost-dim opacity-0 backdrop-blur-sm transition hover:border-gold/50 hover:text-gold group-hover:opacity-100 [@media(hover:none)]:opacity-100"
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
        <div className="pointer-events-none absolute left-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-gold/70 shadow-[0_0_6px_rgb(var(--gold)/0.9)]" />
      )}
    </div>
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
