/**
 * Mobile (vertical) layout geometry. On phones the timeline is a single column:
 * a fixed rail near the left edge, with one wide row per person to its right.
 * Shared so Timeline and YearGrid agree on where the gutter sits.
 */

/** X of the timeline rail from the left edge, in px. */
export const RAIL_X = 46;

/** X where the person-row column begins (rail + short leader stub), in px. */
export const CARD_X = RAIL_X + 18;

/** Footprint (px) of a vertical row card along the column, used for de-overlap. */
export const ROW_HEIGHT = 64;
