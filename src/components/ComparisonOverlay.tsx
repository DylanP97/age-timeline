import type { Comparison } from "../lib/age";
import { Portrait } from "./Portrait";

interface Props {
  comparison: Comparison;
  onClose: () => void;
}

/** Small contextual readout shown when two people are selected. */
export function ComparisonOverlay({ comparison, onClose }: Props) {
  const { older, younger, gap, sameYear } = comparison;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center px-4 md:bottom-8">
      <div className="pointer-events-auto w-full max-w-md animate-fade-up rounded-2xl border border-gold/25 bg-ink-800/85 px-5 py-4 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between">
          <span className="font-display text-[17px] italic text-gold/80">
            Comparison
          </span>
          <button
            onClick={onClose}
            aria-label="Close comparison"
            className="text-frost-dim transition hover:text-frost"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-3 flex items-center justify-center gap-4">
          <Figure name={older.name} image={older.imageUrl} year={older.birthYear} />
          <div className="flex flex-col items-center">
            <span className="font-display text-4xl leading-none text-gold-soft">
              {gap}
            </span>
            <span className="mt-0.5 font-sans text-[11px] tracking-wide text-frost-dim">
              {gap === 1 ? "year" : "years"} apart
            </span>
          </div>
          <Figure name={younger.name} image={younger.imageUrl} year={younger.birthYear} />
        </div>

        <p className="mt-3 text-center font-display text-[15px] italic leading-snug text-frost">
          {sameYear ? (
            <>
              {older.name} and {younger.name} were both born in {older.birthYear}.
            </>
          ) : (
            <>
              <span className="text-gold-soft">{older.name}</span> and{" "}
              <span className="text-gold-soft">{younger.name}</span> are{" "}
              <span className="text-gold-soft">{gap}</span>{" "}
              {gap === 1 ? "year" : "years"} apart.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function Figure({
  name,
  image,
  year,
}: {
  name: string;
  image?: string;
  year: number;
}) {
  return (
    <div className="flex w-24 flex-col items-center text-center">
      <Portrait name={name} imageUrl={image} size={40} />
      <span className="mt-1.5 truncate w-full font-sans text-[11px] text-frost" title={name}>
        {name.split(" ")[0]}
      </span>
      <span className="font-sans text-[11px] tabular-nums text-frost-dim">{year}</span>
    </div>
  );
}
