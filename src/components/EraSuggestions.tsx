import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CelebrityResult, Person } from "../types";
import { suggestByEra, decadeOf } from "../lib/searchCelebrity";
import { CURRENT_YEAR } from "../lib/age";
import { Portrait } from "./Portrait";

interface Props {
  /** Year under the tap — its decade frames the suggestions. */
  year: number;
  /** Viewport-space point of the tap; the card floats next to it. */
  point: { x: number; y: number };
  onAdd: (person: Omit<Person, "id">) => void;
  onClose: () => void;
  /** Already on the timeline — never proposed back. */
  existing: Person[];
}

const CARD_W = 300;
const GAP = 16; // px between the tap point and the card

/**
 * A floating prompt anchored at a tap on the empty timeline: "Born in the
 * 1980s — …", a short list of notable figures from that decade, each one
 * tappable to drop onto the trace. Closes on Escape, an outside click, or once
 * its era no longer matches (the parent re-mounts it per tap via `key`).
 */
export function EraSuggestions({ year, point, onAdd, onClose, existing }: Props) {
  const decade = decadeOf(year);
  const [results, setResults] = useState<CelebrityResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState<Set<string>>(new Set());

  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number }>({
    left: point.x,
    top: point.y,
  });

  // Fetch the decade's figures once, excluding whoever is already placed.
  const existingNames = useRef<string[]>([]);
  existingNames.current = existing.map((p) => p.name);
  useEffect(() => {
    setLoading(true);
    const ctrl = new AbortController();
    suggestByEra(year, existingNames.current, ctrl.signal)
      .then((found) => {
        if (!ctrl.signal.aborted) setResults(found);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });
    return () => ctrl.abort();
  }, [year]);

  // Place the card beside the tap, clamped to the viewport. Prefer above; flip
  // below when there isn't room. Measured after layout so height is real.
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const h = el.offsetHeight;
    const left = Math.min(Math.max(8, point.x - CARD_W / 2), vw - CARD_W - 8);
    const above = point.y - GAP - h;
    const top = above >= 8 ? above : Math.min(point.y + GAP, vh - h - 8);
    setPos({ left, top });
  }, [point.x, point.y, results, loading]);

  // Dismiss on Escape or any pointer press outside the card.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onDown = (e: PointerEvent) => {
      if (!cardRef.current?.contains(e.target as Node)) onClose();
    };
    window.addEventListener("keydown", onKey);
    // Capture so it runs before the timeline's own pointer handlers.
    window.addEventListener("pointerdown", onDown, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown, true);
    };
  }, [onClose]);

  const pick = (c: CelebrityResult) => {
    onAdd({
      name: c.name,
      birthYear: c.birthYear,
      birthDate: c.birthDate,
      deathYear: c.deathYear,
      deathDate: c.deathDate,
      imageUrl: c.imageUrl,
      type: "celebrity",
    });
    setAdded((prev) => new Set(prev).add(c.name));
  };

  return (
    <div
      ref={cardRef}
      className="fixed z-30 animate-fade-up rounded-2xl border border-gold/20 bg-ink-800/95 p-3 shadow-[0_24px_64px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md"
      style={{ left: pos.left, top: pos.top, width: CARD_W }}
    >
      <div className="mb-2 flex items-start justify-between gap-2 px-1">
        <div>
          <p className="font-display text-[17px] leading-tight text-frost">
            Born in the <span className="text-gold-soft">{decade}s</span>
          </p>
          <p className="mt-0.5 font-sans text-[12px] text-frost-dim">
            Tap to add to the timeline
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="-mr-1 -mt-1 rounded-lg p-1.5 text-frost-dim transition hover:bg-frost/5 hover:text-frost"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="max-h-[44vh] space-y-1 overflow-y-auto pr-0.5">
        {loading ? (
          <p className="py-6 text-center font-sans text-[13px] text-frost-dim animate-pulse-soft">
            Finding figures from the {decade}s…
          </p>
        ) : results.length > 0 ? (
          results.map((c) => (
            <SuggestionRow
              key={`${c.name}-${c.birthYear}`}
              c={c}
              added={added.has(c.name)}
              onPick={pick}
            />
          ))
        ) : (
          <p className="py-5 text-center font-sans text-[13px] text-frost-dim">
            No notable figures found for this decade.
          </p>
        )}
      </div>
    </div>
  );
}

function SuggestionRow({
  c,
  added,
  onPick,
}: {
  c: CelebrityResult;
  added: boolean;
  onPick: (c: CelebrityResult) => void;
}) {
  return (
    <button
      onClick={() => !added && onPick(c)}
      disabled={added}
      className={[
        "flex w-full items-center gap-2.5 rounded-xl border border-transparent px-2 py-1.5 text-left transition",
        added ? "opacity-60" : "hover:border-gold/30 hover:bg-ink-600/60",
      ].join(" ")}
    >
      <Portrait name={c.name} imageUrl={c.imageUrl} size={36} deceased={c.deathYear != null} />
      <div className="min-w-0 flex-1">
        <div className="truncate font-display text-[15px] text-frost">{c.name}</div>
        {c.blurb && (
          <div className="truncate font-sans text-[11px] text-frost-dim">{c.blurb}</div>
        )}
      </div>
      {added ? (
        <span className="shrink-0 text-gold">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5l3.2 3.2L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      ) : (
        <span className="shrink-0 text-right font-sans text-[12px] tabular-nums text-gold-soft">
          {c.birthYear}
          {c.deathYear ? (
            <span className="text-frost-dim"> – {c.deathYear}</span>
          ) : (
            <span className="text-frost-dim"> · {CURRENT_YEAR - c.birthYear}y</span>
          )}
        </span>
      )}
    </button>
  );
}
