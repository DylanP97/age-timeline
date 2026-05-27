import { useState } from "react";

interface Props {
  name: string;
  imageUrl?: string;
  size: number;
  deceased?: boolean;
}

/** Round portrait with a graceful initials fallback when no image loads. */
export function Portrait({ name, imageUrl, size, deceased }: Props) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full ring-1 ring-gold/40"
      style={{
        width: size,
        height: size,
        boxShadow: "0 0 0 1px rgb(var(--gold) / 0.18), 0 0 18px -4px rgb(var(--gold) / 0.5)",
      }}
    >
      {imageUrl && !failed ? (
        <>
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            draggable={false}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
            style={{
              filter: deceased
                ? "grayscale(0.7) contrast(0.95) sepia(0.25)"
                : "contrast(1.05) saturate(0.85) sepia(0.18)",
            }}
          />
          {/* faint warm wash so portraits sit in the candle-lit palette */}
          <div
            className="pointer-events-none absolute inset-0 mix-blend-overlay"
            style={{ background: "rgb(var(--gold) / 0.12)" }}
          />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-500 to-ink-700">
          <span
            className="font-display text-frost-dim"
            style={{ fontSize: size * 0.4 }}
          >
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}
