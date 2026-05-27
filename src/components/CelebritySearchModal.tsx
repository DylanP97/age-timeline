import { useEffect, useRef, useState } from "react";
import type { CelebrityResult, Person } from "../types";
import { searchCelebrity, suggestSimilar } from "../lib/searchCelebrity";
import { CURRENT_YEAR } from "../lib/age";
import { Modal } from "./Modal";
import { Portrait } from "./Portrait";

interface Props {
  onClose: () => void;
  onAdd: (person: Omit<Person, "id">) => void;
  /** Already on the timeline — never suggested back. */
  existing: Person[];
}

export function CelebritySearchModal({ onClose, onAdd, existing }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CelebrityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  // The last figure added in this session — drives the suggestions below.
  const [lastAdded, setLastAdded] = useState<CelebrityResult | null>(null);
  const [suggestions, setSuggestions] = useState<CelebrityResult[]>([]);
  const [suggesting, setSuggesting] = useState(false);

  // Debounced search against the swappable celebrity provider.
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setTouched(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const found = await searchCelebrity(q, ctrl.signal);
        if (!ctrl.signal.aborted) setResults(found);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 220);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [query]);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => inputRef.current?.focus(), []);

  // Add the figure, then stay open and pivot to "related" suggestions so the
  // user can keep building the timeline. Picking a suggestion chains naturally.
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
    setLastAdded(c);
    setQuery("");
    setResults([]);
    setTouched(false);
    inputRef.current?.focus();
  };

  // Keep the latest timeline names without making them a fetch dependency
  // (adding a person mutates `existing`, which would otherwise re-trigger).
  const existingNames = useRef<string[]>([]);
  existingNames.current = existing.map((p) => p.name);

  // Fetch "related" figures whenever a new person is added. Web-backed, so it
  // loads asynchronously and is cancelled if another add lands first.
  useEffect(() => {
    if (!lastAdded) return;
    setSuggesting(true);
    setSuggestions([]);
    const ctrl = new AbortController();
    suggestSimilar(lastAdded, existingNames.current, ctrl.signal)
      .then((found) => {
        if (!ctrl.signal.aborted) setSuggestions(found);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setSuggesting(false);
      });
    return () => ctrl.abort();
  }, [lastAdded]);

  return (
    <Modal
      title="Find a celebrity"
      subtitle="Search by name — birth year and portrait are pulled in automatically."
      onClose={onClose}
    >
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-frost-dim"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “Einstein”, “Ronaldo”, “Mozart”…"
          className="w-full rounded-lg border border-frost/10 bg-ink-700/60 py-2.5 pl-10 pr-3.5 font-sans text-[15px] text-frost placeholder:text-frost-dim/50 outline-none transition focus:border-gold/50 focus:bg-ink-700"
        />
      </div>

      <div className="mt-4 max-h-[46vh] space-y-1.5 overflow-y-auto pr-1">
        {query.trim() ? (
          <>
            {loading && (
              <p className="py-6 text-center font-sans text-[13px] text-frost-dim animate-pulse-soft">
                Searching…
              </p>
            )}
            {!loading && touched && results.length === 0 && (
              <p className="py-6 text-center font-sans text-sm text-frost-dim">
                No matches found. Try another spelling.
              </p>
            )}
            {!loading &&
              results.map((c) => (
                <ResultRow key={`${c.name}-${c.birthYear}`} c={c} onPick={pick} />
              ))}
          </>
        ) : lastAdded ? (
          <div className="animate-fade-in">
            <p className="flex items-center gap-2 px-1 font-sans text-[13px] text-frost">
              <CheckIcon />
              Added <span className="font-display text-gold-soft">{lastAdded.name}</span>
            </p>
            <p className="mb-1.5 mt-4 px-1 font-display text-[15px] italic text-frost-dim/80">
              Related figures you might add
            </p>
            {suggesting ? (
              <p className="py-6 text-center font-sans text-[13px] text-frost-dim animate-pulse-soft">
                Finding related figures…
              </p>
            ) : suggestions.length > 0 ? (
              suggestions.map((c) => (
                <ResultRow key={`${c.name}-${c.birthYear}`} c={c} onPick={pick} />
              ))
            ) : (
              <p className="py-4 text-center font-sans text-sm text-frost-dim">
                Nothing else to suggest — search for anyone above.
              </p>
            )}
          </div>
        ) : (
          <p className="py-6 text-center font-sans text-sm text-frost-dim/70">
            Start typing to search.
          </p>
        )}
      </div>
    </Modal>
  );
}

/** One tappable figure — shared by search results and suggestions. */
function ResultRow({
  c,
  onPick,
}: {
  c: CelebrityResult;
  onPick: (c: CelebrityResult) => void;
}) {
  return (
    <button
      onClick={() => onPick(c)}
      className="flex w-full items-center gap-3 rounded-xl border border-transparent px-2.5 py-2 text-left transition hover:border-gold/30 hover:bg-ink-600/60"
    >
      <Portrait name={c.name} imageUrl={c.imageUrl} size={40} deceased={c.deathYear != null} />
      <div className="min-w-0 flex-1">
        <div className="truncate font-display text-[16px] text-frost">{c.name}</div>
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
    </button>
  );
}

const CheckIcon = () => (
  <svg className="shrink-0 text-gold" width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3 8.5l3.2 3.2L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
