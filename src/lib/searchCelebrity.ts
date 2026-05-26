import type { CelebrityResult } from "../types";
import { CELEBRITY_DB } from "../data/celebrities";
import { webProvider, fetchRelated } from "./webProvider";

/**
 * A celebrity data provider. The app only ever talks to this interface, so the
 * backing source (local dataset, Wikipedia, Wikidata, a web-search API, …) can
 * be swapped without touching the UI.
 */
export interface CelebrityProvider {
  search(query: string, signal?: AbortSignal): Promise<CelebrityResult[]>;
}

/** Curated, instant matches against the bundled dataset. */
export const localProvider: CelebrityProvider = {
  async search(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return CELEBRITY_DB.map((c) => ({
      c,
      score: matchScore(c.name.toLowerCase(), q),
    }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((r) => r.c);
  },
};

/**
 * Default provider: curated local hits first (fast, hand-picked portraits),
 * then live web results from Wikidata, de-duplicated by name. If the network
 * is unavailable the local results still come through.
 */
export const compositeProvider: CelebrityProvider = {
  async search(query, signal) {
    const [local, web] = await Promise.allSettled([
      localProvider.search(query, signal),
      webProvider.search(query, signal),
    ]);
    const localResults = local.status === "fulfilled" ? local.value : [];
    const webResults = web.status === "fulfilled" ? web.value : [];

    const seen = new Set<string>();
    const merged: CelebrityResult[] = [];
    for (const r of [...localResults, ...webResults]) {
      const key = `${r.name.toLowerCase()}|${r.birthYear}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(r);
    }
    return merged.slice(0, 12);
  },
};

let activeProvider: CelebrityProvider = compositeProvider;

export function setCelebrityProvider(provider: CelebrityProvider): void {
  activeProvider = provider;
}

/**
 * Clean public entry point used throughout the app.
 *   const results = await searchCelebrity("einstein");
 */
export function searchCelebrity(
  name: string,
  signal?: AbortSignal,
): Promise<CelebrityResult[]> {
  return activeProvider.search(name, signal);
}

/**
 * Coarse "field of renown" buckets. People relate most naturally when they're
 * known for the same kind of thing, so we map the free-text blurb/description
 * (curated "Footballer" or a Wikipedia "Argentine professional footballer")
 * onto one of these and treat a shared bucket as the strongest signal.
 */
const FIELDS: Record<string, string[]> = {
  music: ["singer", "songwriter", "composer", "musician", "rapper", "pianist", "violinist", "conductor"],
  sport: ["footballer", "football", "soccer", "basketball", "tennis", "athlete", "player", "boxer", "sprinter", "cricketer", "golfer", "racing", "driver", "swimmer", "gymnast"],
  science: ["physicist", "chemist", "scientist", "naturalist", "mathematician", "biologist", "astronomer", "engineer", "inventor"],
  politics: ["president", "statesman", "monarch", "emperor", "empress", "politician", "leader", "minister", "queen", "king", "chancellor", "senator", "diplomat", "revolutionary"],
  art: ["painter", "artist", "sculptor", "architect", "illustrator", "photographer"],
  business: ["entrepreneur", "founder", "co-founder", "businessman", "businesswoman", "ceo", "investor", "industrialist", "magnate"],
  screen: ["actor", "actress", "filmmaker", "director", "producer", "comedian", "performer"],
  letters: ["writer", "author", "poet", "novelist", "playwright", "philosopher"],
  activism: ["activist", "campaigner", "reformer", "humanitarian"],
};

function fieldsOf(blurb?: string): Set<string> {
  const out = new Set<string>();
  if (!blurb) return out;
  const text = blurb.toLowerCase();
  for (const [field, words] of Object.entries(FIELDS)) {
    if (words.some((w) => text.includes(w))) out.add(field);
  }
  return out;
}

/**
 * Suggest a handful of figures that "relate like" the one just added. Primary
 * source is the live web (Wikipedia `morelike:` relevance — genuinely the same
 * scene: a rapper gets other rappers, a physicist other physicists). If the
 * network is unavailable or thin, it backfills from the curated local dataset
 * by shared field of renown + era. Never throws; `exclude` names (typically
 * whoever is already on the timeline) are skipped.
 */
export async function suggestSimilar(
  target: CelebrityResult,
  exclude: Iterable<string> = [],
  signal?: AbortSignal,
  limit = 5,
): Promise<CelebrityResult[]> {
  const skip = new Set([target.name, ...exclude].map((n) => n.toLowerCase()));

  const web = await fetchRelated(target.name, signal).catch(() => []);
  const out: CelebrityResult[] = [];
  for (const r of web) {
    const key = r.name.toLowerCase();
    if (skip.has(key)) continue;
    skip.add(key);
    out.push(r);
    if (out.length >= limit) return out;
  }

  // The web gives genuinely related peers — only fall back to the curated set
  // when it returns nothing (offline / no match), never to pad real results
  // with unrelated locals.
  if (out.length > 0) return out;
  return localSuggest(target, skip, limit);
}

/** Curated-dataset fallback: shared field of renown first, then era. */
function localSuggest(
  target: CelebrityResult,
  skip: Set<string>,
  limit: number,
): CelebrityResult[] {
  if (limit <= 0) return [];
  const targetFields = fieldsOf(target.blurb);
  const targetDead = target.deathYear != null;

  return CELEBRITY_DB.filter((c) => !skip.has(c.name.toLowerCase()))
    .map((c) => {
      const shared = [...fieldsOf(c.blurb)].filter((f) => targetFields.has(f));
      const gap = Math.abs(c.birthYear - target.birthYear);
      const era = 3 * Math.max(0, 1 - gap / 60); // contemporaries score higher
      const sameStatus = (c.deathYear != null) === targetDead ? 0.6 : 0;
      return { c, gap, score: shared.length * 4 + era + sameStatus };
    })
    .sort((a, b) => b.score - a.score || a.gap - b.gap)
    .slice(0, limit)
    .map((r) => r.c);
}

/**
 * Resolve a single best-guess portrait URL for a known name via the web
 * provider. Used to hydrate the seed people without bundling their images.
 * Returns undefined (never throws) so callers can treat it as best-effort.
 */
export async function fetchPortrait(
  name: string,
  signal?: AbortSignal,
): Promise<string | undefined> {
  try {
    const results = await webProvider.search(name, signal);
    const exact = results.find(
      (r) => r.name.toLowerCase() === name.toLowerCase(),
    );
    return (exact ?? results[0])?.imageUrl;
  } catch {
    return undefined;
  }
}

function matchScore(name: string, query: string): number {
  if (name === query) return 100;
  if (name.startsWith(query)) return 80;
  // Match on any word boundary, e.g. "ronaldo" → "Cristiano Ronaldo".
  if (name.split(" ").some((w) => w.startsWith(query))) return 60;
  if (name.includes(query)) return 40;
  return 0;
}
