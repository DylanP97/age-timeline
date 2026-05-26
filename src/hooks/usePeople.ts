import { useCallback, useEffect, useRef, useState } from "react";
import type { Person } from "../types";
import { loadPeople, makeId, savePeople } from "../lib/storage";
import { buildStarterPeople } from "../data/starterPeople";
import { fetchPortrait } from "../lib/searchCelebrity";

/** Owns the people collection and keeps it mirrored to localStorage. */
export function usePeople() {
  const freshlySeeded = useRef(false);
  const [people, setPeople] = useState<Person[]>(() => {
    const stored = loadPeople();
    if (stored && stored.length > 0) return stored;
    freshlySeeded.current = true;
    return buildStarterPeople();
  });

  useEffect(() => {
    savePeople(people);
  }, [people]);

  // On a fresh seed, hydrate the starter portraits from the web (best-effort).
  // The enriched images then persist, so this only runs the very first time.
  // The ref guard makes it idempotent under React 18 StrictMode double-invoke;
  // we deliberately don't cancel in flight, so the fetches still complete.
  useEffect(() => {
    if (!freshlySeeded.current) return;
    freshlySeeded.current = false;
    const targets = people.filter((p) => !p.imageUrl);
    targets.forEach(async (person) => {
      const imageUrl = await fetchPortrait(person.name);
      if (!imageUrl) return;
      setPeople((prev) =>
        prev.map((p) =>
          p.id === person.id && !p.imageUrl ? { ...p, imageUrl } : p,
        ),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addPerson = useCallback((person: Omit<Person, "id">) => {
    const created: Person = { ...person, id: makeId() };
    setPeople((prev) => [...prev, created]);
    return created;
  }, []);

  const removePerson = useCallback((id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearAll = useCallback(() => setPeople([]), []);

  const resetToStarter = useCallback(
    () => setPeople(buildStarterPeople()),
    [],
  );

  return { people, addPerson, removePerson, clearAll, resetToStarter };
}
