import type { CelebrityResult } from "../types";
import type { CelebrityProvider } from "./searchCelebrity";

/**
 * Live celebrity provider backed by public Wikimedia APIs (no key required).
 *
 *   1. Wikipedia full-text search ranks the *famous* person first even for an
 *      ambiguous query like "Trump" — and hands back a portrait thumbnail,
 *      short description and the page's Wikidata id in a single call.
 *   2. Wikidata resolves the structured birth (P569) / death (P570) years for
 *      those ids. Only entries that actually have a birth year are kept, which
 *      filters the results down to dated people.
 *
 * Both endpoints are CORS-enabled via `origin=*`, so this runs in the browser.
 */
const WIKIPEDIA = "https://en.wikipedia.org/w/api.php";
const WIKIDATA = "https://www.wikidata.org/w/api.php";

interface WikiPage {
  index: number;
  title: string;
  description?: string;
  thumbnail?: { source: string };
  pageprops?: { wikibase_item?: string };
}

export const webProvider: CelebrityProvider = {
  search(query, signal) {
    const q = query.trim();
    if (!q) return Promise.resolve([]);
    return searchPeople(q, signal);
  },
};

/**
 * Genuinely related figures for a known person, via Wikipedia's `morelike:`
 * relevance — it ranks articles by textual similarity to the named page, so a
 * rapper surfaces other rappers, a physicist other physicists, etc. Far better
 * "relatedness" than any small curated heuristic. Best-effort: returns [] on
 * failure. The person themselves is filtered out by the caller.
 */
export async function fetchRelated(
  name: string,
  signal?: AbortSignal,
): Promise<CelebrityResult[]> {
  const n = name.trim();
  if (!n) return [];
  const results = await searchPeople(`morelike:${n}`, signal, 20);
  return results.filter((r) => r.name.toLowerCase() !== n.toLowerCase());
}

/**
 * Shared pipeline: run a Wikipedia full-text search (any `gsrsearch` profile,
 * including `morelike:`), then resolve birth/death years from Wikidata and keep
 * only dated people, preserving relevance order.
 */
async function searchPeople(
  gsrsearch: string,
  signal?: AbortSignal,
  limit = 8,
): Promise<CelebrityResult[]> {
  const searchUrl =
    `${WIKIPEDIA}?action=query&format=json&origin=*` +
    `&generator=search&gsrsearch=${encodeURIComponent(gsrsearch)}&gsrlimit=${limit}` +
    `&prop=pageprops|pageimages|description` +
    `&piprop=thumbnail&pithumbsize=240&ppprop=wikibase_item`;
  const res = await fetch(searchUrl, { signal });
  if (!res.ok) throw new Error(`wikipedia search ${res.status}`);
  const json = await res.json();

  const pages: WikiPage[] = Object.values(json.query?.pages ?? {});
  pages.sort((a, b) => a.index - b.index); // restore relevance order
  const ids = pages
    .map((p) => p.pageprops?.wikibase_item)
    .filter((id): id is string => Boolean(id));
  if (ids.length === 0) return [];

  const years = await fetchYears(ids, signal);

  const results: CelebrityResult[] = [];
  for (const page of pages) {
    const id = page.pageprops?.wikibase_item;
    const life = id ? years.get(id) : undefined;
    if (!life || life.birthYear == null) continue; // keep only dated people
    results.push({
      name: page.title,
      birthYear: life.birthYear,
      deathYear: life.deathYear,
      imageUrl: page.thumbnail?.source,
      blurb: page.description,
    });
  }
  return results;
}

async function fetchYears(
  ids: string[],
  signal?: AbortSignal,
): Promise<Map<string, { birthYear: number | null; deathYear?: number }>> {
  const url =
    `${WIKIDATA}?action=wbgetentities&props=claims&format=json&origin=*` +
    `&ids=${ids.join("|")}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`wikidata entities ${res.status}`);
  const json = await res.json();

  const out = new Map<string, { birthYear: number | null; deathYear?: number }>();
  for (const id of ids) {
    const claims = json.entities?.[id]?.claims ?? {};
    out.set(id, {
      birthYear: yearFromClaim(claims.P569),
      deathYear: yearFromClaim(claims.P570) ?? undefined,
    });
  }
  return out;
}

/** Wikidata time values look like "+1946-06-14T00:00:00Z" (or "-0469-…" BCE). */
function yearFromClaim(claim: unknown): number | null {
  if (!Array.isArray(claim) || claim.length === 0) return null;
  const time: string | undefined = claim[0]?.mainsnak?.datavalue?.value?.time;
  if (!time) return null;
  const m = /^([+-])0*(\d+)/.exec(time);
  if (!m) return null;
  const year = parseInt(m[2], 10);
  return m[1] === "-" ? -year : year;
}
