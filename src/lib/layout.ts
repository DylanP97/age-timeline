import type { Person } from "../types";
import type { Orientation } from "../hooks/useTimelineView";
import { ROW_HEIGHT } from "./geometry";

export type Side = "primary" | "secondary";

export interface Placement {
  side: Side;
  lane: number;
}

/** How far (content-space px) a row's card is pushed down off its true-year dot. */
export interface Stack {
  push: number;
}

/** Main-axis footprint of a card (px) used for collision, plus a gap. */
const FOOTPRINT = {
  horizontal: 132, // card width
  vertical: 70, // card height
};
const GAP = 16;
const MAX_LANES = 3;

/**
 * Assigns each person to a side of the line and a "lane" (distance from it)
 * so that cards usually don't overlap, but they can "go behind" if there
 * are too many figures in one era.
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
    
    // Find a lane where we don't overlap
    let lane = ends.findIndex((end) => center - half > end);
    
    if (lane === -1) {
      if (ends.length < MAX_LANES) {
        // Create a new lane
        lane = ends.length;
        ends.push(center + half);
      } else {
        // Force into the lane that ends earliest (best fit / least overlap)
        let minEnd = ends[0];
        lane = 0;
        for (let j = 1; j < ends.length; j++) {
          if (ends[j] < minEnd) {
            minEnd = ends[j];
            lane = j;
          }
        }
        ends[lane] = center + half;
      }
    } else {
      ends[lane] = center + half;
    }
    
    result.set(person.id, { side, lane });
  });

  return result;
}

/**
 * Single-column layout for the vertical (mobile) rail. Every card hangs to the
 * right of the rail; the rail dot stays at the person's true year. Cards are
 * pushed down to avoid overlap, but we cap the push to allow "behind" stacking
 * when the timeline is crowded.
 */
export function stackColumn(
  people: Person[],
  pxPerYear: number,
): Map<string, Stack> {
  const sorted = [...people].sort((a, b) => a.birthYear - b.birthYear);
  const result = new Map<string, Stack>();

  // Bottom edge (content-space px) of the last card placed.
  let lastBottom = -Infinity;
  const MAX_PUSH = 120; // Allow stacking after this much displacement

  for (const person of sorted) {
    const center = person.birthYear * pxPerYear; // scroll-independent
    let top = center - ROW_HEIGHT / 2;
    
    if (top < lastBottom + GAP) {
      // If we'd have to push too far, start stacking (overlap) instead
      const desiredTop = lastBottom + GAP;
      if (desiredTop - top > MAX_PUSH) {
        top = top + MAX_PUSH;
      } else {
        top = desiredTop;
      }
    }
    
    // push = how far the card's centre sits below its true-year dot.
    result.set(person.id, { push: top + ROW_HEIGHT / 2 - center });
    lastBottom = top + ROW_HEIGHT;
  }

  return result;
}
