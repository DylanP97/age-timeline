/**
 * CRT phosphor-screen overlays. Pure CSS, pointer-events: none — these sit
 * above the timeline trace and sell the "scientific readout" surface:
 *  - graticule: an even oscilloscope-style division grid, anchored to the
 *    screen (it does not pan — only the trace beneath it moves);
 *  - scanlines: fine horizontal phosphor lines;
 *  - bloom + vignette: the curved glass glow, brighter at the centre;
 *  - a barely-there flicker on the whole screen.
 *
 * Strength is theme-driven via --grid-a / --scan-a (both ~0 on the light
 * "paper printout" theme).
 */
export function ScreenFX() {
  return (
    <div
      data-flicker
      className="pointer-events-none absolute inset-0 z-[1] animate-flicker"
      aria-hidden
    >
      {/* graticule — even division grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(var(--gold) / var(--grid-a)) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--gold) / var(--grid-a)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* scanlines */}
      <div
        className="absolute inset-0"
        style={{
          opacity: "var(--scan-a)",
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgb(0 0 0 / 0.18) 0px, rgb(0 0 0 / 0.18) 1px, transparent 1px, transparent 3px)",
        }}
      />
      {/* curved-glass bloom: brighter centre, darker edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 50%, transparent 55%, rgb(var(--ink-900) / 0.9) 100%)",
        }}
      />
    </div>
  );
}
