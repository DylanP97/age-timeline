import { useState } from "react";
import type { Person } from "../types";
import { CURRENT_YEAR, MIN_YEAR } from "../lib/age";
import { Modal } from "./Modal";

interface Props {
  onClose: () => void;
  onAdd: (person: Omit<Person, "id">) => void;
}

export function AddPersonModal({ onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const trimmed = name.trim();
    const year = parseInt(birthYear, 10);
    if (!trimmed) return setError("A name is required.");
    if (!Number.isFinite(year)) return setError("Enter a birth year.");
    if (year < MIN_YEAR || year > CURRENT_YEAR)
      return setError(`Year must be between ${MIN_YEAR} and ${CURRENT_YEAR}.`);

    onAdd({
      name: trimmed,
      birthYear: year,
      imageUrl: imageUrl.trim() || undefined,
      type: "custom",
    });
    onClose();
  };

  return (
    <Modal
      title="Add a person"
      subtitle="Place anyone on the line by their birth year."
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="space-y-4"
      >
        <Field label="Name">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ada Lovelace"
            className={inputCls}
          />
        </Field>

        <Field label="Birth year">
          <input
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value.replace(/[^0-9]/g, ""))}
            inputMode="numeric"
            placeholder={`${MIN_YEAR} – ${CURRENT_YEAR}`}
            className={inputCls}
          />
        </Field>

        <Field label="Portrait image URL" hint="optional">
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…"
            className={inputCls}
          />
        </Field>

        {error && <p className="text-[12px] text-rose-300/90">{error}</p>}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-frost/10 py-2.5 font-sans text-sm text-frost-dim transition hover:bg-frost/5 hover:text-frost"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg border border-gold/40 bg-gold/10 py-2.5 font-sans text-sm text-gold-soft transition hover:bg-gold/20"
          >
            Place on timeline
          </button>
        </div>
      </form>
    </Modal>
  );
}

const inputCls =
  "w-full rounded-lg border border-frost/10 bg-ink-700/60 px-3.5 py-2.5 font-sans text-[15px] text-frost placeholder:text-frost-dim/50 outline-none transition focus:border-gold/50 focus:bg-ink-700";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-frost-dim">
          {label}
        </span>
        {hint && <span className="text-[10px] text-frost-dim/50">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
