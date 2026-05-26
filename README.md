# AgeLine

An interactive age-comparison **timeline instrument**. Place people on a luminous
timeline by birth year to feel the overlap between generations, eras, and lives.
The timeline *is* the product — there is no dashboard, no landing page, no menus.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle
```

## What it does

- **Place people** by birth year, from the 1700s to today.
- **Add a custom person** — name, birth year, optional portrait URL.
- **Search celebrities** — type a name and the app pulls in full name, birth year,
  and portrait live from Wikipedia / Wikidata (curated local hits show first).
- **Compare two people** — select any two cards to see the age gap and a line such as
  *"Albert Einstein was 90 when Lionel Messi was born."*
- **Navigate** — wheel/trackpad zoom, drag to pan with inertia, pinch on touch,
  and quick zoom / "jump to today" controls.
- **Dark / light themes** — toggle in the top bar; the whole palette is redesigned
  per theme (signature dark, or a warm "daylight" parchment) and remembered.
- Everything you add is saved to **localStorage**.

## Responsive behaviour

The layout is rebuilt per axis, not scaled:

| | Desktop | Mobile |
|---|---|---|
| Orientation | Horizontal (years left → right) | Vertical (years top → bottom) |
| Cards | Above / below the line | Left / right of the line |
| Initial view | Full overview of everyone | Recent ~80-year window, scroll up for history |
| Gestures | Wheel zoom · drag pan | Pinch zoom · touch pan |

## Architecture

```
src/
  types.ts                     Person / CelebrityResult shapes
  lib/
    age.ts                     age math + the compare() helper
    layout.ts                  collision-free lane assignment (no overlap)
    searchCelebrity.ts         celebrity provider abstraction  ← the swap seam
    webProvider.ts             live Wikipedia-search + Wikidata resolve provider
    storage.ts                 localStorage load/save
  data/
    celebrities.ts             local celebrity dataset
    starterPeople.ts           the seven seed people
  hooks/
    usePeople.ts               people collection mirrored to localStorage
    useTimelineView.ts         zoom / pan / inertia / pinch + viewport math
    useMediaQuery.ts           desktop vs. mobile axis
    useTheme.ts                dark / light theme, persisted to localStorage
  components/
    Timeline.tsx               the spine, grid, cards, connectors, comparison span
    PersonCard.tsx, Portrait.tsx, YearGrid.tsx, Controls.tsx
    ComparisonOverlay.tsx, Modal.tsx, AddPersonModal.tsx, CelebritySearchModal.tsx
```

### The celebrity data source

The UI only ever calls `searchCelebrity(name)`, backed by a `CelebrityProvider`.
The default is a **composite** that returns curated local hits first (instant,
hand-picked portraits) and then live web results, de-duplicated:

- `localProvider` — fuzzy match over the bundled dataset.
- `webProvider` — Wikipedia full-text search (ranks the famous person first, even
  for an ambiguous query like "Trump") → Wikidata resolves birth/death years.
  Both endpoints are CORS-enabled, so it runs entirely in the browser, no key.

Swapping in a different source (another database, a paid API) is one call and
touches no components:

```ts
import { setCelebrityProvider } from "./lib/searchCelebrity";

setCelebrityProvider({
  async search(query, signal) {
    // return CelebrityResult[]
  },
});
```

### Performance

Lane assignment is memoized on `(people, zoom)` and is scroll-independent. Only
people within the visible year range are rendered, so the line stays smooth no
matter how many people you add.

## Tech

React + TypeScript + Tailwind CSS, bundled with Vite.
