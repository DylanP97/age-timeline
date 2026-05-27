import { useCallback, useEffect, useRef, useState } from "react";
import type { Person } from "./types";
import { usePeople } from "./hooks/usePeople";
import { useIsMobile } from "./hooks/useMediaQuery";
import { useTimelineView } from "./hooks/useTimelineView";
import { useTheme } from "./hooks/useTheme";
import { CURRENT_YEAR, compare } from "./lib/age";
import { Timeline } from "./components/Timeline";
import { ScreenFX } from "./components/ScreenFX";
import { Controls } from "./components/Controls";
import { ComparisonOverlay } from "./components/ComparisonOverlay";
import { AddPersonModal } from "./components/AddPersonModal";
import { CelebritySearchModal } from "./components/CelebritySearchModal";
import { PersonDetail } from "./components/PersonDetail";
import { OnboardingModal } from "./components/OnboardingModal";
import { EraSuggestions } from "./components/EraSuggestions";

type Dialog = "none" | "person" | "celebrity" | "onboarding";

/** The era framed when the instrument first opens — kept close to today so the
 *  opening view is dominated by living figures, with history a pan away. */
const INITIAL_VIEW_START = 1950;

export default function App() {
  const isMobile = useIsMobile();
  const { theme, toggle: toggleTheme } = useTheme();
  const { people, addPerson, removePerson } = usePeople();
  const view = useTimelineView(isMobile ? "vertical" : "horizontal");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [interactionOrder, setInteractionOrder] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<Dialog>("none");
  // Era prompt floating at a tapped point on the empty trace.
  const [eraPick, setEraPick] = useState<{
    year: number;
    point: { x: number; y: number };
  } | null>(null);

  // Sync interactionOrder with people changes
  useEffect(() => {
    setInteractionOrder((prev) => {
      const currentIds = people.map((p) => p.id);
      // Keep existing order for known IDs, add new ones at the end, remove gone ones.
      const kept = prev.filter((id) => currentIds.includes(id));
      const added = currentIds.filter((id) => !prev.includes(id));
      return [...kept, ...added];
    });
  }, [people]);

  // Check for onboarding on mount
  useEffect(() => {
    const onboarded = localStorage.getItem("how-old-is.onboarded");
    if (!onboarded) {
      setDialog("onboarding");
    }
  }, []);

  const handleOnboardingComplete = useCallback(
    (userData: Omit<Person, "id">) => {
      const user = addPerson(userData);
      localStorage.setItem("how-old-is.onboarded", "true");
      setDialog("none");
      // Select the user immediately
      setSelectedIds([user.id]);
    },
    [addPerson],
  );

  // Toggle selection, keeping at most two (drop the oldest). "" clears.
  const handleSelect = useCallback((id: string) => {
    if (id === "") return setSelectedIds([]);
    
    // Move to front of stacking order
    setInteractionOrder((prev) => {
      const filtered = prev.filter((p) => p !== id);
      return [...filtered, id];
    });

    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      return [...prev, id].slice(-2);
    });
  }, []);

  const handleRemove = useCallback(
    (id: string) => {
      removePerson(id);
      setSelectedIds((prev) => prev.filter((p) => p !== id));
      setExpandedId((prev) => (prev === id ? null : prev));
    },
    [removePerson],
  );

  // Frame the modern era (1950 → today) on first load, and again whenever the
  // layout axis flips (desktop ↔ mobile). Older figures sit just off-screen,
  // a pan/scroll away into history.
  const fittedFor = useRef<string>("");
  useEffect(() => {
    if (people.length === 0) return;
    if (fittedFor.current === view.orientation) return;
    view.fit(INITIAL_VIEW_START, CURRENT_YEAR);
    fittedFor.current = view.orientation;
  }, [people, view]);

  // Keep selection valid if people change underneath.
  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => people.some((p) => p.id === id)));
  }, [people]);

  const expandedPerson = expandedId
    ? people.find((p) => p.id === expandedId) ?? null
    : null;

  const selectedPeople = selectedIds
    .map((id) => people.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const comparison =
    selectedPeople.length === 2
      ? compare(selectedPeople[0], selectedPeople[1])
      : null;

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-ink-900 text-frost">
      {/* Warm wash + gold bloom along the trace (painted under the trace) */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 transition-[background] duration-500"
          style={{
            background:
              "radial-gradient(130% 100% at 50% 50%, rgb(var(--atmo-haze) / var(--atmo-haze-a)), transparent 60%)",
          }}
        />
        {/* Gold bloom running along the timeline's axis */}
        <div
          className="absolute inset-0 transition-[background] duration-500"
          style={{
            background: isMobile
              ? "radial-gradient(60% 120% at 50% 50%, rgb(var(--atmo-glow) / var(--atmo-glow-a)), transparent 70%)"
              : "radial-gradient(120% 50% at 50% 50%, rgb(var(--atmo-glow) / var(--atmo-glow-a)), transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{
            opacity: "var(--noise-a)",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* Timeline surface */}
      <Timeline
        people={people}
        view={view}
        selectedIds={selectedIds}
        interactionOrder={interactionOrder}
        onSelect={handleSelect}
        onExpand={setExpandedId}
        onRemove={handleRemove}
        onPickYear={(year, point) => setEraPick({ year, point })}
      />

      {/* Grid + vignette atmosphere over the trace */}
      <ScreenFX />

      {/* Mobile: a short scrim under the wordmark so the single column of rows
          stays legible as it scrolls up past the header. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 md:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgb(var(--ink-900)) 12%, rgb(var(--ink-900) / 0.7) 55%, transparent)",
        }}
      />

      {/* Header / wordmark */}
      <header className="pointer-events-none absolute left-6 top-5 z-20 select-none md:left-8 md:top-7">
        <h1
          className="font-display text-3xl font-medium leading-none text-frost md:text-4xl"
          style={{ textShadow: "0 0 24px rgb(var(--gold) / 0.3)" }}
        >
          How old is <span className="text-gold">...</span>
        </h1>
        <p className="mt-2 font-sans text-[11px] font-light tracking-[0.12em] text-frost-dim/80">
          a timeline of lives
        </p>
      </header>

      {/* Add actions */}
      <div className="pointer-events-auto absolute right-5 top-5 z-20 flex items-center gap-2 md:right-7 md:top-7">
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-frost/15 bg-ink-700/60 text-frost-dim backdrop-blur-md transition hover:border-gold/50 hover:text-gold-soft active:scale-95"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
        <ActionButton onClick={() => setDialog("celebrity")} primary>
          <SparkIcon />
          <span className="hidden sm:inline">Celebrity</span>
        </ActionButton>
        <ActionButton onClick={() => setDialog("person")}>
          <PlusIcon />
          <span className="hidden sm:inline">Custom Person</span>
        </ActionButton>
      </div>

      <Controls view={view} />

      {/* Selection hint */}
      {selectedPeople.length === 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-7 z-10 flex justify-center px-4 md:bottom-9">
          <p className="animate-fade-in rounded-full border border-gold/25 bg-ink-800/80 px-5 py-2 font-sans text-[13px] text-frost-dim backdrop-blur-md">
            Pick a second person to compare
          </p>
        </div>
      )}

      {comparison && (
        <ComparisonOverlay comparison={comparison} onClose={() => setSelectedIds([])} />
      )}

      {expandedPerson && (
        <PersonDetail
          person={expandedPerson}
          onClose={() => setExpandedId(null)}
          onAdd={addPerson}
          existing={people}
        />
      )}

      {dialog === "person" && (
        <AddPersonModal onClose={() => setDialog("none")} onAdd={addPerson} />
      )}
      {dialog === "celebrity" && (
        <CelebritySearchModal
          onClose={() => setDialog("none")}
          onAdd={addPerson}
          existing={people}
        />
      )}

      {dialog === "onboarding" && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      {eraPick && (
        <EraSuggestions
          key={eraPick.year}
          year={eraPick.year}
          point={eraPick.point}
          onAdd={addPerson}
          onClose={() => setEraPick(null)}
          existing={people}
        />
      )}
    </div>
  );
}

function ActionButton({
  onClick,
  primary,
  children,
}: {
  onClick: () => void;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex items-center gap-2 rounded-full border px-4 py-2 font-sans text-[13px] backdrop-blur-md transition active:scale-95",
        primary
          ? "border-gold/50 bg-gold/10 text-gold-soft hover:bg-gold/20 hover:border-gold/70"
          : "border-frost/15 bg-ink-700/60 text-frost-dim hover:border-frost/30 hover:text-frost",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const SparkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 1.5l1.6 4.3 4.4 1.7-4.4 1.7L8 13.5 6.4 9.2 2 7.5l4.4-1.7L8 1.5z"
      fill="currentColor"
    />
  </svg>
);
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.95 3.05l-1.13 1.13M4.18 11.82l-1.13 1.13M12.95 12.95l-1.13-1.13M4.18 4.18L3.05 3.05"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M13.5 9.5A5.5 5.5 0 016.5 2.5a5.5 5.5 0 107 7z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);
