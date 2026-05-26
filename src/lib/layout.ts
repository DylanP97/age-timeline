import type { Person } from "../types";
import type { Orientation } from "../hooks/useTimelineView";

export type Side = "primary" | "secondary";

export interface Placement {
  side: Side;
  lane: number;
}

/** Main-axis footprint of a card (px) used for collision, plus a gap. */
const FOOTPRINT = {
  horizontal: 132, // card width
  vertical: 70, // card height
};
const GAP = 16;

/**
 * Assigns each person to a side of the line and a "lane" (distance from it)
 * so that cards never overlap along the main axis. Depends only on relative
 * positions (year × zoom), not on scroll, so it's cheap to memoize.
 *
 * Sides alternate by chronological order to keep the line visually balanced.
 */
export function assignLanes(
  people: Person[],
  pxPerYear: number,
  orientation: Orientation,
): Map<string, Placement> {
  const sorted = [...people].sort((a, b) => a.birthYear - b.birthYear);
  const half = (FOOTPRINT[orientation] + GAP) / 2;
  const result = new Map<string, Placement>();

  // Last occupied main-axis position per (side, lane).
  const laneEnds: Record<Side, number[]> = { primary: [], secondary: [] };

  sorted.forEach((person, i) => {
    const side: Side = i % 2 === 0 ? "primary" : "secondary";
    const center = (person.birthYear) * pxPerYear; // scroll-independent
    const ends = laneEnds[side];
    let lane = ends.findIndex((end) => center - half > end);
    if (lane === -1) {
      lane = ends.length;
      ends.push(center + half);
    } else {
      ends[lane] = center + half;
    }
    result.set(person.id, { side, lane });
  });

  return result;
}
