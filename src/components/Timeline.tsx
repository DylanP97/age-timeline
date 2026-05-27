import { useMemo, useRef } from "react";
import type { Person } from "../types";
import type { TimelineView } from "../hooks/useTimelineView";
import { assignLanes, stackColumn, type Placement, type Side } from "../lib/layout";
import { CURRENT_YEAR, MAX_YEAR, MIN_YEAR, compare } from "../lib/age";
import { RAIL_X, CARD_X } from "../lib/geometry";
import { YearGrid } from "./YearGrid";
import { PersonCard } from "./PersonCard";

interface Props {
  people: Person[];
  view: TimelineView;
  selectedIds: string[];
  interactionOrder: string[];
  onSelect: (id: string) => void;
  onExpand: (id: string) => void;
  onRemove: (id: string) => void;
  /** Tap on an empty stretch of the trace — propose figures from that era. */
  onPickYear: (year: number, point: { x: number; y: number }) => void;
}

/** Horizontal (desktop) geometry for placing cards above/below the line. */
const H_GEO = { baseOffset: 38, laneStep: 122 };

export function Timeline({
  people,
  view,
  selectedIds,
  interactionOrder,
  onSelect,
  onExpand,
  onRemove,
  onPickYear,
}: Props) {
  const horizontal = view.orientation === "horizontal";

  // Placement is scroll-independent → memoize on people + zoom only.
  // Desktop alternates cards above/below the line (lanes); mobile is a single
  // column to the right of a left rail (vertical de-overlap push).
  const lanes = useMemo(
    () => (horizontal ? assignLanes(people, view.pxPerYear, "horizontal") : null),
    [horizontal, people, view.pxPerYear],
  );
  const stacks = useMemo(
    () => (horizontal ? null : stackColumn(people, view.pxPerYear)),
    [horizontal, people, view.pxPerYear],
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
        if (moved >= 6) return; // a pan, not a tap
        // A live selection is dismissed first; an empty tap then proposes the
        // figures born in that spot's decade.
        if (selectedIds.length) {
          onSelect("");
          return;
        }
        const rect = e.currentTarget.getBoundingClientRect();
        const along = horizontal ? e.clientX - rect.left : e.clientY - rect.top;
        const year = Math.round(view.yearAt(along));
        if (year < MIN_YEAR || year > CURRENT_YEAR) return;
        onPickYear(year, { x: e.clientX, y: e.clientY });
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
        const mainPos = view.posOf(person.birthYear);
        const isSelected = selectedIds.includes(person.id);
        const dimmed = selectedIds.length === 2 && !isSelected;
        
        // Interaction-based stacking and transparency
        const interactionIndex = interactionOrder.indexOf(person.id);
        const interactionProgress = interactionOrder.length > 1 
          ? interactionIndex / (interactionOrder.length - 1)
          : 1;
        
        // Cards that haven't been touched in a while fade out
        const stackOpacity = isSelected ? 1 : 0.4 + 0.6 * interactionProgress;
        const stackZ = (isSelected ? 100 : 5) + interactionIndex;

        const card = (
          <PersonCard
            person={person}
            orientation={view.orientation}
            selected={isSelected}
            dimmed={dimmed}
            opacity={stackOpacity}
            onSelect={() => onSelect(person.id)}
            onExpand={() => onExpand(person.id)}
            onRemove={() => onRemove(person.id)}
          />
        );

        if (!horizontal) {
          const push = stacks?.get(person.id)?.push ?? 0;
          return (
            <RailNode 
              key={person.id} 
              mainPos={mainPos} 
              push={push} 
              selected={isSelected}
              zIndex={stackZ}
            >
              {card}
            </RailNode>
          );
        }

        const placement: Placement = lanes?.get(person.id) ?? { side: "primary" as Side, lane: 0 };
        const offset = H_GEO.baseOffset + placement.lane * H_GEO.laneStep;
        return (
          <PersonNode
            key={person.id}
            side={placement.side}
            mainPos={mainPos}
            offset={offset}
            selected={isSelected}
            zIndex={stackZ}
          >
            {card}
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
      {/* Soft bloom — the warm glow the trace casts into the dark */}
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
                left: RAIL_X,
                width: 24,
                transform: "translateX(-50%)",
                background:
                  "linear-gradient(90deg, transparent, rgb(var(--gold) / 0.35) 50%, transparent)",
                filter: "blur(6px)",
              }
        }
      />
      {/* The trace — a fine, bright gold line */}
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
                left: RAIL_X,
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

/** A soft luminous line marking the present moment on the timeline. */
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
        className="absolute h-2 w-2 rounded-full bg-cyan shadow-[0_0_10px_2px_rgb(var(--cyan)/0.8)]"
        style={{
          left: horizontal ? 0 : RAIL_X,
          top: horizontal ? "50%" : 0,
          transform: "translate(-50%, -50%)",
        }}
      />
      <span
        className="absolute whitespace-nowrap font-sans text-[11px] tracking-wide text-cyan-soft"
        style={
          horizontal
            ? { left: 10, top: 12 }
            : { left: RAIL_X + 8, top: -4, transform: "translateY(-100%)" }
        }
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
      className={["pointer-events-none absolute", horizontal ? "z-10" : "z-30"].join(" ")}
      style={
        horizontal
          ? { left: start, width: length, top: "50%", transform: "translateY(-50%)" }
          : { top: start, height: length, left: RAIL_X, transform: "translateX(-50%)" }
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
          className="absolute h-2 w-2 rounded-full bg-gold-soft shadow-[0_0_10px_2px_rgb(var(--gold-soft)/0.9)]"
          // round end-caps marking each birth year
          style={
            horizontal
              ? { left: end ? "100%" : 0, top: "50%", transform: "translate(-50%,-50%)" }
              : { top: end ? "100%" : 0, left: "50%", transform: "translate(-50%,-50%)" }
          }
        />
      ))}
      <span
        className="absolute whitespace-nowrap rounded-full border border-gold/40 bg-ink-800/90 px-2.5 py-0.5 font-sans text-[12px] tabular-nums text-gold-soft backdrop-blur-sm"
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

/** Desktop: positions a card above/below the line with a leader + connector. */
function PersonNode({
  side,
  mainPos,
  offset,
  zIndex,
  selected,
  children,
}: {
  side: Side;
  mainPos: number;
  offset: number;
  zIndex: number;
  selected: boolean;
  children: React.ReactNode;
}) {
  const away = side === "primary"; // primary = above, secondary = below

  return (
    <div style={{ zIndex }}>
      {/* Leader line from the trace to the callout — bright near the blip. */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: mainPos,
          width: 1,
          top: away ? `calc(50% - ${offset}px)` : "50%",
          height: offset,
          transform: "translateX(-50%)",
          backgroundImage: `linear-gradient(${away ? "0deg" : "180deg"}, rgb(var(--gold) / ${selected ? 0.5 : 0.25}), rgb(var(--gold) / ${selected ? 0.85 : 0.5}))`,
        }}
      />
      <div
        className="absolute"
        style={{
          left: mainPos,
          top: away ? `calc(50% - ${offset}px)` : `calc(50% + ${offset}px)`,
          transform: away ? "translate(-50%, -100%)" : "translate(-50%, 0)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Mobile: a single-column node hanging off the left rail. The dot stays at the
 * person's true year; the card may be pushed down (de-overlap) and an elbow
 * connector ties it back to the dot.
 */
function RailNode({
  mainPos,
  push,
  zIndex,
  selected,
  children,
}: {
  mainPos: number;
  push: number;
  zIndex: number;
  selected: boolean;
  children: React.ReactNode;
}) {
  const cardCenter = mainPos + push;
  return (
    <div style={{ zIndex }}>
      {/* Blip on the rail at the true birth year */}
      <div
        className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-gold-soft shadow-[0_0_8px_2px_rgb(var(--gold)/0.55)]"
        style={{ left: RAIL_X, top: mainPos, transform: "translate(-50%, -50%)" }}
      />
      <RailConnector fromY={mainPos} toY={cardCenter} selected={selected} />
      <div
        className="absolute"
        style={{ left: CARD_X, top: cardCenter, transform: "translateY(-50%)" }}
      >
        {children}
      </div>
    </div>
  );
}

/** Elbow leader from the rail dot (fromY) to the card centre (toY). */
function RailConnector({
  fromY,
  toY,
  selected,
}: {
  fromY: number;
  toY: number;
  selected: boolean;
}) {
  const top = Math.min(fromY, toY);
  const height = Math.max(1, Math.abs(toY - fromY));
  const width = CARD_X - RAIL_X;
  const y1 = fromY - top;
  const y2 = toY - top;
  const midX = width * 0.5;
  const op = selected ? 0.75 : 0.4;
  return (
    <svg
      className="pointer-events-none absolute overflow-visible text-gold"
      style={{ left: RAIL_X, top, width, height }}
      width={width}
      height={height}
      fill="none"
    >
      {/* horizontal off the rail → vertical to the card row → into the card */}
      <path
        d={`M0 ${y1} H ${midX} V ${y2} H ${width}`}
        stroke="currentColor"
        strokeWidth={1}
        style={{ opacity: op }}
      />
    </svg>
  );
}
