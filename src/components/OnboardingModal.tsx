import { useState, useMemo } from "react";
import type { Person } from "../types";
import { CURRENT_YEAR, MIN_YEAR, compare } from "../lib/age";
import { Modal } from "./Modal";
import { CELEBRITY_DB } from "../data/celebrities";
import { Portrait } from "./Portrait";

interface Props {
  onComplete: (user: Omit<Person, "id">) => void;
}

const TODAY_ISO = new Date().toLocaleDateString("en-CA");

export function OnboardingModal({ onComplete }: Props) {
  const [step, setStep] = useState<"intro" | "reveal">("intro");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Pick a random celebrity for the comparison reveal
  const randomCelebrity = useMemo(() => {
    const idx = Math.floor(Math.random() * CELEBRITY_DB.length);
    return CELEBRITY_DB[idx];
  }, []);

  const handleContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) return setError("A name is required.");
    if (!birthDate) return setError("Enter your date of birth.");

    const birthYear = parseInt(birthDate.slice(0, 4), 10);
    if (birthYear < MIN_YEAR || birthYear > CURRENT_YEAR) {
      return setError(`Birth year must be between ${MIN_YEAR} and ${CURRENT_YEAR}.`);
    }

    setStep("reveal");
  };

  const handleFinish = () => {
    onComplete({
      name: name.trim(),
      birthYear: parseInt(birthDate.slice(0, 4), 10),
      birthDate,
      type: "custom",
    });
  };

  if (step === "reveal") {
    const userPerson: Person = {
      id: "temp-user",
      name: name.trim(),
      birthYear: parseInt(birthDate.slice(0, 4), 10),
      birthDate,
      type: "custom",
    };

    const celebPerson: Person = {
      id: "temp-celeb",
      ...randomCelebrity,
      type: "celebrity",
    };

    const comparison = compare(userPerson, celebPerson);

    return (
      <Modal title="Welcome!" onClose={handleFinish}>
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex items-center justify-center gap-6">
             <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-gold/30 shadow-lg">
                <div className="flex h-full w-full items-center justify-center bg-ink-700 text-2xl font-display text-gold">
                  {name.trim().charAt(0).toUpperCase()}
                </div>
             </div>
             <Portrait 
               name={celebPerson.name} 
               imageUrl={celebPerson.imageUrl} 
               size={96} 
               deceased={celebPerson.deathYear != null}
             />
          </div>
          
          <h3 className="mb-2 font-display text-xl text-frost">
            Hi {name.trim()}!
          </h3>
          <p className="mb-8 font-sans text-[15px] leading-relaxed text-frost-dim">
            You are <span className="text-gold font-medium">{comparison.gap} years</span> apart from <span className="text-frost font-medium">{celebPerson.name}</span>.
            {comparison.gap === 0 ? " You were born in the same year!" : 
             comparison.older.id === "temp-user" ? ` You were born ${comparison.gap} years before them.` : 
             ` They were born ${comparison.gap} years before you.`}
          </p>

          <button
            onClick={handleFinish}
            className="w-full rounded-lg border border-gold/40 bg-gold/10 py-3 font-sans text-sm font-medium text-gold-soft transition hover:bg-gold/20 active:scale-[0.98]"
          >
            Start exploring the timeline
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Welcome to Age Timeline"
      subtitle="Discover how your life intersects with history and icons."
      onClose={() => {}} // Disable closing via X or ESC for onboarding
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleContinue();
        }}
        className="space-y-5"
      >
        <Field label="What's your name?">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={inputCls}
          />
        </Field>

        <Field label="When were you born?">
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            min={`${MIN_YEAR}-01-01`}
            max={TODAY_ISO}
            className={inputCls}
          />
        </Field>

        {error && <p className="text-[12px] text-rose-300/90">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg border border-gold/40 bg-gold/10 py-3 font-sans text-sm font-medium text-gold-soft transition hover:bg-gold/20 active:scale-[0.98]"
        >
          Continue
        </button>
      </form>
    </Modal>
  );
}

const inputCls =
  "w-full rounded-lg border border-frost/10 bg-ink-700/60 px-4 py-3 font-sans text-[15px] text-frost placeholder:text-frost-dim/50 outline-none transition focus:border-gold/50 focus:bg-ink-700";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-sans text-[14px] text-frost-dim">
        {label}
      </span>
      {children}
    </label>
  );
}
