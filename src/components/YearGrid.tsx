import { useMemo } from "react";
import type { TimelineView } from "../hooks/useTimelineView";
import { MAX_YEAR, MIN_YEAR } from "../lib/age";
import { RAIL_X } from "../lib/geometry";

const STEPS = [1, 2, 5, 10, 25, 50, 100];

// Round milestones for the faint background era marks (decades → centuries).
const ANCHOR_STEPS = [10, 50, 100, 200, 500];

/** Subtle decade/year grid that adapts its density to the zoom level. */
export function YearGrid({ view }: { view: TimelineView }) {
  const horizontal = view.orientation === "horizontal";

  const ticks = useMemo(() => {
    // Aim for a comfortable ~80px between labels.
    const target = 80 / view.pxPerYear;
    const step = STEPS.find((s) => s >= target) ?? 200;
    const minorStep =
      step >= 10 ? step / (step >= 50 ? 5 : 5) : Math.max(1, step / 5);

    const start = Math.max(MIN_YEAR, Math.floor(view.visible.startYear / step) * step);
    const end = Math.min(MAX_YEAR, view.visible.endYear);

    const out: { year: number; major: boolean }[] = [];
    const first = Math.floor(view.visible.startYear / minorStep) * minorStep;
    for (let y = Math.max(MIN_YEAR, first); y <= end; y += minorStep) {
      out.push({ year: y, major: y % step === 0 });
    }
    // Guarantee majors present even if minorStep math drifts.
    for (let y = start; y <= end; y += step) {
      if (!out.some((t) => t.year === y)) out.push({ year: y, major: true });
    }
    return out.sort((a, b) => a.year - b.year);
  }, [view.pxPerYear, view.visible.startYear, view.visible.endYear]);

  // Sparse round-number anchors (1900, 2000, or decades when zoomed in),
  // shown as large, very faint ghost numbers for ambient orientation.
  const anchors = useMemo(() => {
    const target = 320 / view.pxPerYear;
    const step = ANCHOR_STEPS.find((s) => s >= target) ?? 1000;
    const start = Math.floor(view.visible.startYear / step) * step;
    const end = Math.min(MAX_YEAR, view.visible.endYear);
    const out: number[] = [];
    for (let y = Math.max(MIN_YEAR, start); y <= end; y += step) out.push(y);
    return out;
  }, [view.pxPerYear, view.visible.startYear, view.visible.endYear]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Faint era marks — desktop only; on the mobile rail they'd sit under
          the card column, so we drop them there. */}
      {horizontal && anchors.map((year) => {
        const pos = view.posOf(year);
        return (
          <span
            key={`anchor-${year}`}
            className="absolute select-none font-display text-[44px] font-light leading-none text-frost-dim/15"
            style={
              horizontal
                ? { left: pos, top: "calc(50% - 64px)", transform: "translate(-50%, -50%)" }
                : { top: pos, left: "calc(50% + 56px)", transform: "translate(0, -50%)" }
            }
          >
            {year}
          </span>
        );
      })}

      {ticks.map(({ year, major }) => {
        const pos = view.posOf(year);
        // Vertical container spans the full width so the major rule and the
        // gutter label can be placed in absolute screen-x coordinates.
        const style: React.CSSProperties = horizontal
          ? { left: pos }
          : { top: pos, left: 0, right: 0 };
        return (
          <div key={year} className="absolute" style={style}>
            {major ? (
              /* major division — a faint amber graduation line */
              <div
                className={horizontal ? "absolute top-0" : "absolute left-0"}
                style={
                  horizontal
                    ? {
                        width: 1,
                        height: "100%",
                        background:
                          "linear-gradient(180deg, transparent, rgb(var(--gold) / 0.09) 20%, rgb(var(--gold) / 0.09) 80%, transparent)",
                      }
                    : {
                        height: 1,
                        width: "100%",
                        background:
                          "linear-gradient(90deg, transparent, rgb(var(--gold) / 0.09) 20%, rgb(var(--gold) / 0.09) 80%, transparent)",
                      }
                }
              />
            ) : (
              /* minor graduation — a short tick straddling the trace */
              <div
                className="absolute bg-gold/30"
                style={{
                  left: horizontal ? 0 : RAIL_X,
                  top: horizontal ? "50%" : 0,
                  width: horizontal ? 1 : 7,
                  height: horizontal ? 7 : 1,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
            {/* label */}
            {major && (
              <span
                className={[
                  "absolute whitespace-nowrap font-sans tabular-nums tracking-wide text-frost-dim/80",
                  horizontal ? "bottom-3 -translate-x-1/2 text-[11px]" : "text-[10px]",
                ].join(" ")}
                // Vertical: right-align in the gutter, just left of the rail.
                style={horizontal ? undefined : { left: RAIL_X - 8, transform: "translate(-100%, -50%)" }}
              >
                {year}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
