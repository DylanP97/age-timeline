import { useMemo, useRef } from "react";
import type { Person } from "../types";
import type { TimelineView } from "../hooks/useTimelineView";
import { assignLanes, type Side } from "../lib/layout";
import { CURRENT_YEAR, MAX_YEAR, MIN_YEAR, compare } from "../lib/age";
import { YearGrid } from "./YearGrid";
import { PersonCard } from "./PersonCard";

interface Props {
  people: Person[];
  view: TimelineView;
  selectedIds: string[];
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

/** Per-orientation geometry for placing cards off the line. */
const GEOMETRY = {
  horizontal: { baseOffset: 38, laneStep: 122 },
  vertical: { baseOffset: 10, laneStep: 50 },
};

export function Timeline({ people, view, selectedIds, onSelect, onRemove }: Props) {
  const horizontal = view.orientation === "horizontal";
  const geo = GEOMETRY[view.orientation];

  // Lane assignment is scroll-independent → memoize on people + zoom only.
  const lanes = useMemo(
    () => assignLanes(people, view.pxPerYear, view.orientation),
    [people, view.pxPerYear, view.orientation],
  );

  // Cull to what's on (or near) screen for smooth rendering at any count.
  const visible = useMemo(
    () =>
      people.filter(
        (p) =>
          p.birthYear >= view.visible.startYear - 1 &&
          p.birthYear <= view.visible.endYear + 1,
      ),
    [people, view.visible.startYear, view.visible.endYear],
  );

  const nowPos = view.posOf(CURRENT_YEAR);
  const minPos = view.posOf(MIN_YEAR);
  const maxPos = view.posOf(MAX_YEAR);

  // Distinguish a background tap (clears selection) from the end of a pan-drag.
  const tapStart = useRef<{ x: number; y: number } | null>(null);

  const comparison =
    selectedIds.length === 2
      ? compare(
          people.find((p) => p.id === selectedIds[0])!,
          people.find((p) => p.id === selectedIds[1])!,
        )
      : null;

  return (
    <div
      ref={view.ref}
      className={[
        "relative h-full w-full touch-none overflow-hidden",
        view.isDragging ? "cursor-grabbing" : "cursor-grab",
      ].join(" ")}
      onPointerDown={(e) => (tapStart.current = { x: e.clientX, y: e.clientY })}
      onClick={(e) => {
        const s = tapStart.current;
        const moved = s ? Math.hypot(e.clientX - s.x, e.clientY - s.y) : 0;
        if (moved < 6 && selectedIds.length) onSelect("");
      }}
    >
      <YearGrid view={view} />

      {/* The illuminated timeline itself */}
      <TimelineSpine horizontal={horizontal} from={minPos} to={maxPos} />

      {/* "Today" marker */}
      <NowMarker horizontal={horizontal} pos={nowPos} />

      {/* Comparison span between the two selected people */}
      {comparison && (
        <ComparisonSpan
          horizontal={horizontal}
          a={view.posOf(comparison.older.birthYear)}
          b={view.posOf(comparison.younger.birthYear)}
          gap={comparison.gap}
        />
      )}

      {/* People */}
      {visible.map((person) => {
        const placement = lanes.get(person.id) ?? { side: "primary" as Side, lane: 0 };
        const mainPos = view.posOf(person.birthYear);
        const offset = geo.baseOffset + placement.lane * geo.laneStep;
        const isSelected = selectedIds.includes(person.id);
        const dimmed = selectedIds.length === 2 && !isSelected;

        return (
          <PersonNode
            key={person.id}
            horizontal={horizontal}
            side={placement.side}
            mainPos={mainPos}
            offset={offset}
            selected={isSelected}
          >
            <PersonCard
              person={person}
              orientation={view.orientation}
              selected={isSelected}
              dimmed={dimmed}
              onSelect={() => onSelect(person.id)}
              onRemove={() => onRemove(person.id)}
            />
          </PersonNode>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function TimelineSpine({
  horizontal,
  from,
  to,
}: {
  horizontal: boolean;
  from: number;
  to: number;
}) {
  const start = Math.min(from, to);
  const length = Math.abs(to - from);
  return (
    <>
      {/* Phosphor bloom — the soft glow the trace leaves on the screen */}
      <div
        className="pointer-events-none absolute"
        style={
          horizontal
            ? {
                left: start,
                width: length,
                top: "50%",
                height: 24,
                transform: "translateY(-50%)",
                background:
                  "linear-gradient(180deg, transparent, rgb(var(--gold) / 0.35) 50%, transparent)",
                filter: "blur(6px)",
              }
            : {
                top: start,
                height: length,
                left: "50%",
                width: 24,
                transform: "translateX(-50%)",
                background:
                  "linear-gradient(90deg, transparent, rgb(var(--gold) / 0.35) 50%, transparent)",
                filter: "blur(6px)",
              }
        }
      />
      {/* The trace — a crisp, bright phosphor line */}
      <div
        className="pointer-events-none absolute"
        style={
          horizontal
            ? {
                left: start,
                width: length,
                top: "50%",
                height: 2,
                transform: "translateY(-50%)",
                background:
                  "linear-gradient(90deg, rgb(var(--gold) / 0) 0%, rgb(var(--gold) / 0.9) 5%, rgb(var(--gold-soft)) 50%, rgb(var(--gold) / 0.9) 95%, rgb(var(--gold) / 0) 100%)",
                boxShadow:
                  "0 0 8px 1px rgb(var(--gold) / 0.7), 0 0 24px 3px rgb(var(--gold) / 0.3)",
              }
            : {
                top: start,
                height: length,
                left: "50%",
                width: 2,
                transform: "translateX(-50%)",
                background:
                  "linear-gradient(180deg, rgb(var(--gold) / 0) 0%, rgb(var(--gold) / 0.9) 5%, rgb(var(--gold-soft)) 50%, rgb(var(--gold) / 0.9) 95%, rgb(var(--gold) / 0) 100%)",
                boxShadow:
                  "0 0 8px 1px rgb(var(--gold) / 0.7), 0 0 24px 3px rgb(var(--gold) / 0.3)",
              }
        }
      />
    </>
  );
}

/** The live cursor — a cyan sweep line marking the present, like a scope trigger. */
function NowMarker({ horizontal, pos }: { horizontal: boolean; pos: number }) {
  return (
    <div
      className="pointer-events-none absolute z-10"
      style={horizontal ? { left: pos, top: 0, height: "100%" } : { top: pos, left: 0, width: "100%" }}
    >
      <div
        className="absolute"
        style={
          horizontal
            ? {
                left: 0,
                top: 0,
                width: 1,
                height: "100%",
                background:
                  "linear-gradient(180deg, transparent, rgb(var(--cyan) / 0.5) 30%, rgb(var(--cyan) / 0.5) 70%, transparent)",
                boxShadow: "0 0 8px rgb(var(--cyan) / 0.4)",
              }
            : {
                top: 0,
                left: 0,
                height: 1,
                width: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgb(var(--cyan) / 0.5) 30%, rgb(var(--cyan) / 0.5) 70%, transparent)",
                boxShadow: "0 0 8px rgb(var(--cyan) / 0.4)",
              }
        }
      />
      <div
        className="absolute h-2 w-2 bg-cyan shadow-[0_0_10px_2px_rgb(var(--cyan)/0.8)]"
        style={{
          left: horizontal ? 0 : "50%",
          top: horizontal ? "50%" : 0,
          transform: "translate(-50%, -50%) rotate(45deg)",
        }}
      />
      <span
        className={[
          "absolute whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.22em] text-cyan-soft",
          horizontal ? "left-2 top-3" : "left-1/2 top-3 -translate-x-1/2",
        ].join(" ")}
      >
        Now · {CURRENT_YEAR}
      </span>
    </div>
  );
}

function ComparisonSpan({
  horizontal,
  a,
  b,
  gap,
}: {
  horizontal: boolean;
  a: number;
  b: number;
  gap: number;
}) {
  const start = Math.min(a, b);
  const length = Math.abs(b - a);
  return (
    <div
      className="pointer-events-none absolute z-10"
      style={
        horizontal
          ? { left: start, width: length, top: "50%", transform: "translateY(-50%)" }
          : { top: start, height: length, left: "50%", transform: "translateX(-50%)" }
      }
    >
      <div
        className="absolute animate-fade-in"
        style={
          horizontal
            ? {
                left: 0,
                width: "100%",
                top: "50%",
                height: 3,
                transform: "translateY(-50%)",
                background:
                  "linear-gradient(90deg, rgb(var(--gold-soft) / 0.9), rgb(var(--gold-soft) / 1), rgb(var(--gold-soft) / 0.9))",
                boxShadow: "0 0 16px 2px rgb(var(--gold-soft) / 0.7)",
              }
            : {
                top: 0,
                height: "100%",
                left: "50%",
                width: 3,
                transform: "translateX(-50%)",
                background:
                  "linear-gradient(180deg, rgb(var(--gold-soft) / 0.9), rgb(var(--gold-soft) / 1), rgb(var(--gold-soft) / 0.9))",
                boxShadow: "0 0 16px 2px rgb(var(--gold-soft) / 0.7)",
              }
        }
      />
      {[0, 1].map((end) => (
        <div
          key={end}
          className="absolute h-2 w-2 bg-gold-soft shadow-[0_0_10px_2px_rgb(var(--gold-soft)/0.9)]"
          // square end-caps to match the readout blips
          style={
            horizontal
              ? { left: end ? "100%" : 0, top: "50%", transform: "translate(-50%,-50%)" }
              : { top: end ? "100%" : 0, left: "50%", transform: "translate(-50%,-50%)" }
          }
        />
      ))}
      <span
        className="absolute whitespace-nowrap rounded-sm border border-gold/40 bg-ink-800/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold-soft backdrop-blur-sm"
        style={{
          left: horizontal ? "50%" : "50%",
          top: horizontal ? "50%" : "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {gap} {gap === 1 ? "yr" : "yrs"}
      </span>
    </div>
  );
}

/** Positions a card + connector + dot relative to the line. */
function PersonNode({
  horizontal,
  side,
  mainPos,
  offset,
  selected,
  children,
}: {
  horizontal: boolean;
  side: Side;
  mainPos: number;
  offset: number;
  selected: boolean;
  children: React.ReactNode;
}) {
  // primary = above (h) / right (v); secondary = below (h) / left (v)
  const away = side === "primary";
  const z = selected ? 20 : 5;

  // Leader line from the trace to the callout — solid amber near the blip,
  // fading toward the plate, like an annotation line on a readout.
  const connector = (
    <div
      className="pointer-events-none absolute"
      style={
        horizontal
          ? {
              left: mainPos,
              width: 1,
              top: away ? `calc(50% - ${offset}px)` : "50%",
              height: offset,
              transform: "translateX(-50%)",
              backgroundImage: `linear-gradient(${away ? "0deg" : "180deg"}, rgb(var(--gold) / ${selected ? 0.5 : 0.25}), rgb(var(--gold) / ${selected ? 0.85 : 0.5}))`,
            }
          : {
              top: mainPos,
              height: 1,
              left: away ? "50%" : `calc(50% - ${offset}px)`,
              width: offset,
              transform: "translateY(-50%)",
              backgroundImage: `linear-gradient(${away ? "90deg" : "270deg"}, rgb(var(--gold) / ${selected ? 0.85 : 0.5}), rgb(var(--gold) / ${selected ? 0.5 : 0.25}))`,
            }
      }
    />
  );

  // Card position
  const cardStyle: React.CSSProperties = horizontal
    ? {
        left: mainPos,
        top: away ? `calc(50% - ${offset}px)` : `calc(50% + ${offset}px)`,
        transform: away ? "translate(-50%, -100%)" : "translate(-50%, 0)",
      }
    : {
        top: mainPos,
        left: away ? `calc(50% + ${offset}px)` : `calc(50% - ${offset}px)`,
        transform: away ? "translate(0, -50%)" : "translate(-100%, -50%)",
      };

  return (
    <div style={{ zIndex: z }}>
      {connector}
      <div className="absolute" style={cardStyle}>
        {children}
      </div>
    </div>
  );
}
