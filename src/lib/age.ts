import type { Person } from "../types";

export const CURRENT_YEAR = new Date().getFullYear();

/** The earliest year the timeline supports. */
export const MIN_YEAR = 1700;
/** A little breathing room beyond the current year. */
export const MAX_YEAR = CURRENT_YEAR + 4;

/**
 * Age the person is (or would be) today. For people with a death year we
 * report the age reached, so historical figures still read sensibly.
 */
export function currentAge(person: Person): number {
  const end = person.deathYear ?? CURRENT_YEAR;
  return Math.max(0, end - person.birthYear);
}

export function isDeceased(person: Person): boolean {
  return person.deathYear != null;
}

export interface Comparison {
  older: Person;
  younger: Person;
  /** Absolute difference in birth years. */
  gap: number;
  /** The older person's age when the younger was born. */
  olderAgeAtYoungerBirth: number;
  sameYear: boolean;
}

export function compare(a: Person, b: Person): Comparison {
  const [older, younger] =
    a.birthYear <= b.birthYear ? [a, b] : [b, a];
  const gap = younger.birthYear - older.birthYear;
  return {
    older,
    younger,
    gap,
    olderAgeAtYoungerBirth: gap,
    sameYear: a.birthYear === b.birthYear,
  };
}
