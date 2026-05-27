import { useState } from "react";
import type { Person } from "../types";
import { CURRENT_YEAR, MIN_YEAR } from "../lib/age";
import { Modal } from "./Modal";

interface Props {
  onClose: () => void;
  onAdd: (person: Omit<Person, "id">) => void;
}

const TODAY_ISO = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, local

export function AddPersonModal({ onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [deathDate, setDeathDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return setError("A name is required.");
    if (!birthDate) return setError("Enter a date of birth.");

    const birthYear = parseInt(birthDate.slice(0, 4), 10);
    if (birthYear < MIN_YEAR || birthYear > CURRENT_YEAR)
      return setError(`Birth year must be between ${MIN_YEAR} and ${CURRENT_YEAR}.`);

    if (deathDate && deathDate < birthDate)
      return setError("Date of death can't be before birth.");

    onAdd({
      name: trimmed,
      birthYear,
      birthDate,
      deathYear: deathDate ? parseInt(deathDate.slice(0, 4), 10) : undefined,
      deathDate: deathDate || undefined,
      imageUrl: imageUrl.trim() || undefined,
      type: "custom",
    });
    onClose();
  };

  return (
    <Modal
      title="Add a custom person"
      subtitle="Place anyone on the line by their date of birth."
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

        <Field label="Date of birth">
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            min={`${MIN_YEAR}-01-01`}
            max={TODAY_ISO}
            className={inputCls}
          />
        </Field>

        <Field label="Date of death" hint="optional">
          <input
            type="date"
            value={deathDate}
            onChange={(e) => setDeathDate(e.target.value)}
            min={birthDate || `${MIN_YEAR}-01-01`}
            max={TODAY_ISO}
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
            Place custom person on timeline
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
        <span className="font-sans text-[13px] text-frost-dim">
          {label}
        </span>
        {hint && <span className="text-[10px] text-frost-dim/50">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
