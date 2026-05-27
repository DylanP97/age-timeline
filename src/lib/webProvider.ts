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
const WDQS = "https://query.wikidata.org/sparql";

/** How many years either side of the target counts as "the same generation". */
const ERA_WINDOW = 25;

/**
 * Maximally-broad "field" occupations (P106) that make poor relatedness signals
 * on their own: practically everyone in a field carries them, so querying peers
 * by "singer" returns whichever actors, DJs or opera stars merely *also* sing,
 * ranked by global fame — not the subject's actual kind of peer. We drop these
 * when a more specific occupation survives (e.g. keep "singer-songwriter", drop
 * "singer"), which both sharpens the results and shrinks the query's candidate
 * set. A subject whose *only* occupations are broad keeps them — better a wide
 * net than none.
 */
const UMBRELLA_OCCUPATIONS = new Set<string>([
  "Q177220", // singer
  "Q639669", // musician
  "Q33999", // actor
  "Q36180", // writer
  "Q482980", // author
  "Q82955", // politician
  "Q483501", // artist
  "Q2066131", // athlete (generic parent; specific sports survive)
  "Q43845", // businessperson
]);

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
 * Genuinely related figures for a known person — the peers you'd actually want
 * to drop onto an age-comparison timeline next to them.
 *
 * Primary signal is Wikidata's *structured* data, not text similarity: people
 * who share the target's occupation (P106), were born within a generation of
 * them, ranked by global fame (sitelink count), with portraits (P18). That
 * encodes the three things that make a great timeline peer — same kind of
 * person, same era, actually notable — instead of "whoever is co-mentioned in
 * their article", which is all a `morelike:` text search can offer.
 *
 * Falls back to `morelike:` if Wikidata is unavailable or yields nothing (e.g.
 * the person has no occupation recorded). Best-effort: returns [] on failure;
 * the person themselves is filtered out here and again by the caller.
 */
export async function fetchRelated(
  name: string,
  birthYear: number,
  signal?: AbortSignal,
): Promise<CelebrityResult[]> {
  const n = name.trim();
  if (!n) return [];

  try {
    const peers = await fetchPeersByOccupation(n, birthYear, signal);
    const usable = peers.filter((r) => r.name.toLowerCase() !== n.toLowerCase());
    if (usable.length > 0) return usable;
  } catch {
    // Wikidata down / slow / query error — fall through to text similarity.
  }

  const results = await searchPeople(`morelike:${n}`, signal, 20);
  return results.filter((r) => r.name.toLowerCase() !== n.toLowerCase());
}

/**
 * Resolve a name to its Wikidata id and occupation (P106) q-ids, then ask the
 * Wikidata Query Service for same-occupation contemporaries ranked by fame.
 */
async function fetchPeersByOccupation(
  name: string,
  birthYear: number,
  signal?: AbortSignal,
): Promise<CelebrityResult[]> {
  const target = await resolveOccupations(name, signal);
  if (!target || target.occupations.length === 0) return [];

  const values = target.occupations.map((q) => `wd:${q}`).join(" ");
  const lo = birthYear - ERA_WINDOW;
  const hi = birthYear + ERA_WINDOW;
  // No PREFIX lines needed — WDQS predefines wd:/wdt:/wikibase:/schema:/rdfs:.
  const query = `SELECT ?person ?personLabel ?desc ?birth ?death ?img ?links WHERE {
  VALUES ?occ { ${values} }
  ?person wdt:P106 ?occ ;
          wdt:P569 ?dob ;
          wikibase:sitelinks ?links .
  FILTER(?person != wd:${target.id})
  FILTER(?links >= 10)
  BIND(YEAR(?dob) AS ?birth)
  FILTER(?birth >= ${lo} && ?birth <= ${hi})
  OPTIONAL { ?person wdt:P570 ?dod . BIND(YEAR(?dod) AS ?death) }
  OPTIONAL { ?person wdt:P18 ?img }
  ?person rdfs:label ?personLabel . FILTER(LANG(?personLabel) = "en")
  OPTIONAL { ?person schema:description ?desc . FILTER(LANG(?desc) = "en") }
}
ORDER BY DESC(?links)
LIMIT 25`;

  return runWdqs(query, signal);
}

/**
 * Famous people *born in a given span* — the figures to propose when someone
 * taps an empty stretch of the timeline. Pure Wikidata: humans (P31=Q5) with a
 * birth year (P569) inside the window, gated to the genuinely notable by a
 * sitelink-count floor and ranked by that same global-fame signal, portraits
 * (P18) pulled in. Best-effort: throws to its caller, which backfills locally.
 *
 * The `?person` projection and the binding shape match `fetchPeersByOccupation`
 * so both feed the shared `runWdqs` parser.
 */
export async function fetchBornAround(
  startYear: number,
  endYear: number,
  signal?: AbortSignal,
  limit = 12,
): Promise<CelebrityResult[]> {
  const query = `SELECT ?person ?personLabel ?desc ?birth ?death ?img ?links WHERE {
  ?person wdt:P31 wd:Q5 ;
          wdt:P569 ?dob ;
          wikibase:sitelinks ?links .
  BIND(YEAR(?dob) AS ?birth)
  FILTER(?birth >= ${startYear} && ?birth <= ${endYear})
  FILTER(?links >= 60)
  OPTIONAL { ?person wdt:P570 ?dod . BIND(YEAR(?dod) AS ?death) }
  OPTIONAL { ?person wdt:P18 ?img }
  ?person rdfs:label ?personLabel . FILTER(LANG(?personLabel) = "en")
  OPTIONAL { ?person schema:description ?desc . FILTER(LANG(?desc) = "en") }
}
ORDER BY DESC(?links)
LIMIT ${limit}`;
  return runWdqs(query, signal);
}

/**
 * Run a WDQS SELECT and parse its bindings into `CelebrityResult`s. Expects the
 * standard projection used across this module — ?personLabel, ?birth, ?death,
 * ?img, ?desc — and keeps only rows with a usable birth year, de-duplicating by
 * name while preserving the query's own ORDER BY.
 */
async function runWdqs(
  query: string,
  signal?: AbortSignal,
): Promise<CelebrityResult[]> {
  const res = await fetch(`${WDQS}?format=json&query=${encodeURIComponent(query)}`, {
    signal: withTimeout(signal, 9000),
    headers: { Accept: "application/sparql-results+json" },
  });
  if (!res.ok) throw new Error(`wdqs ${res.status}`);
  const json = await res.json();

  const results: CelebrityResult[] = [];
  const seen = new Set<string>();
  for (const b of json.results?.bindings ?? []) {
    const name = b.personLabel?.value as string | undefined;
    const birth = Number.parseInt(b.birth?.value, 10);
    if (!name || Number.isNaN(birth) || seen.has(name)) continue;
    seen.add(name);
    const death = Number.parseInt(b.death?.value, 10);
    results.push({
      name,
      birthYear: birth,
      deathYear: Number.isNaN(death) ? undefined : death,
      imageUrl: commonsThumb(b.img?.value),
      blurb: b.desc?.value,
    });
  }
  return results;
}

/** Resolve a known name → its Wikidata id + occupation (P106) q-ids. */
async function resolveOccupations(
  name: string,
  signal?: AbortSignal,
): Promise<{ id: string; occupations: string[] } | null> {
  const searchUrl =
    `${WIKIPEDIA}?action=query&format=json&origin=*` +
    `&generator=search&gsrsearch=${encodeURIComponent(name)}&gsrlimit=1` +
    `&prop=pageprops&ppprop=wikibase_item`;
  const sres = await fetch(searchUrl, { signal });
  if (!sres.ok) return null;
  const sjson = await sres.json();
  const pages: WikiPage[] = Object.values(sjson.query?.pages ?? {});
  const id = pages[0]?.pageprops?.wikibase_item;
  if (!id) return null;

  const entUrl =
    `${WIKIDATA}?action=wbgetentities&props=claims&format=json&origin=*&ids=${id}`;
  const eres = await fetch(entUrl, { signal });
  if (!eres.ok) return null;
  const ejson = await eres.json();
  const claims: unknown[] = ejson.entities?.[id]?.claims?.P106 ?? [];
  const all = claims
    .map((c) => (c as Claim)?.mainsnak?.datavalue?.value?.id)
    .filter((q): q is string => typeof q === "string");
  // Prefer specific occupations; fall back to the broad ones only if that's all
  // there is, so the peer query stays focused (see UMBRELLA_OCCUPATIONS).
  const specific = all.filter((q) => !UMBRELLA_OCCUPATIONS.has(q));
  const occupations = (specific.length > 0 ? specific : all).slice(0, 4);
  return { id, occupations };
}

interface Claim {
  mainsnak?: { datavalue?: { value?: { id?: string } } };
}

/**
 * P18 hands back a Commons file URL (.../Special:FilePath/Name.jpg); appending
 * ?width= asks Commons for a sized thumbnail rather than the full-res original.
 */
function commonsThumb(url?: string): string | undefined {
  if (!url) return undefined;
  return `${url.replace(/^http:/, "https:")}?width=240`;
}

/**
 * A signal that aborts when the caller's signal does *or* after `ms` — WDQS can
 * occasionally hang, and we'd rather fall back to `morelike:` than stall.
 */
function withTimeout(signal: AbortSignal | undefined, ms: number): AbortSignal {
  const ctrl = new AbortController();
  if (signal?.aborted) ctrl.abort();
  else signal?.addEventListener("abort", () => ctrl.abort(), { once: true });
  const t = setTimeout(() => ctrl.abort(), ms);
  ctrl.signal.addEventListener("abort", () => clearTimeout(t), { once: true });
  return ctrl.signal;
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
      birthDate: life.birthDate,
      deathYear: life.deathYear,
      deathDate: life.deathDate,
      imageUrl: page.thumbnail?.source,
      blurb: page.description,
    });
  }
  return results;
}

interface Life {
  birthYear: number | null;
  birthDate?: string;
  deathYear?: number;
  deathDate?: string;
}

async function fetchYears(
  ids: string[],
  signal?: AbortSignal,
): Promise<Map<string, Life>> {
  const url =
    `${WIKIDATA}?action=wbgetentities&props=claims&format=json&origin=*` +
    `&ids=${ids.join("|")}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`wikidata entities ${res.status}`);
  const json = await res.json();

  const out = new Map<string, Life>();
  for (const id of ids) {
    const claims = json.entities?.[id]?.claims ?? {};
    out.set(id, {
      birthYear: yearFromClaim(claims.P569),
      birthDate: isoFromClaim(claims.P569),
      deathYear: yearFromClaim(claims.P570) ?? undefined,
      deathDate: isoFromClaim(claims.P570),
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

/**
 * Full ISO "YYYY-MM-DD" from a Wikidata claim, but only when the day is
 * actually known (precision 11). Wikidata pads imprecise dates with "-00" or
 * normalises them to Jan 1 at precision <11, so we return undefined there and
 * let the year-only path handle them — better an approximate age than a fake
 * January birthday.
 */
function isoFromClaim(claim: unknown): string | undefined {
  if (!Array.isArray(claim) || claim.length === 0) return undefined;
  const value = claim[0]?.mainsnak?.datavalue?.value;
  const time: string | undefined = value?.time;
  if (!time) return undefined;
  if (typeof value?.precision === "number" && value.precision < 11) return undefined;
  const m = /^\+(\d{4})-(\d{2})-(\d{2})/.exec(time); // CE, day precision only
  if (!m) return undefined;
  const [, year, month, day] = m;
  if (month === "00" || day === "00") return undefined;
  return `${year}-${month}-${day}`;
}
