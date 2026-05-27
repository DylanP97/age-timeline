/**
 * Atmosphere overlays. Pure CSS, pointer-events: none — these sit above the
 * timeline trace and lend the surface depth without any "screen" gimmickry:
 *  - a faint decade/year grid, anchored to the viewport (it does not pan —
 *    only the trace beneath it moves);
 *  - a soft vignette that darkens the edges and draws the eye to the centre.
 *
 * Strength is theme-driven via --grid-a (very low in both themes).
 */
export function ScreenFX() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
      {/* faint reference grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(var(--gold) / var(--grid-a)) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--gold) / var(--grid-a)) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* vignette: light centre, shadowed edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 50%, transparent 58%, rgb(var(--ink-900) / 0.85) 100%)",
        }}
      />
    </div>
  );
}
