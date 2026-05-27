import type { Person } from "../types";

export const CURRENT_YEAR = new Date().getFullYear();

/** The earliest year the timeline supports. */
export const MIN_YEAR = 1700;
/** A little breathing room beyond the current year. */
export const MAX_YEAR = CURRENT_YEAR + 4;

/** Calendar parts of a date — avoids the JS Date two-digit-year trap for <100 AD. */
interface DateParts {
  year: number;
  month: number; // 1–12
  day: number; // 1–31
}

/** Parse an ISO "YYYY-MM-DD" string into parts, or null if absent/malformed. */
function partsFromISO(iso: string | undefined): DateParts | null {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return { year: +m[1], month: +m[2], day: +m[3] };
}

/** Today, as calendar parts in the viewer's local time zone. */
function today(): DateParts {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

/** Completed years from `birth` up to `end`, decremented if the day hasn't come round yet. */
function completedYears(birth: DateParts, end: DateParts): number {
  let age = end.year - birth.year;
  if (end.month < birth.month || (end.month === birth.month && end.day < birth.day)) {
    age -= 1;
  }
  return Math.max(0, age);
}

/**
 * Age the person is (or would be) today. With a known day/month of birth we
 * count completed years against today's date, so someone whose birthday is
 * still ahead this year reads one year younger. For a death we report the age
 * reached. Falls back to plain year arithmetic when only the year is known.
 */
export function currentAge(person: Person): number {
  const birth = partsFromISO(person.birthDate);

  if (person.deathYear != null || person.deathDate) {
    const death = partsFromISO(person.deathDate);
    if (birth && death) return completedYears(birth, death);
    const endYear = person.deathYear ?? death?.year ?? CURRENT_YEAR;
    return Math.max(0, endYear - person.birthYear);
  }

  if (birth) return completedYears(birth, today());
  return Math.max(0, CURRENT_YEAR - person.birthYear);
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
