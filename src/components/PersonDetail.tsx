import { useEffect, useRef, useState } from "react";
import type { CelebrityResult, Person } from "../types";
import { CURRENT_YEAR, currentAge, isDeceased } from "../lib/age";
import { suggestSimilar } from "../lib/searchCelebrity";
import { Portrait } from "./Portrait";

interface Props {
  person: Person;
  onClose: () => void;
  /** Drop a suggested related figure onto the timeline. */
  onAdd: (person: Omit<Person, "id">) => void;
  /** Everyone already on the timeline — never suggested back. */
  existing: Person[];
}

/**
 * Full readout for a single subject — the card "blown up" into a focused
 * instrument panel. Opened from a card's expand control; Esc / backdrop closes.
 * Below the readout sits a strip of genuinely related figures (same field, same
 * era) so the line can keep growing from whoever you're looking at.
 */
export function PersonDetail({ person, onClose, onAdd, existing }: Props) {
  const age = currentAge(person);
  const deceased = isDeceased(person);

  const [related, setRelated] = useState<CelebrityResult[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Names already on the timeline, read through a ref so that *adding* a
  // suggestion doesn't re-trigger the fetch (which would clear the strip).
  const existingNames = useRef<string[]>([]);
  existingNames.current = existing.map((p) => p.name);

  // Pull related figures whenever the focused person changes. Best-effort and
  // cancellable; the seed person is excluded along with the current timeline.
  useEffect(() => {
    setLoadingRelated(true);
    setRelated([]);
    const ctrl = new AbortController();
    const seed: CelebrityResult = {
      name: person.name,
      birthYear: person.birthYear,
      deathYear: person.deathYear,
      imageUrl: person.imageUrl,
    };
    suggestSimilar(seed, existingNames.current, ctrl.signal)
      .then((found) => {
        if (!ctrl.signal.aborted) setRelated(found);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoadingRelated(false);
      });
    return () => ctrl.abort();
  }, [person.id, person.name, person.birthYear, person.deathYear, person.imageUrl]);

  // Hide any suggestion the moment it lands on the timeline, so tapping one
  // visibly "consumes" it from the strip.
  const existingKeys = new Set(existing.map((p) => p.name.toLowerCase()));
  const visibleRelated = related.filter((c) => !existingKeys.has(c.name.toLowerCase()));

  const addRelated = (c: CelebrityResult) =>
    onAdd({
      name: c.name,
      birthYear: c.birthYear,
      birthDate: c.birthDate,
      deathYear: c.deathYear,
      deathDate: c.deathDate,
      imageUrl: c.imageUrl,
      type: "celebrity",
    });

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink-900/70 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90dvh] w-full max-w-sm flex-col overflow-y-auto animate-fade-up rounded-2xl border border-gold/25 bg-ink-800/95 px-7 py-8 backdrop-blur-xl"
        style={{
          boxShadow:
            "0 0 0 1px rgb(var(--gold) / 0.18), 0 0 44px rgb(var(--gold) / 0.16), 0 30px 80px -20px rgb(0 0 0 / 0.95)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-1.5 text-frost-dim transition hover:text-frost"
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
            className="mt-5 font-display text-3xl font-medium leading-tight text-frost"
            style={{ textShadow: "0 0 18px rgb(var(--gold) / 0.25)" }}
          >
            {person.name}
          </h2>

          {person.type === "celebrity" && (
            <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-gold/30 px-3 py-0.5 font-sans text-[11px] text-gold-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-gold/80 shadow-[0_0_6px_rgb(var(--gold)/0.9)]" />
              Celebrity
            </span>
          )}

          {/* stats */}
          <div className="mt-6 flex w-full items-stretch justify-center divide-x divide-frost/10">
            <Stat
              label="Born"
              value={String(person.birthYear)}
              caption={formatLongDate(person.birthDate)}
            />
            {deceased && (
              <Stat
                label="Died"
                value={String(person.deathYear)}
                caption={formatLongDate(person.deathDate)}
              />
            )}
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

        {/* related figures */}
        {(loadingRelated || visibleRelated.length > 0) && (
          <div className="mt-7 border-t border-frost/10 pt-5">
            <p className="mb-2 px-1 font-display text-[15px] italic text-frost-dim/80">
              Related figures
            </p>
            {loadingRelated && visibleRelated.length === 0 ? (
              <p className="py-5 text-center font-sans text-[13px] text-frost-dim animate-pulse-soft">
                Finding related figures…
              </p>
            ) : (
              <div className="space-y-1.5">
                {visibleRelated.map((c) => (
                  <RelatedRow key={`${c.name}-${c.birthYear}`} c={c} onAdd={addRelated} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** One tappable related figure — tapping drops them onto the timeline. */
function RelatedRow({
  c,
  onAdd,
}: {
  c: CelebrityResult;
  onAdd: (c: CelebrityResult) => void;
}) {
  return (
    <button
      onClick={() => onAdd(c)}
      title={`Add ${c.name} to the timeline`}
      className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-2.5 py-2 text-left transition hover:border-gold/30 hover:bg-ink-600/60"
    >
      <Portrait name={c.name} imageUrl={c.imageUrl} size={36} deceased={c.deathYear != null} />
      <div className="min-w-0 flex-1">
        <div className="truncate font-display text-[15px] text-frost">{c.name}</div>
        {c.blurb && (
          <div className="truncate font-sans text-[12px] text-frost-dim">{c.blurb}</div>
        )}
      </div>
      <div className="text-right font-sans text-[12px] tabular-nums text-gold-soft">
        {c.birthYear}
        {c.deathYear ? (
          <span className="text-frost-dim"> – {c.deathYear}</span>
        ) : (
          <span className="text-frost-dim"> · {CURRENT_YEAR - c.birthYear}y</span>
        )}
      </div>
      <span className="shrink-0 text-frost-dim transition group-hover:text-gold-soft" aria-hidden>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
    </button>
  );
}

function Stat({
  label,
  value,
  suffix,
  caption,
}: {
  label: string;
  value: string;
  suffix?: string;
  caption?: string;
}) {
  return (
    <div className="flex flex-col items-center px-5">
      <span className="font-display text-3xl leading-none text-gold-soft">
        {value}
        {suffix && <span className="ml-1 font-sans text-sm text-frost-dim">{suffix}</span>}
      </span>
      <span className="mt-1.5 font-sans text-[11px] tracking-wide text-frost-dim/80">
        {label}
      </span>
      {caption && (
        <span className="mt-0.5 font-sans text-[10px] text-frost-dim/60">{caption}</span>
      )}
    </div>
  );
}

/** "13 Dec 1989" from an ISO date — parsed via the ISO string form, which is
 *  safe for years <100 (unlike the numeric Date constructor). */
function formatLongDate(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
