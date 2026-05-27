import type { Person } from "../types";
import { CELEBRITY_DB } from "./celebrities";

// A mix that lands the first-load view among living figures (the modern era is
// framed first; see App's INITIAL_VIEW_START) while still trailing back into
// history a pan away. Living people are deliberately the majority so a newcomer
// asking "how old is …" sees ages still ticking, not only memorials.
const STARTER_NAMES = [
  "Leonardo da Vinci", // b. 1452 — Renaissance
  "Benjamin Franklin", // b. 1706 — Enlightenment
  "Wolfgang Amadeus Mozart", // b. 1756 — 18th century
  "Jane Austen", // b. 1775 — Georgian letters
  "Ada Lovelace", // b. 1815 — 19th century
  "Queen Victoria", // b. 1819 — Victorian era
  "Vincent van Gogh", // b. 1853 — Post-Impressionism
  "Nikola Tesla", // b. 1856 — age of electricity
  "Marie Curie", // b. 1867 — Belle Époque
  "Frida Kahlo", // b. 1907 — early 20th century
  "Nelson Mandela", // b. 1918 — Greatest Generation
  "Audrey Hepburn", // b. 1929 — Belgian-British screen
  "Yuri Gagarin", // b. 1934 — Soviet space age
  "Pelé", // b. 1940 — Brazilian sport
  "Oprah Winfrey", // b. 1954 — living, media
  "Michael Jackson", // b. 1958 — pop music
  "Barack Obama", // b. 1961 — living, statecraft
  "Keanu Reeves", // b. 1964 — living, screen
  "Leonardo DiCaprio", // b. 1974 — living, screen
  "Serena Williams", // b. 1981 — living, sport
  "Beyoncé", // b. 1981 — living, music
  "LeBron James", // b. 1984 — living, sport
  "Lionel Messi", // b. 1987 — living, sport
  "Taylor Swift", // b. 1989 — living, music
  "Greta Thunberg", // b. 2003 — living, Gen Z
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
      birthDate: c.birthDate,
      deathYear: c.deathYear,
      deathDate: c.deathDate,
      type: "celebrity" as const,
    };
  });
}
