import { useEffect } from "react";
import type { Person } from "../types";
import { CURRENT_YEAR, currentAge, isDeceased } from "../lib/age";
import { Portrait } from "./Portrait";

interface Props {
  person: Person;
  onClose: () => void;
}

/**
 * Full readout for a single subject — the card "blown up" into a focused
 * instrument panel. Opened from a card's expand control; Esc / backdrop closes.
 */
export function PersonDetail({ person, onClose }: Props) {
  const age = currentAge(person);
  const deceased = isDeceased(person);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink-900/70 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm animate-fade-up rounded-sm border border-gold/30 bg-ink-800/95 px-7 py-8 backdrop-blur-xl"
        style={{
          boxShadow:
            "0 0 0 1px rgb(var(--gold) / 0.25), 0 0 40px rgb(var(--gold) / 0.18), 0 30px 80px -20px rgb(0 0 0 / 0.95)",
        }}
      >
        {/* corner brackets — same readout framing as the card, scaled up */}
        <Bracket className="left-0 top-0 border-l-2 border-t-2" />
        <Bracket className="bottom-0 right-0 border-b-2 border-r-2" />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-sm p-1.5 text-frost-dim transition hover:text-frost"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center">
          <Portrait
            name={person.name}
            imageUrl={person.imageUrl}
            size={150}
            deceased={deceased}
          />

          <h2
            className="mt-5 font-mono text-lg font-medium uppercase leading-tight tracking-[0.06em] text-frost"
            style={{ textShadow: "0 0 14px rgb(var(--gold) / 0.25)" }}
          >
            {person.name}
          </h2>

          {person.type === "celebrity" && (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-sm border border-gold/30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-gold-soft">
              <span className="h-1.5 w-1.5 bg-gold/80 shadow-[0_0_6px_rgb(var(--gold)/0.9)]" />
              Celebrity
            </span>
          )}

          {/* readout stats */}
          <div className="mt-6 flex w-full items-stretch justify-center divide-x divide-frost/10 font-mono">
            <Stat label="Born" value={String(person.birthYear)} />
            {deceased && <Stat label="Died" value={String(person.deathYear)} />}
            <Stat
              label={deceased ? "Age reached" : "Age now"}
              value={`${age}`}
              suffix="yrs"
            />
          </div>

          <p className="mt-6 font-display text-[15px] italic leading-snug text-frost-dim">
            {deceased ? (
              <>
                In memoriam · lived {age} {age === 1 ? "year" : "years"}, from{" "}
                {person.birthYear} to {person.deathYear}.
              </>
            ) : (
              <>
                {person.birthYear === CURRENT_YEAR ? (
                  <>Born this year, {person.birthYear}.</>
                ) : (
                  <>
                    {age} {age === 1 ? "year" : "years"} on the line since{" "}
                    {person.birthYear}.
                  </>
                )}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col items-center px-5">
      <span className="text-2xl leading-none text-gold-soft">
        {value}
        {suffix && <span className="ml-1 text-sm text-frost-dim">{suffix}</span>}
      </span>
      <span className="mt-1.5 text-[9px] uppercase tracking-[0.18em] text-frost-dim/70">
        {label}
      </span>
    </div>
  );
}

/** L-shaped corner bracket framing the readout panel. */
function Bracket({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={["pointer-events-none absolute h-4 w-4 border-gold/60", className].join(" ")}
    />
  );
}
