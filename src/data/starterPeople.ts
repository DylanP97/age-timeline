import type { Person } from "../types";
import { CELEBRITY_DB } from "./celebrities";

const STARTER_NAMES = [
  "Leonardo da Vinci", // b. 1452 — Renaissance
  "Wolfgang Amadeus Mozart", // b. 1756 — 18th century
  "Ada Lovelace", // b. 1815 — 19th century
  "Marie Curie", // b. 1867 — Belle Époque
  "Frida Kahlo", // b. 1907 — early 20th century
  "Nelson Mandela", // b. 1918 — Greatest Generation
  "Martin Luther King Jr.", // b. 1929 — Silent Generation
  "Stephen Hawking", // b. 1942 — postwar
  "Freddie Mercury", // b. 1946 — Boomer
  "Michael Jordan", // b. 1963 — Gen X
  "Serena Williams", // b. 1981 — Millennial
  "Greta Thunberg", // b. 2003 — Gen Z
];

/**
 * Seed people shown the first time someone opens the instrument. Birth/death
 * years come from the bundled dataset, but portraits are intentionally left
 * blank — they're fetched from the web on first load (see usePeople), so no
 * images are hardcoded here.
 */
export function buildStarterPeople(): Person[] {
  return STARTER_NAMES.map((name, i) => {
    const c = CELEBRITY_DB.find((entry) => entry.name === name)!;
    return {
      id: `starter-${i}`,
      name: c.name,
      birthYear: c.birthYear,
      deathYear: c.deathYear,
      type: "celebrity" as const,
    };
  });
}
