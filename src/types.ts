export type PersonType = "custom" | "celebrity";

export interface Person {
  id: string;
  name: string;
  birthYear: number;
  /**
   * Full date of birth as ISO "YYYY-MM-DD", when the day/month are known.
   * `birthYear` stays the canonical field for timeline positioning; this is the
   * precision layer that lets us age people correctly against today's date.
   */
  birthDate?: string;
  /** Optional year of death — people may be historical. */
  deathYear?: number;
  /** Full date of death as ISO "YYYY-MM-DD", when known. */
  deathDate?: string;
  imageUrl?: string;
  type: PersonType;
}

/** Shape returned by the celebrity search abstraction. */
export interface CelebrityResult {
  name: string;
  birthYear: number;
  birthDate?: string;
  deathYear?: number;
  deathDate?: string;
  imageUrl?: string;
  /** Short descriptor, e.g. "Physicist" — used to disambiguate matches. */
  blurb?: string;
}
