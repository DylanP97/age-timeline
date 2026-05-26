import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_YEAR, MIN_YEAR } from "../lib/age";

export type Orientation = "horizontal" | "vertical";

const TOTAL_YEARS = MAX_YEAR - MIN_YEAR;
const MAX_PX_PER_YEAR = 64;
const FRICTION = 0.94; // inertial decay per frame
const MIN_VELOCITY = 0.02;
const EDGE_PAD = 96; // px of slack beyond the content on either end

export interface TimelineView {
  orientation: Orientation;
  pxPerYear: number;
  /** Content-space offset along the main axis, in pixels. */
  scroll: number;
  /** Length of the viewport along the main axis, in px. */
  viewportLength: number;
  /** Pixel position of a year relative to the viewport's start edge. */
  posOf: (year: number) => number;
  /** Year at a given pixel offset from the viewport's start edge. */
  yearAt: (px: number) => number;
  visible: { startYear: number; endYear: number };
  isDragging: boolean;
  /** Smoothly multiply zoom, anchored at a pixel (defaults to centre). */
  zoom: (factor: number, anchorPx?: number) => void;
  /** Smoothly bring a year to the centre of the viewport. */
  centerOnYear: (year: number) => void;
  /** Instantly frame a year range (with padding) — used for initial fit. */
  fit: (startYear: number, endYear: number, pad?: number) => void;
  ref: (el: HTMLElement | null) => void;
}

export function useTimelineView(orientation: Orientation): TimelineView {
  const elRef = useRef<HTMLElement | null>(null);
  const [viewportLength, setViewportLength] = useState(() =>
    typeof window === "undefined"
      ? 1000
      : orientation === "horizontal"
        ? window.innerWidth
        : window.innerHeight,
  );
  const [pxPerYear, setPxPerYear] = useState(8);
  const [scroll, setScroll] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Mutable mirrors so animation/event loops always read fresh values
  // without re-binding listeners on every render.
  const state = useRef({ pxPerYear, scroll, viewportLength, orientation });
  state.current = { pxPerYear, scroll, viewportLength, orientation };

  const minPxPerYear = Math.max(0.4, viewportLength / TOTAL_YEARS);

  const clampZoom = useCallback(
    (px: number) => Math.min(MAX_PX_PER_YEAR, Math.max(minPxPerYear, px)),
    [minPxPerYear],
  );

  const clampScroll = useCallback((s: number, px: number, vp: number) => {
    const content = TOTAL_YEARS * px;
    const max = Math.max(0, content - vp) + EDGE_PAD;
    return Math.min(max, Math.max(-EDGE_PAD, s));
  }, []);

  const posOf = useCallback(
    (year: number) =>
      (year - MIN_YEAR) * state.current.pxPerYear - state.current.scroll,
    [],
  );
  const yearAt = useCallback(
    (px: number) =>
      MIN_YEAR + (px + state.current.scroll) / state.current.pxPerYear,
    [],
  );

  // --- Animation: a single rAF loop services both inertia and smooth zoom ---
  const anim = useRef({
    raf: 0,
    velocity: 0, // scroll px/frame for inertial panning
    zoomTarget: 0, // target pxPerYear (0 = inactive)
    zoomAnchor: 0, // pixel the zoom should hold steady
  });

  const stopRaf = () => {
    if (anim.current.raf) cancelAnimationFrame(anim.current.raf);
    anim.current.raf = 0;
  };

  const tick = useCallback(() => {
    const a = anim.current;
    const { viewportLength: vp } = state.current;
    let busy = false;

    // Smooth zoom toward target, keeping the anchored year fixed.
    if (a.zoomTarget > 0) {
      const cur = state.current.pxPerYear;
      const next = cur + (a.zoomTarget - cur) * 0.22;
      const anchorYear = yearAt(a.zoomAnchor);
      const newScroll = (anchorYear - MIN_YEAR) * next - a.zoomAnchor;
      state.current.pxPerYear = next;
      state.current.scroll = clampScroll(newScroll, next, vp);
      setPxPerYear(next);
      setScroll(state.current.scroll);
      if (Math.abs(a.zoomTarget - next) < 0.05) {
        state.current.pxPerYear = a.zoomTarget;
        setPxPerYear(a.zoomTarget);
        a.zoomTarget = 0;
      } else {
        busy = true;
      }
    }

    // Inertial panning.
    if (Math.abs(a.velocity) > MIN_VELOCITY) {
      const next = clampScroll(
        state.current.scroll + a.velocity,
        state.current.pxPerYear,
        vp,
      );
      // Kill velocity if we hit an edge.
      if (next === state.current.scroll) a.velocity = 0;
      state.current.scroll = next;
      setScroll(next);
      a.velocity *= FRICTION;
      if (Math.abs(a.velocity) > MIN_VELOCITY) busy = true;
    }

    a.raf = busy ? requestAnimationFrame(tick) : 0;
  }, [clampScroll, yearAt]);

  const ensureRaf = useCallback(() => {
    if (!anim.current.raf) anim.current.raf = requestAnimationFrame(tick);
  }, [tick]);

  const zoom = useCallback(
    (factor: number, anchorPx?: number) => {
      const a = anim.current;
      const vp = state.current.viewportLength;
      const base = a.zoomTarget > 0 ? a.zoomTarget : state.current.pxPerYear;
      a.zoomTarget = clampZoom(base * factor);
      a.zoomAnchor = anchorPx ?? vp / 2;
      ensureRaf();
    },
    [clampZoom, ensureRaf],
  );

  const centerOnYear = useCallback(
    (year: number) => {
      const a = anim.current;
      const vp = state.current.viewportLength;
      a.velocity = 0;
      a.zoomTarget = 0;
      const target = clampScroll(
        (year - MIN_YEAR) * state.current.pxPerYear - vp / 2,
        state.current.pxPerYear,
        vp,
      );
      // Ease toward target via a short velocity-free animation.
      const start = state.current.scroll;
      const t0 = performance.now();
      const dur = 520;
      stopRaf();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        state.current.scroll = start + (target - start) * eased;
        setScroll(state.current.scroll);
        if (p < 1) anim.current.raf = requestAnimationFrame(step);
        else anim.current.raf = 0;
      };
      anim.current.raf = requestAnimationFrame(step);
    },
    [clampScroll],
  );

  const fit = useCallback(
    (startYear: number, endYear: number, pad = 0.14) => {
      const vp = state.current.viewportLength;
      const span = Math.max(1, endYear - startYear);
      const total = span + span * pad * 2;
      const px = clampZoom(vp / total);
      const centerYear = (startYear + endYear) / 2;
      const newScroll = clampScroll(
        (centerYear - MIN_YEAR) * px - vp / 2,
        px,
        vp,
      );
      anim.current.velocity = 0;
      anim.current.zoomTarget = 0;
      state.current.pxPerYear = px;
      state.current.scroll = newScroll;
      setPxPerYear(px);
      setScroll(newScroll);
    },
    [clampZoom, clampScroll],
  );

  // --- Event binding (wheel + pointer drag + pinch) ---
  const ref = useCallback(
    (el: HTMLElement | null) => {
      elRef.current = el;
    },
    [],
  );

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const len =
        orientation === "horizontal" ? el.clientWidth : el.clientHeight;
      setViewportLength(len);
      state.current.viewportLength = len;
    });
    ro.observe(el);

    const coord = (e: { clientX: number; clientY: number }) => {
      const rect = el.getBoundingClientRect();
      return orientation === "horizontal"
        ? e.clientX - rect.left
        : e.clientY - rect.top;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      // Pinch-zoom on trackpads arrives as ctrl+wheel; either way wheel zooms.
      const factor = Math.exp(-delta * 0.0015);
      zoom(factor, coord(e));
    };

    // Pointer drag + two-finger pinch.
    const pointers = new Map<number, { x: number; y: number }>();
    let startScroll = 0;
    let startCoord = 0;
    let lastCoord = 0;
    let lastTime = 0;
    let pinchStartDist = 0;
    let pinchStartPx = 0;

    const onPointerDown = (e: PointerEvent) => {
      // Presses that start on an interactive card (select / remove) must not be
      // hijacked into a pan — capturing the pointer here would swallow the
      // card's click. Let those flow to the card untouched.
      if ((e.target as HTMLElement | null)?.closest?.("[data-card]")) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      el.setPointerCapture(e.pointerId);
      anim.current.velocity = 0;
      anim.current.zoomTarget = 0;
      if (pointers.size === 1) {
        setIsDragging(true);
        startScroll = state.current.scroll;
        startCoord = coord(e);
        lastCoord = startCoord;
        lastTime = performance.now();
      } else if (pointers.size === 2) {
        const pts = [...pointers.values()];
        pinchStartDist = dist(pts[0], pts[1]);
        pinchStartPx = state.current.pxPerYear;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.size >= 2) {
        const pts = [...pointers.values()];
        const d = dist(pts[0], pts[1]);
        if (pinchStartDist > 0) {
          const rect = el.getBoundingClientRect();
          const mid =
            orientation === "horizontal"
              ? (pts[0].x + pts[1].x) / 2 - rect.left
              : (pts[0].y + pts[1].y) / 2 - rect.top;
          const target = clampZoom(pinchStartPx * (d / pinchStartDist));
          const anchorYear = yearAt(mid);
          state.current.pxPerYear = target;
          state.current.scroll = clampScroll(
            (anchorYear - MIN_YEAR) * target - mid,
            target,
            state.current.viewportLength,
          );
          setPxPerYear(target);
          setScroll(state.current.scroll);
        }
        return;
      }

      const c = coord(e);
      const next = clampScroll(
        startScroll - (c - startCoord),
        state.current.pxPerYear,
        state.current.viewportLength,
      );
      state.current.scroll = next;
      setScroll(next);

      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 0) {
        // velocity in scroll-px per frame (~16ms)
        anim.current.velocity = (-(c - lastCoord) / dt) * 16;
      }
      lastCoord = c;
      lastTime = now;
    };

    const endPointer = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchStartDist = 0;
      if (pointers.size === 0) {
        setIsDragging(false);
        // Hand off to inertia if there's meaningful velocity.
        if (Math.abs(anim.current.velocity) > MIN_VELOCITY) ensureRaf();
      } else if (pointers.size === 1) {
        // Re-seat the remaining pointer as the new drag origin.
        startScroll = state.current.scroll;
        startCoord = coord(e);
        lastCoord = startCoord;
        lastTime = performance.now();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endPointer);
    el.addEventListener("pointercancel", endPointer);

    return () => {
      ro.disconnect();
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endPointer);
      el.removeEventListener("pointercancel", endPointer);
    };
  }, [orientation, zoom, clampScroll, clampZoom, ensureRaf, yearAt]);

  // Re-clamp when the viewport (and thus the zoom floor) changes — e.g. rotate
  // or resize. Reads the live ref so the px/scroll pair is always consistent;
  // depending on `pxPerYear` here would let a stale closure over-clamp scroll
  // right after fit()/zoom() change both at once.
  useEffect(() => {
    const { pxPerYear: px, scroll: s, viewportLength: vp } = state.current;
    const cpx = clampZoom(px);
    const cs = clampScroll(s, cpx, vp);
    if (cpx !== px) {
      state.current.pxPerYear = cpx;
      setPxPerYear(cpx);
    }
    if (cs !== s) {
      state.current.scroll = cs;
      setScroll(cs);
    }
  }, [viewportLength, clampScroll, clampZoom]);

  useEffect(() => () => stopRaf(), []);

  const startYear = Math.floor(yearAt(0)) - 1;
  const endYear = Math.ceil(yearAt(viewportLength)) + 1;

  return {
    orientation,
    pxPerYear,
    scroll,
    viewportLength,
    posOf,
    yearAt,
    visible: { startYear, endYear },
    isDragging,
    zoom,
    centerOnYear,
    fit,
    ref,
  };
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
