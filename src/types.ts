export type PersonType = "custom" | "celebrity";

export interface Person {
  id: string;
  name: string;
  birthYear: number;
  /** Optional year of death — people may be historical. */
  deathYear?: number;
  imageUrl?: string;
  type: PersonType;
}

/** Shape returned by the celebrity search abstraction. */
export interface CelebrityResult {
  name: string;
  birthYear: number;
  deathYear?: number;
  imageUrl?: string;
  /** Short descriptor, e.g. "Physicist" — used to disambiguate matches. */
  blurb?: string;
}
