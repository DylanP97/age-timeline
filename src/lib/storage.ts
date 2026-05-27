import type { Person } from "../types";

const KEY = "how-old-is.people.v1";

export function loadPeople(): Person[] | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(isValidPerson);
  } catch {
    return null;
  }
}

export function savePeople(people: Person[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(people));
  } catch {
    /* storage may be unavailable (private mode); fail silently */
  }
}

function isValidPerson(p: unknown): p is Person {
  return (
    typeof p === "object" &&
    p !== null &&
    typeof (p as Person).id === "string" &&
    typeof (p as Person).name === "string" &&
    typeof (p as Person).birthYear === "number"
  );
}

export function makeId(): string {
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
